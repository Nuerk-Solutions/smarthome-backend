import {Test, TestingModule} from '@nestjs/testing';
import {LogbookController} from '../../logbook.controller';
import {LogbookService} from '../../logbook.service';
import {CreateLogbookDto} from '../../core/dto/create-logbook.dto';
import {Driver} from '../../core/enums/driver.enum';
import {Vehicle} from '../../core/enums/vehicle-typ.enum';
import {Types} from 'mongoose';
import {Unit} from "../../core/enums/unit.enum";

describe('LogbookController', () => {
    let controller: LogbookController;
    let service: LogbookService;

    const date1: Date = new Date();
    const date2: Date = new Date(date1.getTime() + 1000);
    const date3: Date = new Date(date2.getTime() + 1000);

    const createLogbookDto: CreateLogbookDto = {
        driver: Driver.ANDREA,
        vehicle: Vehicle.FERRARI,
        mileAge: {
            current: 123,
            new: 456,
            unit: Unit.KM,
        },
        date: date1,
        reason: 'Drive Reason',
        refuel: {
            liters: 20,
            price: 40,
            isSpecial: false,
        },
        details: {
            covered: false,
            driver: Driver.CLAUDIA,
        },
    };

    const mockLogbook = {
        driver: Driver.ANDREA,
        vehicle: Vehicle.FERRARI,
        mileAge: {
            current: 123,
            new: 456,
            unit: Unit.KM,
            difference: 333,
            cost: 66.6,
        },
        date: date1,
        reason: 'Drive Reason',
        refuel: {
            liters: 20,
            price: 40,
            distanceDifference: 0,
            consumption: 0,
            previousRecordId: null,
            isSpecial: false,
        },
        _id: new Types.ObjectId(),
        createdAt: 'a timestemp',
        updatedAt: 'a timestemp',
        details: {
            covered: false,
            driver: Driver.CLAUDIA,
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogbookController],
            providers: [
                {
                    provide: LogbookService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([
                            {
                                driver: Driver.ANDREA,
                                vehicle: Vehicle.FERRARI,
                                mileAge: {
                                    current: 123,
                                    new: 456,
                                    unit: Unit.KM,
                                },
                                date: date1,
                                reason: 'Drive Reason #1',
                            },
                            {
                                driver: Driver.CLAUDIA,
                                vehicle: Vehicle.VW,
                                mileAge: {
                                    current: 456,
                                    new: 789,
                                    unit: Unit.KM,
                                },
                                date: date2,
                                reason: 'Drive Reason #2',
                                refuel: {
                                    liters: 20.4,
                                    price: 40.6,
                                    isSpecial: false,
                                },
                            },
                            {
                                driver: Driver.THOMAS,
                                vehicle: Vehicle.FERRARI,
                                mileAge: {
                                    current: 101112,
                                    new: 131415,
                                    unit: Unit.KM,
                                },
                                date: date3,
                                reason: 'Drive Reason #3',
                                service: {
                                    message: 'Windschutzscheibe ersetzt.',
                                    price: 300,
                                },
                            },
                        ]),
                        create: jest.fn().mockResolvedValue(createLogbookDto),
                    },
                },
            ],
        }).compile();

        controller = module.get<LogbookController>(LogbookController);
        service = module.get<LogbookService>(LogbookService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('create()', () => {
        it('should create a new Logbook', async () => {
            const createSpy = jest.spyOn(service, 'create').mockResolvedValueOnce(mockLogbook);

            await controller.create(createLogbookDto);
            expect(createSpy).toHaveBeenCalledWith(createLogbookDto);
        });
    });

    describe('findAll()', () => {
        it('should return all Logbook', async () => {
            await expect(controller.findAll()).resolves.toEqual([
                {
                    driver: Driver.ANDREA,
                    vehicle: Vehicle.FERRARI,
                    mileAge: {
                        current: 123,
                        new: 456,
                        unit: Unit.KM,
                    },
                    date: date1,
                    reason: 'Drive Reason #1',
                },
                {
                    driver: Driver.CLAUDIA,
                    vehicle: Vehicle.VW,
                    mileAge: {
                        current: 456,
                        new: 789,
                        unit: Unit.KM,
                    },
                    date: date2,
                    reason: 'Drive Reason #2',
                    refuel: {
                        liters: 20.4,
                        price: 40.6,
                        isSpecial: false,
                    },
                },
                {
                    driver: Driver.THOMAS,
                    vehicle: Vehicle.FERRARI,
                    mileAge: {
                        current: 101112,
                        new: 131415,
                        unit: Unit.KM,
                    },
                    date: date3,
                    reason: 'Drive Reason #3',
                    service: {
                        message: 'Windschutzscheibe ersetzt.',
                        price: 300,
                    },
                },
            ]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });
});
