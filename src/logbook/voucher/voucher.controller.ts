import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherCreateDto, VoucherDto } from '../core/dto/voucher.dto';
import {Voucher} from "../core/schemas/vouchers.schema";
import {Driver} from "../core/enums/driver.enum";

@Controller()
export class VoucherController {
  constructor(private readonly _voucherService: VoucherService) {
  }
  @HttpCode(HttpStatus.OK)
  @Get('/list/:redeemer?')
  async list(@Param('redeemer') redeemer?: Driver): Promise<Voucher[]> {
    return await this._voucherService.list(redeemer);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  async create(@Body() voucher: VoucherCreateDto){
    return await this._voucherService.create(voucher);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/redeem/:redeemer')
  async redeem(@Body() code: VoucherDto, @Param('redeemer') redeemer: Driver): Promise<boolean> {
    const result = await this._voucherService.redeem(code, redeemer);
    return result.redeemed;
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':code')
  async delete(@Param('code') code: string) {
    return await this._voucherService.deleteVoucher(code)
  }
}
