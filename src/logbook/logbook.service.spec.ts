import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  AdditionalInformationTyp,
  Driver,
  VehicleTyp,
} from './dto/create-logbook.dto';
import { LogbookService } from './logbook.service';
import { Logbook } from './schemas/logbook.schema';

const date: Date = new Date();

const mockLogbook = {
  driver: Driver.Andrea,
  vehicleTyp: VehicleTyp.Ferrari,
  currentMileAge: '123',
  newMileAge: '456',
  date: date,
  driveReason: 'Drive Reason',
  additionalInformationTyp: AdditionalInformationTyp.Getankt,
  additionalInformation: '20',
  additionalInformationCost: '40',
};

describe('LogbookService', () => {
  let service: LogbookService;
  let model: Model<Logbook>;

  const logbookArray = [
    {
      driver: Driver.Andrea,
      vehicleTyp: VehicleTyp.Ferrari,
      currentMileAge: '123',
      newMileAge: '456',
      date: date,
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
      date: date,
      driveReason: 'Drive Reason #2',
      additionalInformationTyp: AdditionalInformationTyp.Getankt,
      additionalInformation: '20.4',
      additionalInformationCost: '26,8',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogbookService,
        {
          provide: getModelToken('Logbook'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockLogbook),
            constructor: jest.fn().mockResolvedValue(mockLogbook),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LogbookService>(LogbookService);
    model = module.get<Model<Logbook>>(getModelToken('Logbook'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all logbooks', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(logbookArray),
    } as any);
    const logbooks = await service.findAll();
    expect(logbooks).toEqual(logbookArray);
  });

  it('should create a new Logbook', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        driver: Driver.Andrea,
        vehicleTyp: VehicleTyp.Ferrari,
        currentMileAge: '123',
        newMileAge: '456',
        date: date,
        driveReason: 'Drive Reason',
        additionalInformationTyp: AdditionalInformationTyp.Getankt,
        additionalInformation: '20',
        additionalInformationCost: '40',
      }),
    );
    const newLogbook = await service.create({
      driver: Driver.Andrea,
      vehicleTyp: VehicleTyp.Ferrari,
      currentMileAge: '123',
      newMileAge: '456',
      date: date,
      driveReason: 'Drive Reason',
      additionalInformationTyp: AdditionalInformationTyp.Getankt,
      additionalInformation: '20',
      additionalInformationCost: '40',
    });

    expect(newLogbook).toEqual(mockLogbook);
  });
});
