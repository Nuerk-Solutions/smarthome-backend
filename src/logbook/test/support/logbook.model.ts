import { MockModel } from '../../../database/test/support/mock.model';
import { Logbook } from '../../core/schemas/logbook.schema';
import { logbookStub } from '../stubs/logbook.stub';

export class LogbookModel extends MockModel<Logbook> {
  protected entityStub = logbookStub();
}
