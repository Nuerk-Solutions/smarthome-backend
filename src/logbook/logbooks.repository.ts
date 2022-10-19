import { EntityRepository } from '../database/entity.repository';
import { Logbook, LogbookDocument } from './core/schemas/logbook.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogbooksRepository extends EntityRepository<LogbookDocument> {
  constructor(@InjectModel(Logbook.name) logbookModel: Model<LogbookDocument>) {
    super(logbookModel);
  }
}
