import { logging } from '@angular-devkit/core';

import { Schema } from '../deploy/schema';
const Heroku = require('heroku-client');
var url = require('url');
const fetch = require("node-fetch");

// TODO: add your deployment code here!
export async function run(dir: string, options: Schema, logger: logging.LoggerApi) {

  try {

    const heroku = new Heroku({ token: '' });

    const result = await heroku.get('/apps');
    const site = result.find((app => app.name === 'ngx-deploy-demo'))

    const slugResult = await heroku.post(`/apps/${site.name}/slugs`, {
      body: {
        process_types: { "web": "node-v0.10.20-linux-x64/bin/node index.js" }
      }
    }
    );

    // const upload
    // console.log(site);
    console.log(slugResult);
    const apiUrl = slugResult.blob.url.replace('%3D', '=');
    console.log(apiUrl);


    const response = await fetch(slugResult.blob.url, {
      method: `${slugResult.blob.method}`, // or 'PUT'
      // body: JSON.stringify(data), // data can be `string` or {object}!
      body: '@E:\ngx-deploy-heroku\ngx-deploy-sample\ngx-deploy-sample-0.0.0.tgz',
      headers: {
        'Content-Type': ''
      }
    });
    console.log(response);
    console.log(slugResult.id);

    const release = await heroku.post(`/apps/${site.name}/releases`, {
      body: {
        slug: `${slugResult.id}`
      }
    });

    console.log(release);

  }
  catch (error) {
    logger.error('❌ An error occurred!');
    throw error;
  }
};
