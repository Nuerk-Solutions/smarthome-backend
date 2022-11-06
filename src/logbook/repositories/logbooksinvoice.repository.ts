import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../../database/entity.repository';
import { LogbookInvoice, LogbookInvoiceDocument } from '../core/schemas/logbook-invoice.schema';

@Injectable()
export class LogbooksInvoiceRepository extends EntityRepository<LogbookInvoiceDocument> {
  constructor(
    @InjectModel(LogbookInvoice.name, 'logbook')
    private readonly logbookInvoiceDocumentModel: Model<LogbookInvoiceDocument>,
  ) {
    super(logbookInvoiceDocumentModel);
  }
}
