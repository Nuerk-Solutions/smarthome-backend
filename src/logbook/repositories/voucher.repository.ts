import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import { EntityRepository } from '../../database/entity.repository';
import { Voucher, VoucherDocument } from '../core/schemas/vouchers.schema';

@Injectable()
export class VoucherRepository extends EntityRepository<VoucherDocument> {
  constructor(@InjectModel(Voucher.name, 'logbook') private readonly voucherModel: Model<VoucherDocument>) {
    super(voucherModel);
  }
}
