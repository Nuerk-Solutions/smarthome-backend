import {getModelToken} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {Model} from 'mongoose';
import {LogbookService} from '../../logbook.service';
import {NewLogbook} from '../../core/schemas/logbook.schema';
import {Driver} from '../../core/enums/driver.enum';
import {Vehicle} from '../../core/enums/vehicle-typ.enum';
import {MailService} from '../../../core/mail/mail.service';
import {forwardRef} from '@nestjs/common';
import {MailModule} from '../../../core/mail/mail.module';
import {LogbookInvoice} from '../../core/schemas/logbook-invoice.schema';
import {LogbooksRepository} from '../../repositories/logbooks.repository';

const date: Date = new Date();

const mockLogbook = {
    driver: Driver.ANDREA,
    vehicle: Vehicle.FERRARI,
    mileAge: {
        current: 123,
        new: 456,
    },
    date,
    reason: 'Drive Reason',
    refuel: {
        liters: 20,
        price: 40,
    },
    details: {
        covered: false,
    },
};

describe('LogbookService', () => {
    let service: LogbookService;
    let mailService: MailService;
    let model: Model<NewLogbook>;
    let invoiceModel: Model<LogbookInvoice>;
    let logbookRepository: LogbooksRepository;

    const logbookArray = [
        {
            driver: Driver.ANDREA,
            vehicle: Vehicle.FERRARI,
            mileAge: {
                current: 123,
                new: 456,
            },
            date,
            reason: 'Drive Reason #1',
            details: {
                covered: false,
            }
        },
        {
            driver: Driver.CLAUDIA,
            vehicle: Vehicle.VW,
            mileAge: {
                current: 456,
                new: 789,
            },
            date,
            reason: 'Drive Reason #2',
            refuel: {
                liters: 20.4,
                price: 26.8,
            },
            details: {
                covered: false,
            },
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [forwardRef(() => MailModule)],
            providers: [
                LogbookService,
                LogbooksRepository,
                {
                    provide: getModelToken(NewLogbook.name, 'logbook'),
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
        model = module.get<Model<NewLogbook>>(getModelToken(NewLogbook.name, 'logbook'));
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
