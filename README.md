![cf](https://i.imgur.com/7v5ASc8.png) Lab 13: MongoDB
======

## Directory Structure
* **README.md**
* **.gitignore**
* **.eslintrc**
* **.eslintignore**
* **package.json**
  * a `lint` script has been configured for running eslint
  * a `test` script has been configured for running jest
  * a `test-coverage` script has been configured for running jest with coverage information
  * a `start` script has been configured for running the server
* **lib/** - contains custom middleware
  * **error-middleware.js**
  * **server-toggle.js**
* **model/** - contains mongoose schemas
  * **list.js**
  * **recipe.js**
* **router/** - contains routes
  * **list-router.js**
  * **recipe-router.js**
* **__test__** - contains route tests
  * **list.test.js**
  * **recipe.test.js**
* **server.js** - runs the application

## Installation
1. To install this application, download the files from this repository
2. `cd` to the repository directory and run `npm i`
3. Use `npm run start` or `node server.js` to start the server connection
4. Alternatively, run `npm run test` or `npm run test-coverage` to run tests

## Server Endpoints
Users can make the following requests:

**GET:**  
With a valid list id, users can use the following route: 
```
localhost:3000/api/list/:listId
```
With a valid recipe id, users can use the following route: 
```
localhost:3000/api/recipe/:recipeId
```

**POST:**  
Lists can be created using the following route: 
```
localhost:3000/api/list
```
Recipes can be created using the following route (once a list has been created):
```
localhost:3000/api/list/:listId/recipe
```

**PUT:**  
Lists can be updated using the following route: 
```
localhost:3000/api/list/:listId
```
Recipes can be updated using the following route:
```
localhost:3000/api/recipe/:recipeId
```

**DELETE:**  
Lists can be deleted using the following route: 
```
localhost:3000/api/list/:listId
```
Recipes can be deleted using the following route: 
```
localhost:3000/api/recipe/:recipeId
```