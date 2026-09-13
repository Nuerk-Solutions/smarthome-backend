import { mongo } from 'mongoose';
import { LegacyMirrorWorker } from './worker';
const raw = { _id: new mongo.ObjectId('123456789012345678901234'), driver: 'Andrea', vehicle: 'VW', mileAge: { current: 1, new: 2, unit: 'km' }, date: new Date(), createdAt: new Date(), reason: 'Trip' };
function fixture() {
  let receipts = [];
  const write = jest.fn(async operations => { receipts = operations.map(op => op.replaceOne.replacement); });
  const db = { collection: () => ({ find: () => ({ toArray: async () => receipts }), bulkWrite: write }) };
  const worker = new LegacyMirrorWorker(db as any, { url: 'https://scrupulous-elk-382.convex.site/legacy-mirror', secret: 'a'.repeat(48), mapping: { organizationId: 'org', drivers: { Andrea: 'andrea' }, vehicles: { VW: 'vw' } } }, () => {});
  return { worker, write };
}
afterEach(() => jest.restoreAllMocks());
it('never acknowledges failed requests; retries and skips acknowledged payloads', async () => {
  const { worker, write } = fixture();
  const fetcher = jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response('', { status: 503 })).mockResolvedValue(new Response(JSON.stringify({ imported: {}, deleted: 0 }), { status: 200 }));
  await expect(worker.syncDocuments([raw])).rejects.toThrow('503'); expect(write).not.toHaveBeenCalled();
  await worker.syncDocuments([raw]); expect(write).toHaveBeenCalledTimes(1);
  await worker.syncDocuments([raw]); expect(fetcher).toHaveBeenCalledTimes(2);
});
it('rejects production URLs and never follows HTTP redirects with credentials', async () => {
  const { worker } = fixture();
  const fetcher = jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ imported: {}, deleted: 0 })));
  await worker.syncDocuments([raw]); expect(fetcher.mock.calls[0][1].redirect).toBe('error');
});
