import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VplanService } from './vplan.service';

@Controller('vplan')
export class VplanController {
  constructor(private readonly vplanService: VplanService) {}

  @Get()
  async get() {
    return this.vplanService.get();
  }
}
