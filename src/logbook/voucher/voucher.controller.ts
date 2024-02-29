import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherCreateDto, VoucherDto } from '../core/dto/voucher.dto';
import {Voucher} from "../core/schemas/vouchers.schema";

@Controller()
export class VoucherController {
  constructor(private readonly _voucherService: VoucherService) {
  }
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  async list(): Promise<Voucher[]> {
    return await this._voucherService.list();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  async create(@Body() voucher: VoucherCreateDto): Promise<boolean> {
    const result = await this._voucherService.create(voucher);
    return result != null && result.isExpired == false;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/redeem')
  async redeem(@Body() code: VoucherDto): Promise<boolean> {
    const result = await this._voucherService.redeem(code);
    return result.redeemed;
  }
}
