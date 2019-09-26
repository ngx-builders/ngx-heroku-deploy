import { logging } from '@angular-devkit/core';
import * as fse from 'fs-extra';

import { Schema } from '../deploy/schema';
const Heroku = require('heroku-client');

// TODO: add your deployment code here!
export async function run(dir: string, options: Schema, logger: logging.LoggerApi) {

  try {

    const heroku = new Heroku({ token: '' });

    const result = await heroku.get('/apps');
    const site = result.find((app => app.name === 'ngx-deploy-demo'))

    const slugResult = await heroku.post(`/apps/${site.name}/slugs`,{
        body: {
          process_types: { "web": "node-v0.10.20-linux-x64/bin/node index.js" }
        }
      }
    );
    // console.log(site);
    console.log(slugResult.blob.url);
  }
  catch (error) {
    logger.error('❌ An error occurred!');
    throw error;
  }
};
