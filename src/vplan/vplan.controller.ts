import { Controller, Get, Header } from '@nestjs/common';
import { VplanService } from './vplan.service';

@Controller('vplan')
export class VplanController {
  constructor(private readonly vplanService: VplanService) {}

  @Get()
  @Header('Content-Type', 'application/pdf')
  get() {
    return this.vplanService.get();
  }
}
