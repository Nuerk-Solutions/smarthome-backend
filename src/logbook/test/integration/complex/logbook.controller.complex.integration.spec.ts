import { AppModule } from '../../../../app.module';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../../database/database.service';
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { Logbook } from '../../../core/schemas/logbook.schema';
import * as stubs from '../../stubs/complex.logbook.stub';
import { convertComplexLogbookStubToNoType } from '../../stubs/complex.logbook.stub';

describe('Complex LogbookController Integration Test', () => {
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

    await dbConnection.collection('logbooks').deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  /*
   * Tests
   */

  describe('create Logbooks VW', () => {
    it('complexLogbookStub_VW_0_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_0_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_0_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
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
    it('complexLogbookStub_VW_1_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_1_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_1_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_2_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_2_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_2_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_3_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_3_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_3_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_4_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_4_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_4_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_5_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_5_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_5_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_6_1_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_6_1_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_6_1_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_7_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_7_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_7_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_8_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_8_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_8_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_9_2_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_9_2_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_9_2_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_VW_10_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_VW_10_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_VW_10_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('find latest_0', () => {
    it('should return an array of logbooks', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_VW_10_0_T(), response.body._id),
      ]);
    });
  });

  describe('create Logbooks Ferrari', () => {
    it('complexLogbookStub_Ferrari_0_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_0_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_0_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
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

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_1_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_2_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_2_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_2_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_3_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_3_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_3_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_4_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_4_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_4_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_5_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_5_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_5_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_6_1_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_6_1_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_6_1_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_7_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_7_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_7_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_8_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_8_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_8_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_9_2_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_9_2_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_9_2_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Ferrari_10_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Ferrari_10_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_Ferrari_10_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('find latest_1', () => {
    it('should return an array of logbooks', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
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

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_0_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
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

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_1_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_2_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_2_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_2_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_3_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_3_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_3_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_4_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_4_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_4_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_5_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_5_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_5_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_6_1_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_6_1_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_6_1_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_7_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_7_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_7_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_8_0_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_8_0_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_8_0_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_9_2_F', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_9_2_F());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_9_2_F();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('complexLogbookStub_Porsche_10_0_T', async () => {
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', apiKey)
        .send(stubs.complexLogbookStub_Porsche_10_0_T());

      const newLogbook: Logbook = stubs.complexLogbookStub_Porsche_10_0_T();

      expect(response.body).toMatchObject({
        ...newLogbook,
        date: newLogbook.date.toISOString(),
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('find latest_2', () => {
    it('should return an array of logbooks', async () => {
      const response = await request(httpServer).get('/logbook/find/latest').set('Authorization', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Ferrari_10_0_T(), response.body._id),
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_Porsche_10_0_T(), response.body._id),
        convertComplexLogbookStubToNoType(stubs.complexLogbookStub_VW_10_0_T(), response.body._id),
      ]);
    });
  });

  //
  // describe('updateLogbook', () => {
  //   it('should update a logbook', async () => {
  //     const logbook = await dbConnection.collection('logbooks').insertOne(basicLogbookStub());
  //     const updateLogbookDto = {
  //       currentMileAge: '168228',
  //       newMileAge: '123457',
  //       driveReason: 'TestReason',
  //       driver: 'Andrea',
  //       forFree: true,
  //       additionalInformation: 'Test Information',
  //       additionalInformationCost: '0018.75',
  //     };
  //     const response = await request(httpServer)
  //       .patch('/logbook/' + logbook.insertedId)
  //       .set('Authorization', apiKey)
  //       .send(updateLogbookDto);
  //
  //     expect(response.body).toMatchObject(updateLogbookDto);
  //     expect(response.status).toBe(HttpStatus.OK);
  //
  //     const updatedLogbook = await dbConnection
  //       .collection('logbooks')
  //       .findOne({ _id: new Types.ObjectId(response.body._id) });
  //     expect(updatedLogbook).toMatchObject({ ...updateLogbookDto });
  //   });
  // });
  //
  // describe('deleteLogbook', () => {
  //   it('should delete a logbook', async () => {
  //     const logbook = await dbConnection.collection('logbooks').insertOne(basicLogbookStub());
  //     const response = await request(httpServer)
  //       .delete('/logbook/' + logbook.insertedId)
  //       .set('Authorization', apiKey);
  //
  //     expect(response.status).toBe(HttpStatus.NO_CONTENT);
  //
  //     const deletedLogbook = await dbConnection
  //       .collection('logbooks')
  //       .findOne({ _id: new Types.ObjectId(response.body._id) });
  //     expect(deletedLogbook).toBeNull();
  //   });
  // });
});
