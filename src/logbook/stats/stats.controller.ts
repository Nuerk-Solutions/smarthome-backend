import {Controller, Get, HttpCode, HttpStatus, Query} from '@nestjs/common';
import {StatsService} from './stats.service';
import {DateParameter} from '../core/dto/parameters/date.parameter';
import {ParseArray} from '../core/validation/pipes/ParseEnumArray.pipe';
import {DriverParameter} from '../core/dto/parameters/driver.parameter';
import {Driver} from '../core/enums/driver.enum';
import {VehicleParameter} from '../core/dto/parameters/vehicle.parameter';
import {Vehicle} from '../core/enums/vehicle-typ.enum';

@Controller()
export class StatsController {
    constructor(private readonly _statsService: StatsService) {
    }

    // @HttpCode(HttpStatus.OK)
    // @Get('/average')
    // async getAverageConsumption() {
    //     return await this._statsService.getAverageVehicleConsumption();
    // }

    @HttpCode(HttpStatus.OK)
    @Get('/driver')
    async getDriverStats(
        @Query() date: DateParameter,
        @Query(
            'drivers',
            new ParseArray({
                items: DriverParameter,
                type: Driver,
                separator: ',',
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
            drivers?: DriverParameter[],
        @Query(
            'vehicles',
            new ParseArray({
                items: VehicleParameter,
                type: Vehicle,
                emptyHandling: {
                    allow: true,
                    allCases: true,
                },
                separator: ',',
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
            vehicles?: VehicleParameter[],
        @Query('detailed') detailed?: boolean,
    ) {
        return await this._statsService.calculateDriverStats(drivers, date.startDate, date.endDate, vehicles, detailed);
    }

    // @HttpCode(HttpStatus.OK)
    // @Get('/vehicle')
    // async getVehicleStats(
    //     @Query() date: DateParameter,
    //     @Query(
    //         'vehicles',
    //         new ParseArray({
    //             items: VehicleParameter,
    //             type: Vehicle,
    //             emptyHandling: {
    //                 allow: true,
    //                 allCases: true,
    //             },
    //             separator: ',',
    //             errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
    //         }),
    //     )
    //         vehicles?: VehicleParameter[],
    // ) {
    //     return await this._statsService.calculateVehicleStats(vehicles, date.startDate, date.endDate);
    // }
}
