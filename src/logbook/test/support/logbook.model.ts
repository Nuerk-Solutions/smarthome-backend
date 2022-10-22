import { MockModel } from '../../../database/test/support/mock.model';
import { Logbook } from '../../core/schemas/logbook.schema';
import { basicLogbookStub } from '../stubs/basic.logbook.stub';

export class LogbookModel extends MockModel<Logbook> {
  protected entityStub = basicLogbookStub();
}
