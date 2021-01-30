import { BuilderOutput } from '@angular-devkit/architect';
import { logging } from '@angular-devkit/core';
import {
  copy,
  copyFileSync, ensureDir, move,
  readFileSync, remove
} from 'fs-extra';
import * as tar from 'tar';
import { Schema } from '../deploy/schema';
const Heroku = require('heroku-client');
const fetch = require("node-fetch");

const path = require("path");

// TODO: add your deployment code here!
export async function run(dir: string,
  options: Schema,
  outDir: string,
  logger: logging.LoggerApi): Promise<BuilderOutput> {

  try {
    const heroku = new Heroku({ token: options.herokuApiToken });
    const result = await heroku.get('/apps');
    let site: any = null;
    const nodeVersion: string = 'node-v14.0.0-linux-x64';
    if (result && result.length > 0) {
      site = result.find((app => app.name === options.appName));
    }

    if (!site) {
      logger.error(`🚨 ${options.appName} application not found in Heroku!`);
      return { success: false };
    }

    const slugResult = await heroku.post(`/apps/${site.name}/slugs`, {
      body: {
        buildpack_provided_description: "heroku/nodejs",
        process_types: { "web": `${nodeVersion}/bin/node server.js` }
      }
    });

    logger.info('Copying Build Files');
    await remove(`${dir}/app`);
    await remove(`${dir}/tmp`);
    await remove(`${dir}/slug.tgz`);
    await ensureDir(`${dir}/app`);
    await ensureDir(`${dir}/tmp`);
    
    await copy(`${outDir}`, `${dir}/app`);
    await tar.x({
      file: path.join(__dirname, "../", `${nodeVersion}.tar`)
    })
    await moveNodeJS(nodeVersion, `${dir}/app/${nodeVersion}`)
    copyFileSync(path.join(__dirname, "../", 'server.js'), `${dir}/app/server.js`);
    copyFileSync(path.join(__dirname, "../", 'Procfile'), `${dir}/app/Procfile`);

    const tarResponse = await tar.c(
      {
        gzip: true,
        file: 'slug.tgz'
      },
      ['./app']
    );


    const buf = readFileSync(`slug.tgz`);
    const response = await fetch(slugResult.blob.url, {
      method: 'PUT', // or 'PUT'
      // body: JSON.stringify(data), // data can be `string` or {object}!
      body: buf,
      headers: {
        "Content-Type": ""
      }
    })

    logger.info('Starting deployment');

    const release = await heroku.post(`/apps/${site.name}/releases`, {
      body: {
        slug: `${slugResult.id}`
      }
    });

    logger.info('Deployment Success!');
    return { success: true };
    // await remove(`${dir}/app`);
    // await remove(`${dir}/tmp`);
    // await remove(`${dir}/slug.tgz`);
  }
  catch (error) {
    logger.error('❌ An error occurred!');
    throw error;
  }
};


async function moveNodeJS(src, dest) {
  try {
    await move(src, dest)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}
