import { Module } from '@nestjs/common';
import { VplanService } from './vplan.service';
import { VplanController } from './vplan.controller';

@Module({
  controllers: [VplanController],
  providers: [VplanService],
})
export class VplanModule {}
