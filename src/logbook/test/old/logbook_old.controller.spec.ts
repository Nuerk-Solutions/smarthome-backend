import { Test, TestingModule } from '@nestjs/testing';
import { LogbookController } from '../../logbook.controller';
import { LogbookService } from '../../logbook.service';
import { CreateLogbookDto } from '../../core/dto/create-logbook.dto';
import { Driver } from '../../core/enums/driver.enum';
import { Vehicle } from '../../core/enums/vehicle-typ.enum';
import { AdditionalInformationTyp } from '../../core/enums/additional-information-typ.enum';
import { Types } from 'mongoose';

describe('LogbookController', () => {
  let controller: LogbookController;
  let service: LogbookService;

  const date1: Date = new Date();
  const date2: Date = new Date(date1.getTime() + 1000);
  const date3: Date = new Date(date2.getTime() + 1000);

  const createLogbookDto: CreateLogbookDto = {
    driver: Driver.ANDREA,
    vehicleTyp: Vehicle.FERRARI,
    currentMileAge: '123',
    newMileAge: '456',
    date: date1,
    driveReason: 'Drive Reason',
    additionalInformationTyp: AdditionalInformationTyp.GETANKT,
    additionalInformation: '20',
    additionalInformationCost: '40',
    forFree: false,
  };

  const mockLogbook = {
    driver: Driver.ANDREA,
    vehicleTyp: Vehicle.FERRARI,
    currentMileAge: '123',
    newMileAge: '456',
    date: date1,
    driveReason: 'Drive Reason',
    distance: '333',
    distanceCost: '66,6',
    additionalInformationTyp: AdditionalInformationTyp.GETANKT,
    additionalInformation: '20',
    additionalInformationCost: '40',
    distanceSinceLastAdditionalInformation: '0',
    _id: new Types.ObjectId(),
    createdAt: 'a timestemp',
    updatedAt: 'a timestemp',
    forFree: false,
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
                vehicleTyp: Vehicle.FERRARI,
                currentMileAge: '123',
                newMileAge: '456',
                date: date1,
                driveReason: 'Drive Reason #1',
                additionalInformationTyp: AdditionalInformationTyp.KEINE,
                additionalInformation: '',
                additionalInformationCost: '',
              },
              {
                driver: Driver.CLAUDIA,
                vehicleTyp: Vehicle.VW,
                currentMileAge: '456',
                newMileAge: '789',
                date: date2,
                driveReason: 'Drive Reason #2',
                additionalInformationTyp: AdditionalInformationTyp.GETANKT,
                additionalInformation: '20.4',
                additionalInformationCost: '26,8',
              },
              {
                driver: Driver.THOMAS,
                vehicleTyp: Vehicle.FERRARI,
                currentMileAge: '101112',
                newMileAge: '131415',
                date: date3,
                driveReason: 'Drive Reason #3',
                additionalInformationTyp: AdditionalInformationTyp.GEWARTET,
                additionalInformation: 'Windschutzscheibe ersetzt.',
                additionalInformationCost: '300',
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
          vehicleTyp: Vehicle.FERRARI,
          currentMileAge: '123',
          newMileAge: '456',
          date: date1,
          driveReason: 'Drive Reason #1',
          additionalInformationTyp: AdditionalInformationTyp.KEINE,
          additionalInformation: '',
          additionalInformationCost: '',
        },
        {
          driver: Driver.CLAUDIA,
          vehicleTyp: Vehicle.VW,
          currentMileAge: '456',
          newMileAge: '789',
          date: date2,
          driveReason: 'Drive Reason #2',
          additionalInformationTyp: AdditionalInformationTyp.GETANKT,
          additionalInformation: '20.4',
          additionalInformationCost: '26,8',
        },
        {
          driver: Driver.THOMAS,
          vehicleTyp: Vehicle.FERRARI,
          currentMileAge: '101112',
          newMileAge: '131415',
          date: date3,
          driveReason: 'Drive Reason #3',
          additionalInformationTyp: AdditionalInformationTyp.GEWARTET,
          additionalInformation: 'Windschutzscheibe ersetzt.',
          additionalInformationCost: '300',
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
