import { AppModule } from '../../../../app.module';
import { Test } from '@nestjs/testing';
import { Connection, Types } from 'mongoose';
import { DatabaseService } from '../../../../database/database.service';
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { NewLogbook } from '../../../core/schemas/logbook.schema';
import * as stubs from '../../stubs/complex.logbook.stub';
import {
  complexLogbookStub_Ferrari_10_0_T,
  convertComplexLogbookStubToNoId,
  convertComplexLogbookStubToNoType,
} from '../../stubs/complex.logbook.stub';
import { basicLogbookStub } from '../../stubs/basic.logbook.stub';
import { DISTANCE_COST } from '../../../../core/utils/constatns';
import {ObjectId} from "bson";

describe('Complex LogbookController Integration Test', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;
  let apiKey: string = 'Api-Key ca03na188ame03u1d78620de67282882a84';
  let logbookId: string;

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

    await dbConnection.collection('logbooks').deleteMany();
    await new Promise(process.nextTick);
  });

  afterAll(async () => {
    await dbConnection.collection('logbooks').deleteMany();
    await app.close();
  });

  /*
   * Tests
   */

  describe('find latest_0', () => {
    it('should return an array of logbooks', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject([]);
    });
  });

  describe('create Logbooks VW', () => {
    it('complexLogbookStub_VW_0_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_0_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_0_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);
      expect(response.body.mileAge.difference).toEqual(1);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_1_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_1_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_1_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);
      expect(response.body.mileAge.difference).toEqual(2);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_2_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_2_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_2_0_F();

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);
      expect(response.body.mileAge.difference).toEqual(6);
      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_3_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_3_0_T());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_3_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_4_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_4_0_T());

      let prevId = String(response.body.refuel.previousRecordId);

      let newLogbook: NewLogbook = stubs.complexLogbookStub_VW_4_0_T();

      let shortResponse = response.body;
      delete shortResponse.refuel.previousRecordId;

      expect(shortResponse).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_5_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_5_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_5_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_6_1_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_6_1_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_6_1_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_7_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_7_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_7_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_8_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_8_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_8_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_9_2_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_9_2_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_9_2_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_VW_10_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_10_0_T());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_VW_10_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
  });

  describe('find latest_1', () => {
    it('should return an array of logbooks', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      console.log(convertComplexLogbookStubToNoType(stubs.complexLogbookStub_VW_10_0_T(), response.body._id, response.body.data.date))
      
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject([
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_VW_10_0_T(), response.body._id, response.body.data.date),
      ]);
    });
  });

  describe('create Logbooks Ferrari', () => {
    it('complexLogbookStub_Ferrari_0_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_0_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_0_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
      //
      // dbConnection
      //   .collection('logbooks')
      //   .findOne({ _id: new Types.ObjectId(response.body._id) })
      //   .then((logbook) => {
      //     expect(logbook).toMatchObject({
      //       ...newLogbook,
      //       date: newLogbook.date.toISOString(),
      //     });
      //   });
    });
    it('complexLogbookStub_Ferrari_1_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_1_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_1_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_2_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_2_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_2_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_3_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_3_0_T());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_3_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_4_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_4_0_T());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_4_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_5_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_5_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_5_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_6_1_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_6_1_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_6_1_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_7_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_7_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_7_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_8_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_8_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_8_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_9_2_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_9_2_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_9_2_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Ferrari_10_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_10_0_T());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Ferrari_10_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
      logbookId = response.body._id;
    });
  });

  describe('find latest_2', () => {
    it('should return an array of logbooks', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject([
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Ferrari_10_0_T(), response.body._id),
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_VW_10_0_T(), response.body._id),
      ]);
    });
  });

  describe('create Logbooks Porsche', () => {
    it('complexLogbookStub_Porsche_0_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_0_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_0_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
      //
      // dbConnection
      //   .collection('logbooks')
      //   .findOne({ _id: new Types.ObjectId(response.body._id) })
      //   .then((logbook) => {
      //     expect(logbook).toMatchObject({
      //       ...newLogbook,
      //       date: newLogbook.date.toISOString(),
      //     });
      //   });
    });
    it('complexLogbookStub_Porsche_1_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_1_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_1_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_2_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_2_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_2_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_3_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_3_0_T());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_3_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_4_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_4_0_T());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_4_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_5_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_5_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_5_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_6_1_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_6_1_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_6_1_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_7_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_7_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_7_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_8_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_8_0_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_8_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_9_2_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_9_2_F());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_9_2_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
    it('complexLogbookStub_Porsche_10_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_10_0_T());

      const newLogbook: NewLogbook = stubs.complexLogbookStub_Porsche_10_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.mileAge.cost).toEqual(Math.round(response.body.mileAge.difference * DISTANCE_COST  * 100) / 100);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(convertComplexLogbookStubToNoId(newLogbook));
    });
  });

  describe('find latest_3', () => {
    it('should return an array of logbooks', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject([
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Ferrari_10_0_T(), response.body._id),
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Porsche_10_0_T(), response.body._id),
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_VW_10_0_T(), response.body._id),
      ]);
    });
  });

  describe('create logbook fails', () => {
    it('should return an error Logbook already exists', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_10_0_T());

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Logbook already exists',
      });
    });
  });

  describe('update logbook', () => {
    it('update last logbook with the same logbook', async () => {
      const response = await request(httpServer)
        .put('/logbook/' + logbookId)
        .set('Authorization', apiKey)
        .send(convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Ferrari_10_0_T()));

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject(convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Ferrari_10_0_T()));
    });

    it('update not the last logbook with different stats; should fail', async () => {
      const logbookToInsert = {
        ...basicLogbookStub(),
        mileAge: {
          current: 12,
          new: 15,
          difference: 3,
          cost: 11 * DISTANCE_COST,
        },
      };
      delete logbookToInsert._id;
      const logbook = await dbConnection.collection('logbooks').insertOne(logbookToInsert);
      const updateLogbookDto = {
        mileAge: {
          current: 10,
        },
        reason: 'TestReason',
        driver: 'Andrea',
      };
      const response = await request(httpServer)
        .put('/logbook/' + logbook.insertedId)
        .set('Authorization', apiKey)
        .send(updateLogbookDto);


      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({ ...updateLogbookDto });

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject({ ...updateLogbookDto });
    });

    it('update last logbook with different stats', async () => {
      const updateLogbookDto = {
        mileAge: {
          new: 200001,
        },
        reason: 'TestReason',
        driver: 'Andrea',
      };
      const response = await request(httpServer)
        .put('/logbook/' + logbookId)
        .set('Authorization', apiKey)
        .send(updateLogbookDto);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject(updateLogbookDto);

      const updatedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(updatedLogbook).toMatchObject(updatedLogbook);
    });
  });

  describe('find latest_4', () => {
    it('should the latest logbooks after a modification', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      let updatedLogbook: any = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(logbookId) });
      updatedLogbook = {
        ...updatedLogbook,
        _id: updatedLogbook._id.toString(),
        date: updatedLogbook.date.toISOString(),
        createdAt: updatedLogbook.createdAt.toISOString(),
      };

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject([
        updatedLogbook,
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Porsche_10_0_T(), response.body._id),
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_VW_10_0_T(), response.body._id),
      ]);
    });
  });

  describe('deleteLogbook', () => {
    it('should delete a logbook', async () => {
      const response = await request(httpServer)
        .delete('/logbook/' + logbookId)
        .set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const deletedLogbook = await dbConnection
        .collection('logbooks')
        .findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(deletedLogbook).toBeNull();
    });
  });

  describe('find latest_5', () => {
    it('should the latest logbooks after the deletion of a logbook', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject([
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Ferrari_9_2_F(), response.body._id),
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Porsche_10_0_T(), response.body._id),
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_VW_10_0_T(), response.body._id),
      ]);
    });
  });
});
