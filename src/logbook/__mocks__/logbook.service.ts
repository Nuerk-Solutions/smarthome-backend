import { basicLogbookStub } from '../test/stubs/basic.logbook.stub';

/**
 * <h1>Reminder</h1>
 * MockReturnValue is used for non-async functions
 * MockResolvedValue is used for async functions
 */

export const LogbookService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(basicLogbookStub()),
  findAll: jest.fn().mockResolvedValue([basicLogbookStub()]),
  findLatest: jest.fn().mockResolvedValue([basicLogbookStub()]),
  update: jest.fn().mockResolvedValue(basicLogbookStub()),
  create: jest.fn().mockResolvedValue(basicLogbookStub()),
  remove: jest.fn().mockResolvedValue({ success: true }),
});
