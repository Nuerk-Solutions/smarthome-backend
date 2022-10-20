import { AppModule } from '../../../app.module';
import { Test } from '@nestjs/testing';
import { Connection, Types } from 'mongoose';
import { DatabaseService } from '../../../database/database.service';
import { logbookStub, logbookStubTypeless } from '../stubs/logbook.stub';
import * as request from 'supertest';

describe('LogbookController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

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

  describe('findLatest', () => {
    it('should return an array of logbooks', async () => {
      await dbConnection.collection('logbooks').insertOne(logbookStub());
      const response = await request(httpServer)
        .get('/logbook/find/latest')
        .set('Authorization', 'Api-Key ca03na188ame03u1d78620de67282882a84');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([logbookStubTypeless()]);
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
      const response = await request(httpServer)
        .post('/logbook')
        .set('Authorization', 'Api-Key ca03na188ame03u1d78620de67282882a84')
        .send(createLogbookDto);

      expect(response.body).toMatchObject(createLogbookDto);
      expect(response.status).toBe(201);

      const logbook = await dbConnection.collection('logbooks').findOne({ _id: new Types.ObjectId(response.body._id) });
      expect(logbook).toMatchObject({ ...createLogbookDto, date: new Date(createLogbookDto.date) });
    });
  });
});
