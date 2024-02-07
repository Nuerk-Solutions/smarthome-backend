import {Test} from '@nestjs/testing';
import {LogbookController} from '../logbook.controller';
import {LogbookService} from '../logbook.service';
import {basicLogbookStub} from './stubs/basic.logbook.stub';
import {NewLogbook} from '../core/schemas/logbook.schema';
import {CreateLogbookDto} from '../core/dto/create-logbook.dto';
import {UpdateLogbookDto} from '../core/dto/update-logbook.dto';
import {Driver} from '../core/enums/driver.enum';
import {Unit} from "../core/enums/unit.enum";

jest.mock('../logbook.service');

describe('LogbookController', () => {
    let logbookController: LogbookController;
    let logbookService: LogbookService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [LogbookController],
            providers: [LogbookService],
        }).compile();

        logbookController = moduleRef.get<LogbookController>(LogbookController);
        logbookService = moduleRef.get<LogbookService>(LogbookService);

        jest.clearAllMocks();
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            let logbook: NewLogbook;
            beforeEach(async () => {
                logbook = await logbookController.findOne(basicLogbookStub()._id.toString());
            });

            test('then it should call logbookService', () => {
                expect(logbookService.findOne).toBeCalledWith(basicLogbookStub()._id.toString());
            });

            test('then it should return a logbook', () => {
                expect(logbook).toEqual(basicLogbookStub());
            });
        });
    });

    describe('findLatest', () => {
        describe('when findLatest is called', () => {
            let logbooks: PaginateResult<NewLogbook>;
            beforeEach(async () => {
                logbooks = await logbookController.findLatest();
            });

            test('then it should call logbookService', () => {
                expect(logbookService.findLatest).toBeCalled();
            });

            test('then it should return all latest logbooks', () => {
                expect(logbooks.data).toEqual([basicLogbookStub()]);
            });
        });
    });

    // Todo: Impl more cases
    describe('findAll', () => {
        describe('when findAll is called', () => {
            let paginationResult: PaginateResult<NewLogbook>;
            beforeEach(async () => {
                paginationResult = await logbookController.findAll();
                // IMPORTANT: The paginationResult returns for some reason a LogbookArray instead of a PaginationResult<NewLogbook>
            });

            test('then it should call logbookService', () => {
                expect(logbookService.findAll).toHaveBeenCalled();
            });

            test('then it should return a array of logbooks', () => {
                expect(paginationResult).toEqual([basicLogbookStub()]);
            });
        });
    });

    describe('create', () => {
        describe('when create is called', () => {
            let logbook: NewLogbook;
            let createLogbookDto: CreateLogbookDto;

            beforeEach(async () => {
                createLogbookDto = {
                    // additionalInformation: basicLogbookStub().additionalInformation,
                    // additionalInformationCost: basicLogbookStub().additionalInformationCost,
                    // additionalInformationTyp: basicLogbookStub().additionalInformationTyp,
                    // currentMileAge: basicLogbookStub().currentMileAge,
                    mileAge: {
                        current: basicLogbookStub().mileAge.current,
                        new: basicLogbookStub().mileAge.new,
                        unit: Unit[basicLogbookStub().mileAge.unit],
                    },
                    details: {
                        driver: basicLogbookStub().details.driver,
                        covered: basicLogbookStub().details.covered,
                    },
                    date: basicLogbookStub().date,
                    reason: basicLogbookStub().reason,
                    driver: basicLogbookStub().driver,
                    vehicle: basicLogbookStub().vehicle,
                };
                logbook = await logbookController.create(createLogbookDto);
            });

            test('then it should call logbookService', () => {
                expect(logbookService.create).toHaveBeenCalledWith(createLogbookDto);
            });

            test('then it should return a logbooks', () => {
                expect(logbook).toEqual(basicLogbookStub());
            });
        });
    });

    describe('update', () => {
        describe('when update is called', () => {
            let logbook: NewLogbook;
            let updateLogbookDto: UpdateLogbookDto;

            beforeEach(async () => {
                updateLogbookDto = {
                    driver: Driver.ANDREA,
                    // currentMileAge: '2000', -> checked now in the service
                    mileAge: {
                        new: 2002,
                        unit: Unit.KM,
                    },
                    details: {
                        covered: true,
                    },
                    reason: 'Updated drive reason',
                };
                logbook = await logbookController.update(basicLogbookStub()._id.toString(), updateLogbookDto);
            });

            test('then it should call logbookService', () => {
                expect(logbookService.update).toHaveBeenCalledWith(basicLogbookStub()._id.toString(), updateLogbookDto);
            });

            test('then it should return a logbooks', () => {
                expect(logbook).toEqual(basicLogbookStub());
            });
        });
    });

    describe('remove', () => {
        describe('when remove is called', () => {
            beforeEach(async () => {
                await logbookController.remove('asd');
            });

            test('then it should call logbookService', () => {
                expect(logbookService.remove).toHaveBeenCalledWith('asd');
            });
        });
    });
});
