import { Test } from '@nestjs/testing';
import { LogbookController } from '../logbook.controller';
import { LogbookService } from '../logbook.service';
import { logbookStub } from './stubs/logbook.stub';
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
        logbook = await logbookController.findOne(logbookStub()._id.toString());
      });

      test('then it should call logbookService', () => {
        expect(logbookService.findOne).toBeCalledWith(logbookStub()._id.toString());
      });

      test('then it should return a logbook', () => {
        expect(logbook).toEqual(logbookStub());
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
        expect(logbooks).toEqual([logbookStub()]);
      });
    });
  });

  // Todo: Impl more cases
  describe('findAll', () => {
    describe('when findAll is called', () => {
      let logbooks: Logbook[];
      beforeEach(async () => {
        logbooks = await logbookController.findAll();
      });

      test('then it should call logbookService', () => {
        expect(logbookService.findAll).toHaveBeenCalled();
      });

      test('then it should return a array of logbooks', () => {
        expect(logbooks).toEqual([logbookStub()]);
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let logbook: Logbook;
      let createLogbookDto: CreateLogbookDto;

      beforeEach(async () => {
        createLogbookDto = {
          additionalInformation: logbookStub().additionalInformation,
          additionalInformationCost: logbookStub().additionalInformationCost,
          additionalInformationTyp: logbookStub().additionalInformationTyp,
          currentMileAge: logbookStub().currentMileAge,
          date: logbookStub().date,
          driveReason: logbookStub().driveReason,
          driver: logbookStub().driver,
          forFree: logbookStub().forFree,
          newMileAge: logbookStub().newMileAge,
          vehicleTyp: logbookStub().vehicleTyp,
        };
        logbook = await logbookController.create(createLogbookDto);
      });

      test('then it should call logbookService', () => {
        expect(logbookService.create).toHaveBeenCalledWith(createLogbookDto);
      });

      test('then it should return a logbooks', () => {
        expect(logbook).toMatchObject(logbookStub());
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
          currentMileAge: '2000',
          newMileAge: '2002',
          forFree: true,
          driveReason: 'Updated drive reason',
        };
        logbook = await logbookController.update(logbookStub()._id.toString(), updateLogbookDto);
      });

      test('then it should call logbookService', () => {
        expect(logbookService.update).toHaveBeenCalledWith(logbookStub()._id.toString(), updateLogbookDto);
      });

      test('then it should return a logbooks', () => {
        expect(logbook).toEqual(logbookStub());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let success: { success: boolean };
      beforeEach(async () => {
        success = await logbookController.remove('asd');
      });

      test('then it should call logbookService', () => {
        expect(logbookService.remove).toHaveBeenCalledWith('asd');
      });

      test('then it should return a logbooks', () => {
        expect(success).toEqual({ success: true });
      });
    });
  });
});
