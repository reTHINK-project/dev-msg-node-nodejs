# dev-msg-node-nodejs

### Setup Environment
On the first time you are cloning this repository, you need to run the command ```npm run init-setup```;

After running successfully this command you will have 2 folders (node_modules and vendor), these folders are excluded from the commit process, and are only for development.

if you already have the project configured on your machine, you only need run the command ```npm install``` to add new dependencies;

if you have some trouble with the environment, you can open an issue;

### Javascript Environment
JavaScript code should be written in ES6.
There are direct dependencies from nodejs and npm, these can be installed separately or in conjunction with [nvm](https://github.com/creationix/nvm)

#### dependencies:
* nodejs
* npm
* karma - Make the communication between unit test tool and jenkins. See more on [karma](http://karma-runner.github.io/0.13/index.html)
* mocha - Unit test tool. See more on [http://mochajs.org](http://mochajs.org/)
* jspm - Don't need compile the code, it uses babel (or traucer or typescript) to run ES6 code on browser. Know more in [jspm.io](http://jspm.io/)
* gulp - Automate and enhance your workflow. See more about gulp on [gulp](http://gulpjs.com/)

#### Code Style and Hinting
On the root directory you will find **.jshintrc** and **.jscsrc**, these files are helpers to maintain syntax consistency, it signals syntax mistakes and makes the code equal for all developers.

- [jscs](http://jscs.info/) - Maintain JavaScript Code Style
- [jshint](http://jshint.com/) - Detect errors and potential problems in JavaScript code.

All IDE's and Text Editors can handle these tools.

#### Documentation

To generates api documentation you can run ```gulp doc```

### Unit Testing
Unit testing can be launched manually with **karma start**.

~~It's advisable to use [expect.js](https://github.com/Automattic/expect.js) instead of assert.~~

After investigate and testing the [expect.js](https://github.com/Automattic/expect.js) it don't support some features for ES6, because this tool hasn't activity at some time, that is why, it is recomended use the [chaijs](http://chaijs.com/) it is more versatile and have expect.js (but updated) and others tools that can be useful;


### Karma
if you have some problems starting the karma tests, try running this commands for the following order:

 1. ```npm uninstall karma karma-browserify karma-mocha karma-mocha-reporter karma-chrome-launcher -g```
 2. ```npm install karma-cli -g```
 3. ```npm install```
 4. ```jspm update```


#### Note
This repository is ready to start working on development.
The code will go to the **src** folder.
The unit tests will be on **test** folder, following the name standard <component>.spec.js

The npm module **live-server** can be used for development tests, but it's not mandatory: [live-server](https://www.npmjs.com/package/live-server)
