import { BuilderContext } from '@angular-devkit/architect';
import { json, logging } from '@angular-devkit/core';
import * as engine from '../engine/engine';
import { Schema } from './schema';



export default async function deploy(
  context: BuilderContext,
  projectRoot: string,
  outDir: string,
  options: Schema
) {
  
  if (options.noBuild) {
    context.logger.info(`📦 Skipping build`);
  } else {

    if (!context.target) {
      throw new Error('Cannot execute the build target');
    }

    const configuration = options.configuration ? options.configuration : 'production'
    const overrides = {
      // this is an example how to override the workspace set of options
      ...(options.baseHref && { baseHref: options.baseHref })
    };

    context.logger.info(`📦 Building "${context.target.project}". Configuration: "${configuration}".${options.baseHref ? ' Your base-href: "' + options.baseHref + '"' : ''}`);

    const build = await context.scheduleTarget({
      target: 'build',
      project: context.target.project,
      configuration
    }, overrides as json.JsonObject);
    await build.result;
  }

  if (!options.herokuApiToken) {
    context.logger.error("🚨 Heroku API Token not found!");
    return { success: false };
  }
  if (!options.appName) {
    context.logger.error("🚨 Please specify Heroku Application in which you want to deploy!");
    return { success: false };
  }

  return await engine.run(
    projectRoot,
    options,
    outDir,
    context.logger as unknown as logging.LoggerApi
  );
}
