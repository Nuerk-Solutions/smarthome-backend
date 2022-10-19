import { logbookStub } from '../test/stubs/logbook.stub';

/**
 * <h1>Reminder</h1>
 * MockReturnValue is used for non-async functions
 * MockResolvedValue is used for async functions
 */

export const LogbookService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(logbookStub()),
  findAll: jest.fn().mockResolvedValue([logbookStub()]),
  findLatest: jest.fn().mockResolvedValue([logbookStub()]),
  update: jest.fn().mockResolvedValue(logbookStub()),
  create: jest.fn().mockResolvedValue(logbookStub()),
  remove: jest.fn().mockResolvedValue(logbookStub()),
});
