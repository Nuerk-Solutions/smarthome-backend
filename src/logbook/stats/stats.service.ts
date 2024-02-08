import { Injectable } from '@nestjs/common';
import { DriverParameter } from '../core/dto/parameters/driver.parameter';
import { Driver } from '../core/enums/driver.enum';
import { LogbooksRepository } from '../repositories/logbooks.repository';

@Injectable()
export class StatsService {
  constructor(
    private readonly logbooksRepository: LogbooksRepository) {
  }

  async getDriverStats(drivers: DriverParameter[] | Driver[], startDate?: Date, endDate?: Date): Promise<DriverStats[]> {
    const data = await this.logbooksRepository.getDriverStats(drivers, startDate, endDate);
    return data.sort((a, b) => a.driver > b.driver ? 1 : -1)
  }
}
