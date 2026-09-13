import { mongo } from 'mongoose';
import { fingerprint, mapEntry } from './mapper';
const mapping = { organizationId: 'org', drivers: { Andrea: 'andrea' }, vehicles: { MX5: 'mx5' } };
const raw = () => ({ _id: new mongo.ObjectId('123456789012345678901234'), driver: 'Andrea', vehicle: 'MX5',
  mileAge: { current: 100, new: 130, unit: 'mile', difference: 30 }, date: new Date('2024-01-01'), createdAt: new Date('2024-01-02'),
  reason: 'Trip', details: { notes: 'note' }, refuel: { liters: mongo.Decimal128.fromString('20.5'), price: mongo.Decimal128.fromString('40'), isSpecial: true } });
it('maps Decimal128, miles, verified identity mapping and notes', () => {
  expect(mapEntry(raw(), mapping)).toMatchObject({ driverId: 'andrea', vehicleId: 'mx5', distanceUnit: 'mi', notes: 'note', refueling: { quantity: 20.5, totalPrice: 40, isFull: false } });
});
it('ignores derived changes while tracking meaningful changes', () => {
  const a = raw(); const b = raw(); b.mileAge.difference = 999;
  expect(fingerprint(mapEntry(a, mapping))).toBe(fingerprint(mapEntry(b, mapping)));
  b.details.notes = 'changed';
  expect(fingerprint(mapEntry(a, mapping))).not.toBe(fingerprint(mapEntry(b, mapping)));
});
it('rejects unknown drivers and invalid source data rather than assigning the owner', () => {
  const a = raw(); a.driver = 'Unknown'; expect(() => mapEntry(a, mapping)).toThrow();
  a.driver = 'Andrea'; a.mileAge.new = 1; expect(() => mapEntry(a, mapping)).toThrow();
});
