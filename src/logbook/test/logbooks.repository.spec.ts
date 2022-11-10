import { LogbooksRepository } from '../repositories/logbooks.repository';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Logbook } from '../core/schemas/logbook.schema';
import { LogbookModel } from './support/logbook.model';
import { FilterQuery } from 'mongoose';
import { basicLogbookStub } from './stubs/basic.logbook.stub';

describe('LogbooksRepository', () => {
  let logbookRepository: LogbooksRepository;

  describe('findOperations', () => {
    let logbookModel: LogbookModel;
    let logbookFilterQuery: FilterQuery<Logbook>;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          LogbooksRepository,
          {
            provide: getModelToken(Logbook.name, 'logbook'),
            useClass: LogbookModel,
          },
        ],
      }).compile();

      logbookRepository = moduleRef.get<LogbooksRepository>(LogbooksRepository);
      logbookModel = moduleRef.get<LogbookModel>(getModelToken(Logbook.name, 'logbook'));
      logbookFilterQuery = { _id: basicLogbookStub()._id };
      jest.clearAllMocks();
    });

    describe('findOne', () => {
      describe('when findOne is called', () => {
        let logbook: Logbook;

        beforeEach(async () => {
          jest.spyOn(logbookModel, 'findOne');
          logbook = await logbookRepository.findOne(logbookFilterQuery, {}, { _id: basicLogbookStub()._id.toString() });
        });

        test('then it should call the logbookModel', () => {
          // { _id: basicLogbookStub()._id.toString() } => defines which fields should be returned
          expect(logbookModel.findOne).toHaveBeenCalledWith(logbookFilterQuery, {
            _id: basicLogbookStub()._id.toString(),
          });
        });

        test('then it should return a logbook', () => {
          expect(logbook).toMatchObject(basicLogbookStub());
        });
      });
    });

    describe('find', () => {
      describe('when find is called', () => {
        let logbooks: Logbook[];

        beforeEach(async () => {
          jest.spyOn(logbookModel, 'find');
          logbooks = await logbookRepository.find(logbookFilterQuery);
        });

        test('then it should call the logbookModel', () => {
          // { _id: basicLogbookStub()._id.toString() } => defines which fields should be returned
          expect(logbookModel.find).toHaveBeenCalledWith(logbookFilterQuery);
        });

        test('then it should return a logbook', () => {
          expect(logbooks).toEqual([basicLogbookStub()]);
        });
      });
    });

    describe('findOneAndUpdate', () => {
      describe('when findOneAndUpdate is called', () => {
        let logbook: Logbook;

        beforeEach(async () => {
          jest.spyOn(logbookModel, 'findOneAndUpdate');
          logbook = await logbookRepository.findOneAndUpdate(logbookFilterQuery, basicLogbookStub());
        });

        test('then it should call the logbookModel', () => {
          // { _id: basicLogbookStub()._id.toString() } => defines which fields should be returned
          expect(logbookModel.findOneAndUpdate).toHaveBeenCalledWith(logbookFilterQuery, basicLogbookStub(), {
            new: true,
          });
        });

        test('then it should return a logbook', () => {
          expect(logbook).toEqual(basicLogbookStub());
        });
      });
    });
  });

  // describe('create operations', () => {
  //   beforeEach(async () => {
  //     const moduleRef = await Test.createTestingModule({
  //       providers: [
  //         LogbooksRepository,
  //         {
  //           provide: getModelToken(Logbook.name, 'logbook'),
  //           useValue: LogbookModel,
  //         },
  //       ],
  //     }).compile();
  //
  //     logbookRepository = moduleRef.get<LogbooksRepository>(LogbooksRepository);
  //   });
  //
  //   describe('create', () => {
  //     describe('when create is called', () => {
  //       let logbook: Logbook;
  //       let saveSpy: jest.SpyInstance;
  //       let constructorSpy: jest.SpyInstance;
  //
  //       beforeEach(async () => {
  //         saveSpy = jest.spyOn(LogbookModel.prototype, 'save');
  //         constructorSpy = jest.spyOn(LogbookModel.prototype, 'constructorSpy');
  //         logbook = await logbookRepository.create(basicLogbookStub());
  //       });
  //
  //       test('then it should call the logbookModel', () => {
  //         expect(saveSpy).toHaveBeenCalled();
  //         expect(constructorSpy).toHaveBeenCalledWith(basicLogbookStub());
  //       });
  //
  //       test('then it should return a logbook', () => {
  //         expect(logbook).toEqual(basicLogbookStub());
  //       });
  //     });
  //   });
  // });
});
