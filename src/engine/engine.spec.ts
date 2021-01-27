import * as engine from './engine';
import { JsonObject, logging } from '@angular-devkit/core';
import { Logger, LogLevel } from '@angular-devkit/core/src/logger';
const Heroku = require('heroku-client');
const logger: any = {
  error: (message: string) => { }
}
let heroku: any = null;
jest.mock('heroku-client') // this auto mocks all methods on heroku-client

describe('engine', () => {
  beforeEach(() => {
    heroku = new Heroku({ token: 'asd' });
  });

  it('should return false if application name not find in Heroku', async () => {
    const spy = spyOn(logger, 'error').and.callThrough();
    const result = await engine.run("", { appName: 'test' }, "app", logger);
    expect(result.success).toEqual(false);
    expect(spy).toHaveBeenCalledWith("🚨 test application not found in Heroku!");
  });

});
