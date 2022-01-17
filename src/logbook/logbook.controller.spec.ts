import { Test, TestingModule } from '@nestjs/testing';
import {
  AdditionalInformationTyp,
  CreateLogbookDto,
  Driver,
  VehicleTyp,
} from './dto/create-logbook.dto';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';

describe('LogbookController', () => {
  let controller: LogbookController;
  let service: LogbookService;

  const date1: Date = new Date();
  const date2: Date = new Date(date1.getTime() + 1000);
  const date3: Date = new Date(date2.getTime() + 1000);

  const createLogbookDto: CreateLogbookDto = {
    driver: Driver.Andrea,
    vehicleTyp: VehicleTyp.Ferrari,
    currentMileAge: '123',
    newMileAge: '456',
    date: date1,
    driveReason: 'Drive Reason',
    additionalInformationTyp: AdditionalInformationTyp.Getankt,
    additionalInformation: '20',
    additionalInformationCost: '40',
  };

  const mockLogbook = {
    driver: Driver.Andrea,
    vehicleTyp: VehicleTyp.Ferrari,
    currentMileAge: '123',
    newMileAge: '456',
    date: date1,
    driveReason: 'Drive Reason',
    distance: '333',
    distanceCost: '66,6',
    additionalInformationTyp: AdditionalInformationTyp.Getankt,
    additionalInformation: '20',
    additionalInformationCost: '40',
    distanceSinceLastAdditionalInformation: '0',
    _id: 'a id',
    createdAt: 'a timestemp',
    updatedAt: 'a timestemp',
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
                driver: Driver.Andrea,
                vehicleTyp: VehicleTyp.Ferrari,
                currentMileAge: '123',
                newMileAge: '456',
                date: date1,
                driveReason: 'Drive Reason #1',
                additionalInformationTyp: AdditionalInformationTyp.Keine,
                additionalInformation: '',
                additionalInformationCost: '',
              },
              {
                driver: Driver.Claudia,
                vehicleTyp: VehicleTyp.VW,
                currentMileAge: '456',
                newMileAge: '789',
                date: date2,
                driveReason: 'Drive Reason #2',
                additionalInformationTyp: AdditionalInformationTyp.Getankt,
                additionalInformation: '20.4',
                additionalInformationCost: '26,8',
              },
              {
                driver: Driver.Thomas,
                vehicleTyp: VehicleTyp.Ferrari,
                currentMileAge: '101112',
                newMileAge: '131415',
                date: date3,
                driveReason: 'Drive Reason #3',
                additionalInformationTyp: AdditionalInformationTyp.Gewartet,
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
  });

  describe('create()', () => {
    it('should create a new Logbook', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockLogbook);

      await controller.create(createLogbookDto);
      expect(createSpy).toHaveBeenCalledWith(createLogbookDto);
    });
  });

  describe('findAll()', () => {
    it('should return all Logbook', async () => {
      expect(controller.findAll()).resolves.toEqual([
        {
          driver: Driver.Andrea,
          vehicleTyp: VehicleTyp.Ferrari,
          currentMileAge: '123',
          newMileAge: '456',
          date: date1,
          driveReason: 'Drive Reason #1',
          additionalInformationTyp: AdditionalInformationTyp.Keine,
          additionalInformation: '',
          additionalInformationCost: '',
        },
        {
          driver: Driver.Claudia,
          vehicleTyp: VehicleTyp.VW,
          currentMileAge: '456',
          newMileAge: '789',
          date: date2,
          driveReason: 'Drive Reason #2',
          additionalInformationTyp: AdditionalInformationTyp.Getankt,
          additionalInformation: '20.4',
          additionalInformationCost: '26,8',
        },
        {
          driver: Driver.Thomas,
          vehicleTyp: VehicleTyp.Ferrari,
          currentMileAge: '101112',
          newMileAge: '131415',
          date: date3,
          driveReason: 'Drive Reason #3',
          additionalInformationTyp: AdditionalInformationTyp.Gewartet,
          additionalInformation: 'Windschutzscheibe ersetzt.',
          additionalInformationCost: '300',
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
