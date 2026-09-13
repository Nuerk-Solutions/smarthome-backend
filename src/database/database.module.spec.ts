import { ConfigService } from '@nestjs/config';
import { databaseConnectionOptions } from './database.module';
const config = (testURI?: string, environment = 'test') => {
  const values = { NODE_ENV: environment, MONGODB_URI: 'mongodb://localhost/logbook', MONGODB_TEST_URI: testURI };
  const service = new ConfigService();
  jest.spyOn(service, 'get').mockImplementation(key => values[key]);
  return service;
};
it('blocks missing, live and non-test databases before any connection opens', () => {
  expect(() => databaseConnectionOptions(config())).toThrow();
  expect(() => databaseConnectionOptions(config('mongodb://localhost/logbook'))).toThrow();
  expect(() => databaseConnectionOptions(config('mongodb://elsewhere/customer'))).toThrow();
});
it('allows a separate explicit test database and preserves the normal runtime URI', () => {
  expect(databaseConnectionOptions(config('mongodb://localhost/logbook_test')).uri).toBe('mongodb://localhost/logbook_test');
  expect(databaseConnectionOptions(config(undefined, 'production')).uri).toBe('mongodb://localhost/logbook');
});
