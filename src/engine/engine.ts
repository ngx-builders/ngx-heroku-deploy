import { logging } from '@angular-devkit/core';
import { Schema } from '../deploy/schema';
const Heroku = require('heroku-client');
import * as tar from 'tar';
const fetch = require("node-fetch");
import {
  ensureDir, copy, remove, move,
  copyFileSync, readFileSync, createWriteStream
} from 'fs-extra';


// TODO: add your deployment code here!
export async function run(dir: string,
  options: Schema,
  outDir: string,
  logger: logging.LoggerApi) {

  try {

    const herokuToken = process.env.HEROKU_TOKEN;
    if(!herokuToken) throw new Error('HEROKU_TOKEN not found in your environment!!');

    const heroku = new Heroku({ token: herokuToken });

    const result = await heroku.get('/apps');
    const site = result.find((app => app.name === 'ngx-deploy-demo'))

    const slugResult = await heroku.post(`/apps/${site.name}/slugs`, {
      body: {
        buildpack_provided_description: "heroku/nodejs",
        process_types: { "web": `node-v12.12.0-linux-x64/bin/node index.js` }
      }
    });
    logger.info('Copying Build Files');
    await remove(`${dir}/app`);
    await remove(`${dir}/tmp`);
    await remove(`${dir}/slug.tgz`);
    await ensureDir(`${dir}/app`);
    await ensureDir(`${dir}/tmp`);

    await download();
    await copy(`${outDir}`, `${dir}/app`);
    await moveNodeJS('node-v12.12.0-linux-x64', `${dir}/app/node-v12.12.0-linux-x64`)
    copyFileSync('index.js', `${dir}/app/index.js`);

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
    // await remove(`${dir}/app`);
    // await remove(`${dir}/tmp`);
    // await remove(`${dir}/slug.tgz`);
  }
  catch (error) {
    logger.error('❌ An error occurred!');
    throw error;
  }
};


async function download() {
  const res = await fetch('http://nodejs.org/dist/latest-v12.x/node-v12.12.0-linux-x64.tar.gz');
  await new Promise((resolve, reject) => {
    const fileStream = createWriteStream('./tmp/node-v12.12.0-linux-x64.tar.gz');
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function () {
      tar.x({
        file: './tmp/node-v12.12.0-linux-x64.tar.gz'
      })
      resolve();
    });
  });
}

async function moveNodeJS(src, dest) {
  try {
    await move(src, dest)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}
