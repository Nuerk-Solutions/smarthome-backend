import { BadRequestException, Injectable } from '@nestjs/common';
import { VoucherRepository } from '../repositories/voucher.repository';
import { VoucherCreateDto, VoucherDto, VoucherUpdateDto } from '../core/dto/voucher.dto';
import { DISTANCE_COST } from '../../core/utils/constatns';
import {Driver} from "../core/enums/driver.enum";

@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepository: VoucherRepository) {
  }

  async list(redeemer: Driver) {
    return await this.voucherRepository.find({redeemer: redeemer});
  }

  async create(voucher: VoucherCreateDto) {
    let code = this.generateVoucherCode(10);
    while (await this.voucherRepository.findOne({ code })) {
      code = this.generateVoucherCode(10);
    }

    const newVoucher = {
      ...voucher,
      code,
      distance: voucher.value / DISTANCE_COST,
      isExpired: false,
      redeemed: false,
      remainingDistance: voucher.value / DISTANCE_COST,
    };

    return await this.voucherRepository.create(newVoucher);
  }

  async redeem(voucherDto: VoucherDto, redeemer: Driver) {
    if (await this.isVoucherValid(voucherDto.code))
      return await this.voucherRepository.findOneAndUpdate({ code: voucherDto.code }, { redeemed: true, redeemer: redeemer });
  }

  async getVoucherByCode(code: string) {
    return await this.voucherRepository.findOne({ code });
  }

  async subtractDistance(code: string, distance: number) {
    const voucher = await this.getVoucherByCode(code);
    const newDistance = Math.max(0, voucher.remainingDistance - distance);
    return await this._updateVoucher({ code, remainingDistance: newDistance });
  }

  async getRemainingCoveredDistance(code: string, distance: number) {
    const voucher = await this.getVoucherByCode(code);
    const diff = voucher.remainingDistance - distance;
    if (diff < 0)
      return voucher.remainingDistance;
    return distance;
  }

  async isVoucherValid(code: string): Promise<boolean> {
    const voucher = await this.voucherRepository.findOne({ code: code });
    if (!voucher)
      throw new BadRequestException('Voucher not found');

    if (voucher.redeemed)
      throw new BadRequestException('Voucher already redeemed');

    if (voucher.isExpired)
      throw new BadRequestException('Voucher is expired');

    if (voucher.expiration < new Date()) {
      await this._updateVoucher({ code: code, isExpired: true });
      throw new BadRequestException('Voucher is expired');
    }
    return true;
  }

  private generateVoucherCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let voucherCode = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      voucherCode += characters.charAt(randomIndex);
    }

    return voucherCode;
  }

  private async _updateVoucher(voucherUpdateDto: VoucherUpdateDto) {
    return await this.voucherRepository.findOneAndUpdate({ code: voucherUpdateDto.code }, voucherUpdateDto);
  }

  async deleteVoucher(code: string) {
    const voucherCode = await this.voucherRepository.findOne({code: code})
    if (voucherCode.redeemed) {
      throw new BadRequestException("Voucher code is redeemed and cannot be deleted!")
    }
    return await this.voucherRepository.deleteOneById(voucherCode._id)
  }
}
