![cf](https://i.imgur.com/7v5ASc8.png) Lab 16: Basic Authentication
======

## Directory Structure
* **README.md**
* **.gitignore**
* **.eslintrc**
* **.eslintignore**
* **package.json** - contains npm package config
  * a `lint` script has been configured for running eslint
  * a `test` script has been configured for running jest
  * a `start` script has been configured for running the server
* **server.js** - runs the application
* **model/** - contains resource model
  * **user.js**
* **router/** - contains routes
  * **auth-router.js**
* **lib/** - contains custom middleware and helpers
  * **basic-auth-middleware.js**
  * **error-middleware.js**
  * **server-toggle.js**
* **\_\_test\_\_/** - contains route tests
  * **auth-router.test.js**

## Installation
1. To install this application, download the files from this repository
2. `cd` to the repository directory and run `npm i`
3. Use `npm run start` or `node server.js` to start the server connection
4. Alternatively, run `npm run test` to run tests

## Server Endpoints
##### `/api/signup`
* **POST** request
  * responds with a token or **400 Bad Request** if the request failed
  * should contain the username and password in the body of the request

##### `/api/signin`
* **GET** request
* respond with a token for authenticated users or **401 Unauthorized** for non-authenticated users
* should contain the username and password using a `Basic:` authorization header