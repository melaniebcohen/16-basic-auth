![cf](https://i.imgur.com/7v5ASc8.png) Lab 16: Basic Authentication
======

## Submission Instructions
* Work in a fork of this repository
* Work in a branch on your fork
* Write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-susan`
* Open a pull request to this repository
* Submit on canvas a question and observation, how long you spent, and a link to your pull request

## Configuration 
Configure the root of your repository with the following files and directories. Thoughtfully name and organize any additional configuration or module files.
* **README.md** - contains documentation
* **.gitignore** - contains a [robust](http://gitignore.io) `.gitignore` file 
* **.eslintrc** - contains the course linter configuratoin
* **.eslintignore** - contains the course linter ignore configuration
* **package.json** - contains npm package config
  * create a `lint` script for running eslint
  * create a `start` script for running your server
  * create a `test` script for running your tests
* **server.js** - runs your application
* **model/** - contains mongoose schemas
* **route/** - contains your routes
* **lib/** - contains custom middleware and helpers
* **\_\_test\_\_/** - contains route tests

## Feature Tasks
##### Minimum Requirements

* create an HTTP server using `express`
* using `mongoose`, create a **User** model with the following properties and options:
  * `username` - *required and unique*
  * `email` - *required and unique*
  * `password` - *required - this must be hashed and can not stored as plain text*
  * `findHash` - *unique*
* use the **npm** `debug` module to log function calls that are used within your application
* use the **express** `Router` to create a custom router for allowing users to **sign up** and **sign in**
* use the **npm** `dotenv` module to house the following environment variables as part of your application:
  * `PORT`
  * `MONGODB_URI`
  * `APP_SECRET` *(used for signing and verify tokens)*

## Server Endpoints
##### `/api/signup`
* **POST** request
  * should respond with a token (generated using `jwt`)
  * should respond with **400 Bad Request** if the request failed
  * should contain the username and password in the body of the request

##### `/api/signin`
* **GET** request
* should respond with a token for authenticated users
* should respond with **401 Unauthorized** for non-authenticated users
* should contain the username and password using a `Basic:` authorization header

## Testing

##### `/api/signup`
* **POST** test **400**
  * if no request body has been provided or the body is invalid
* **POST** test **200**
  * if the request body has been provided and is valid

##### `/api/signin`
* **GET** test **401**
  * if the user could not be authenticated
* **GET** test **200**
  * should respond with a token for a requests with a valid basic authorization header