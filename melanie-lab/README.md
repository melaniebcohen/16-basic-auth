![cf](https://i.imgur.com/7v5ASc8.png) Lab 18: Asset Management
======

## Directory Structure
* **README.md**
* **.gitignore**
* **.eslintrc**
* **.eslintignore**
* **package.json** - contains npm package config
  * a `lint` script has been configured for running eslint
  * a `test` script has been configured or running jest
  * a `start` script has been configured for running the server
* **server.js** - runs the application
* **model/** - contains resource model
  * **user.js**
  * **gallery.js**
  * **photo.js**
* **router/** - contains routes
  * **auth-router.js**
  * **gallery-router.js**
  * **photo-router.js**
* **lib/** - contains custom middleware and helpers
  * **basic-auth-middleware.js**
  * **bearer-auth-middleware.js**
  * **error-middleware.js**
  * **server-toggle.js**
* **\_\_test\_\_/** - contains route tests
  * **auth-router.test.js**
  * **gallery-router.test.js**
  * **photo-router.test.js**

## Installation
1. To install this application, download the files from this repository
2. `cd` to the repository directory and run `npm i`
3. Use `npm run start` or `node server.js` to start the server connection
4. Alternatively, run `npm run test` to run tests

## Server Endpoints
### User Creation & Authentication
#### POST Request
  * Responds with a token or **400 Bad Request** if the request failed
  * Contains the username and password in the body of the request  
```  
/api/signup  
```

#### GET Request
  * Responds with a token for authenticated users or **401 Unauthorized** for non-authenticated users
  * Contains the username and password using a `Basic:` authorization header
```
/api/signup
```

### Gallery CRUD Functionality
#### POST Request
  * Passes data as stringified JSON in the body of a POST request to create a new resource
```
/api/gallery
```

#### GET Request
  * Passes id of a resource through the URL endpoint to req.params to fetch a resource
```
/api/gallery/:galleryId
```

#### PUT Request
  * Passes data as stringified JSON to update a resource
```
/api/gallery/:galleryId
```

#### GET Request
  * Passes data as stringified JSON to delete a resource
```
/api/gallery/:galleryId
```

### Photo CRUD Functionality
#### POST Request
  * Uploads static photo file (in the test case, `porg.jpg` from a `data` folder) to AWS
```
/api/photo/:photoId
```