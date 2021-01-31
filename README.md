[![npm downloads](https://img.shields.io/npm/dt/ngx-heroku-deploy?label=npm%20downloads)](https://www.npmjs.com/package/ngx-heroku-deploy)
[![npm (scoped)](https://img.shields.io/npm/v/ngx-heroku-deploy)](https://www.npmjs.com/package/ngx-heroku-deploy)
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)

## **Deploy your Angular app to Heroku directly from the Angular CLI! 🚀**


## Prerequisite

You will need two things in order to get started
- Application Name : Project/Application name in which you want to deploy your a application build.

![alt text](https://raw.githubusercontent.com/ngx-builders/ngx-heroku-deploy/master/screenshots/application-name.png)


- Authorization token : This token is used for authentication in all Heroku API requests, and can be regenerated at will by the user in the heroku.com web interface.


#### Steps to get "Authorization Token"
    1. Login into Heroku site.
    2. Go to your account settings.
    3. Click  on "Applications" tab.
    4. There is a section named as  "Authorizations".
    5. Create a Authorization token from here and provide that token key which installing this

    ![alt text](https://raw.githubusercontent.com/ngx-builders/ngx-heroku-deploy/master/screenshots/auth-token.png)

## Setting up this Builder

```
ng add ngx-heroku-deploy
OR 
ng add ngx-heroku-deploy --project={projectName}
```

The above command will configure everything, you just need to provide Authorization Toaken and Application Name when it will ask you for that.

## That's it. Now, you are good to go

Now, Whenever you want to deploy your angular project just run a command `ng run [YOUR_PROJECT_NAME]:deploy` and your project will be deployed with new updates.


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
   <td align="center"><a href="https://www.santoshyadav.dev"><img src="https://avatars.githubusercontent.com/u/11923975?v=4" width="100px;" alt=""/><br /><sub><b>Santosh Yadav</b></sub></a><br /><a href="https://github.com/ngx-builders/ngx-heroku-deploy/commits?author=santoshyadavdev" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/patelvimal"><img src="https://avatars.githubusercontent.com/u/6451223?v=4" width="100px;" alt=""/><br /><sub><b>Vimal Patel</b></sub></a><br /><a href="https://github.com/ngx-builders/ngx-heroku-deploy/commits?author=patelvimal" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
