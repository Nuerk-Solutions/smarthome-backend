import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from '../core/schemas/vouchers.schema';
import { VoucherRepository } from '../repositories/voucher.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: Voucher.name,
          useFactory: () => VoucherSchema,
        },
      ],
      'logbook',
    ),
  ],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherRepository],
  exports: [VoucherService],
})
export class VoucherModule {
}
