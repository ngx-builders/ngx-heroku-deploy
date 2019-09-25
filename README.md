# @angular-schule/ngx-deploy-starter 🚀
[![NPM version][npm-image]][npm-url]
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?color=blue&style=flat-square)](http://opensource.org/licenses/MIT)

![Banner](docs/ng-deploy-starter-project.jpg)

## About

This is a sample project that helps you to implement your own __deployment builder__ (`ng deploy`) for the Angular CLI.
The groundwork of this starter was provided by Minko Gechev's [ngx-gh project](https://github.com/mgechev/ngx-gh).

This project has the following purposes:

1. To promote the adoption of `ng deploy`.
2. To clarify various questions and to standardise the experience of the various builders.  

We hope for an inspiring discussion, pull requests and questions.

**If you don't know `ng deploy` yet, learn more about this command here:  
[👉 Blogpost: All you need to know about `ng deploy`](https://angular.schule/blog/2019-08-ng-deploy)**  

## Essential considerations

There are still differences between the existing builders. 
Let's find some rules that everyone agrees with. Here are two proposals.

### 1. A deployment builder must always compile the project before the deployment

To reduce the chances to deploy corrupted assets, it's important to build the app right before deploying it. ([source](https://github.com/angular-schule/website-articles/pull/3#discussion_r315802100))

**Current state:**  
Currently there are existing deployment builders that only build in production mode.
This might be not enough.
There is also the approach not to perform the build step at all.

**Our suggestion:**  
By default, a deployment builder **shall** compile in `production` mode, but it **should** be possible to override the default configuration using the option `--configuration`.

Discussion: https://github.com/angular-schule/ngx-deploy-starter/issues/1

### 2. A deployment builder should have an interactive prompt after the "ng add".

To make it easier for the end user to get started, a deployment builder **should** ask for all the mandatory questions immediately after the `ng add`.
The data should be persisted in the `angular.json` file.

**Note:**  
This feature is not implemented for this starter yet, but we are looking forward to your support.

Discussion: https://github.com/angular-schule/ngx-deploy-starter/issues/2

### 3. More to come

What's bothers you about this example?
We appreciate your [feedback](https://github.com/angular-schule/ngx-deploy-starter/issues)!


## How to make your own deploy builder

1. fork this repository
2. adjust the `package.json`
3. search and replace for the string `@angular-schule/ngx-deploy-starter` and `ngx-deploy-starter` and choose your own name.
4. search and replace for the string `to the file system` and name your deploy target.
5. add your deployment code to `src/engine/engine.ts`, take care of the tests
6. follow the instructions from the [contributors README](docs/README_contributors.md) for build, test and publishing.


You are free to customise this project according to your needs.
Please keep the spirit of Open Source alive and use the MIT or a compatible license.


## Projects based on ngx-deploy-starter
 
* [ngx-deploy-npm](https://github.com/bikecoders/ngx-deploy-npm) – Deploy your Angular Package to NPM directly from the Angular CLI! 🚀
* [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages) – Deploy your Angular app to GitHub pages directly from the Angular CLI! 🚀




## License
Code released under the [MIT license](LICENSE).


[npm-url]: https://www.npmjs.com/package/@angular-schule/ngx-deploy-starter
[npm-image]: https://badge.fury.io/js/%40angular-schule%2Fngx-deploy-starter.svg
