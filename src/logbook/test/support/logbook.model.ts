import { MockModel } from '../../../database/test/support/mock.model';
import { NewLogbook } from '../../core/schemas/logbook.schema';
import { basicLogbookStub } from '../stubs/basic.logbook.stub';

export class LogbookModel extends MockModel<NewLogbook> {
  protected entityStub = basicLogbookStub();
}
