import { Test } from '@nestjs/testing';
import { LogbookController } from '../logbook.controller';
import { LogbookService } from '../logbook.service';
import { basicLogbookStub } from './stubs/basic.logbook.stub';
import { Logbook } from '../core/schemas/logbook.schema';
import { CreateLogbookDto } from '../core/dto/create-logbook.dto';
import { UpdateLogbookDto } from '../core/dto/update-logbook.dto';
import { Driver } from '../core/enums/driver.enum';

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
      let logbook: Logbook;
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
      let logbooks: Logbook[];
      beforeEach(async () => {
        logbooks = await logbookController.findLatest();
      });

      test('then it should call logbookService', () => {
        expect(logbookService.findLatest).toBeCalled();
      });

      test('then it should return all latest logbooks', () => {
        expect(logbooks).toEqual([basicLogbookStub()]);
      });
    });
  });

  // Todo: Impl more cases
  describe('findAll', () => {
    describe('when findAll is called', () => {
      let paginationResult: PaginateResult<Logbook>;
      beforeEach(async () => {
        paginationResult = await logbookController.findAll();
        // IMPORTANT: The paginationResult returns for some reason a LogbookArray instead of a PaginationResult<Logbook>
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
      let logbook: Logbook;
      let createLogbookDto: CreateLogbookDto;

      beforeEach(async () => {
        createLogbookDto = {
          additionalInformation: basicLogbookStub().additionalInformation,
          additionalInformationCost: basicLogbookStub().additionalInformationCost,
          additionalInformationTyp: basicLogbookStub().additionalInformationTyp,
          currentMileAge: basicLogbookStub().currentMileAge,
          date: basicLogbookStub().date,
          driveReason: basicLogbookStub().driveReason,
          driver: basicLogbookStub().driver,
          forFree: basicLogbookStub().forFree,
          newMileAge: basicLogbookStub().newMileAge,
          vehicleTyp: basicLogbookStub().vehicleTyp,
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
      let logbook: Logbook;
      let updateLogbookDto: UpdateLogbookDto;

      beforeEach(async () => {
        updateLogbookDto = {
          driver: Driver.ANDREA,
          // currentMileAge: '2000', -> checked now in the service
          newMileAge: '2002',
          forFree: true,
          driveReason: 'Updated drive reason',
          additionalInformation: 'Updated additional information',
          additionalInformationCost: 'Updated additional information cost',
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
