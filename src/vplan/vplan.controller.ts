import { Controller, Get, Header, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { VplanService } from './vplan.service';

@Controller('vplan')
export class VplanController {
  constructor(private readonly vplanService: VplanService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  get(@Res() response) {
    return this.vplanService.get(response);
  }
}
