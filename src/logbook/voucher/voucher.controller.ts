import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherCreateDto, VoucherDto } from '../core/dto/voucher.dto';

@Controller()
export class VoucherController {
  constructor(private readonly _voucherService: VoucherService) {
  }
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  async list() {
    return await this._voucherService.list();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  async create(@Body() voucher: VoucherCreateDto) {
    return await this._voucherService.create(voucher);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/redeem')
  async redeem(@Body() code: VoucherDto) {
    return await this._voucherService.redeem(code);
  }
}
