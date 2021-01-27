import { JsonObject, logging } from '@angular-devkit/core';
import { BuilderContext, BuilderRun, ScheduleOptions, Target } from '@angular-devkit/architect/src/index';
import deploy from './actions';
import { SynchronousDelegateExpectedException } from '@angular-devkit/core/src/virtual-fs/host';

let context: BuilderContext;

const PROJECT = 'pirojok-project';

describe('Deploy Angular apps', () => {
  beforeEach(() => initMocks());

  it('should invoke the builder', async () => {
    const spy = spyOn(context, 'scheduleTarget').and.callThrough();
    await deploy( context, 'host',"app", {});

    expect(spy).toHaveBeenCalledWith({
        target: 'build',
        configuration: 'production',
        project: PROJECT
      },
      {}
    );
  });

  it('should invoke the builder with the baseHref', async () => {
    const spy = spyOn(context, 'scheduleTarget').and.callThrough();
    await deploy(context, 'host',"app", { baseHref: '/folder'});

    expect(spy).toHaveBeenCalledWith({
        target: 'build',
        configuration: 'production',
        project: PROJECT
      },
      { baseHref: '/folder' }
    );
  });

  // it('should invoke engine.run', async () => {
  //   const spy = spyOn(mockEngine, 'run').and.callThrough();
  //   await deploy(mockEngine, context, 'host', {});

  //   expect(spy).toHaveBeenCalledWith('host', {}, context.logger);
  // });

  describe('error handling', () => {
    it('throws if there is no target project', async () => {
      context.target = undefined;
      try {
        await deploy(context, 'host', "app", {});
        fail();
      } catch (e) {
        expect(e.message).toMatch(/Cannot execute the build target/);
      }
    });

    it('return false if api Token not present', async () => {
      var output = await deploy(context, 'host', "app", {});
      expect(output.success).toEqual(false);
    });
    
    it('return false if app name not present', async () => {
      var output = await deploy(context, 'host', "app", {
        herokuApiToken:"asd"
      });
      expect(output.success).toEqual(false);
    });
  });
});

const initMocks = () => {
  context = {
    target: {
      configuration: 'production',
      project: PROJECT,
      target: 'foo'
    },
    builder: {
      builderName: 'mock',
      description: 'mock',
      optionSchema: false
    },
    currentDirectory: 'cwd',
    id: 1,
    logger: new logging.NullLogger() as any,
    workspaceRoot: 'cwd',
    addTeardown: _ => { },
    validateOptions: _ => Promise.resolve({} as any),
    getBuilderNameForTarget: () => Promise.resolve(''),
    analytics: null as any,
    getTargetOptions: (_: Target) => Promise.resolve({}),
    reportProgress: (_: number, __?: number, ___?: string) => { },
    reportStatus: (_: string) => { },
    reportRunning: () => { },
    scheduleBuilder: (_: string, __?: JsonObject, ___?: ScheduleOptions) => Promise.resolve({} as BuilderRun),
    scheduleTarget: (_: Target, __?: JsonObject, ___?: ScheduleOptions) => Promise.resolve({} as BuilderRun)
  };
};
