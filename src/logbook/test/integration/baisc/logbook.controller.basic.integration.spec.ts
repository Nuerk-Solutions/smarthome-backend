import { AppModule } from '../../../../app.module';
import { Test } from '@nestjs/testing';
import { Connection, Types } from 'mongoose';
import { DatabaseService } from '../../../../database/database.service';
import { basicLogbookStub, basicLogbookStubTypeless } from '../../stubs/basic.logbook.stub';
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

describe('Basic LogbookController Integration Test', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;
  let apiKey: string = 'Api-Key ca03na188ame03u1d78620de67282882a84';

  /*
   * Setup
   */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('logbooks').deleteMany({});
  });

  /*
   * Tests
   */
  describe('findLatest', () => {
    it('should return an array of logbooks', async () => {
      await dbConnection.collection('logbooks').insertOne(basicLogbookStub());
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([basicLogbookStubTypeless()]);
    });
  });

  describe('createLogbook', () => {
    it('should create a logbook', async () => {
      const createLogbookDto = {
        additionalInformationTyp: 'Keine',
        currentMileAge: '123456',
        newMileAge: '123457',
        date: '2019-01-01T00:00:00.000Z',
        driveReason: 'TestReason',
        driver: 'Andrea',
        forFree: false,
        vehicleTyp: 'VW',
      };
      const response = await request(httpServer).post('/logbook').set('Authorization', apiKey).send(createLogbookDto);

      expect(response.body).toMatchObject(createLogbookDto);
      expect(response.status).toBe(HttpStatus.CREATED);

      const logbook = await dbConnection.collection('logbooks').findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(logbook).toMatchObject({ ...createLogbookDto, date: new Date(createLogbookDto.date) });
    });
  });

  describe('updateLogbook', () => {
    it('should update a logbook', async () => {
      const logbook = await dbConnection.collection('logbooks').insertOne(basicLogbookStub());
      const updateLogbookDto = {
        currentMileAge: '168228',
        newMileAge: '123457',
        driveReason: 'TestReason',
        driver: 'Andrea',
        forFree: true,
        additionalInformation: 'Test Information',
        additionalInformationCost: '0018.75',
      };
      const response = await request(httpServer)
        .patch('/logbook/' + logbook.insertedId)
        .set('Authorization', apiKey)
        .send(updateLogbookDto);

      expect(response.body).toMatchObject(updateLogbookDto);
      expect(response.status).toBe(HttpStatus.OK);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject({ ...updateLogbookDto });
    });
  });

  describe('deleteLogbook', () => {
    it('should delete a logbook', async () => {
      const logbook = await dbConnection.collection('logbooks').insertOne(basicLogbookStub());
      const response = await request(httpServer)
        .delete('/logbook/' + logbook.insertedId)
        .set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const deletedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(deletedLogbook).toBeNull();
    });
  });
});
