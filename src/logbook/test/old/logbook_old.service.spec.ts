import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { LogbookService } from '../../logbook.service';
import { Logbook } from '../../core/schemas/logbook.schema';
import { Driver } from '../../core/enums/driver.enum';
import { Vehicle } from '../../core/enums/vehicle-typ.enum';
import { AdditionalInformationTyp } from '../../core/enums/additional-information-typ.enum';
import { MailService } from '../../../core/mail/mail.service';
import { forwardRef } from '@nestjs/common';
import { MailModule } from '../../../core/mail/mail.module';
import { LogbookInvoice } from '../../core/schemas/logbook-invoice.schema';
import { LogbooksRepository } from '../../repositories/logbooks.repository';

const date: Date = new Date();

const mockLogbook = {
  driver: Driver.ANDREA,
  vehicleTyp: Vehicle.FERRARI,
  currentMileAge: '123',
  newMileAge: '456',
  date,
  driveReason: 'Drive Reason',
  additionalInformationTyp: AdditionalInformationTyp.GETANKT,
  additionalInformation: '20',
  additionalInformationCost: '40',
};

describe('LogbookService', () => {
  let service: LogbookService;
  let mailService: MailService;
  let model: Model<Logbook>;
  let invoiceModel: Model<LogbookInvoice>;
  let logbookRepository: LogbooksRepository;

  const logbookArray = [
    {
      driver: Driver.ANDREA,
      vehicleTyp: Vehicle.FERRARI,
      currentMileAge: '123',
      newMileAge: '456',
      date,
      driveReason: 'Drive Reason #1',
      additionalInformationTyp: AdditionalInformationTyp.KEINE,
      additionalInformation: '',
      additionalInformationCost: '',
      forFree: false,
    },
    {
      driver: Driver.CLAUDIA,
      vehicleTyp: Vehicle.VW,
      currentMileAge: '456',
      newMileAge: '789',
      date,
      driveReason: 'Drive Reason #2',
      additionalInformationTyp: AdditionalInformationTyp.GETANKT,
      additionalInformation: '20.4',
      additionalInformationCost: '26,8',
      forFree: false,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [forwardRef(() => MailModule)],
      providers: [
        LogbookService,
        LogbooksRepository,
        {
          provide: getModelToken(Logbook.name, 'logbook'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockLogbook),
            constructor: jest.fn().mockResolvedValue(mockLogbook),
            find: jest.fn(),
            count: jest.fn(),
            countDocuments: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(LogbookInvoice.name, 'logbook'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockLogbook),
            constructor: jest.fn().mockResolvedValue(mockLogbook),
            find: jest.fn(),
            count: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    logbookRepository = module.get<LogbooksRepository>(LogbooksRepository);
    service = module.get<LogbookService>(LogbookService);
    mailService = module.get<MailService>(MailService);
    model = module.get<Model<Logbook>>(getModelToken(Logbook.name, 'logbook'));
    invoiceModel = module.get<Model<LogbookInvoice>>(getModelToken(LogbookInvoice.name, 'logbook'));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mailService).toBeDefined();
  });

  it('should return all logbooks', async () => {
    jest.spyOn(model, 'countDocuments').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(2),
    } as any);

    jest.spyOn(model, 'find').mockReturnValue({
      sort: jest.fn().mockImplementation(() => ({
        skip: jest.fn().mockImplementation(() => ({
          limit: jest.fn().mockImplementation(() => ({
            exec: jest.fn().mockResolvedValue(logbookArray),
          })),
        })),
      })),
      exec: jest.fn().mockResolvedValueOnce(logbookArray),
    } as any);

    const logbooks = await service.findAll();
    expect(logbooks).toEqual({
      data: [...logbookArray],
      length: 2,
      limit: 2,
      page: 0,
      pageCount: 1,
      total: 2,
    });
  });
});
