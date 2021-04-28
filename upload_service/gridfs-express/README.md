gridfs-express
=========
[![build status](https://gitlab.com/jorge.suit/gridfs-express/badges/master/build.svg)](https://gitlab.com/jorge.suit/gridfs-express/badges/master/build.svg)

Provide an API REST which support upload/download files to/from a modgodb grid. This package
enable the user to define the API on a given Express router.

A complete example of a service using this package can be found at [example-gridfs-express](https://gitlab.com/jorge.suit/example-gridfs-express) 

## Installation

  `npm install gridfs-express`

## Usage

```javascript
const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const expressListRoutes = require('express-list-routes');
const gridfs = require('gridfs-express');

const app = express();

const url = "mongodb://localhost:27017/gridfs_test";

let db;

const routerAPI = express.Router();

gridfs(routerAPI, {
  getDb: () => db,
  getKeyMetadata: (req) => ({id: req.query.id}),
  getOtherMetadata: (req) => req.body,
  fsCollections: [
    'input',
    'output'
  ]
});

app.use(bodyParser.json());
app.use('/api/gridfs', routerAPI);
expressListRoutes({prefix: '/api/gridfs'}, 'API:', routerAPI);

mongodb.MongoClient.connect(url, function(err, database) {
  if(err) throw err;

  db = database;
  // Start the application after the database connection is ready
  app.listen(3000);
});
```

The function `gridfs` define the following API on the given router object.

| route                    | verb   | URL parameters                       | description                                |
| ------------------------ | ------ | ------------------------------------ | ------------------------------------------ |
| /api/gridfs              | GET    | fs=[string]                          | get all files info                         |
| /api/gridfs/:id          | GET    | fs=[string]<br>key=['filename','id'] | get a single file                          |
| /api/gridfs/:id/info     | GET    | fs=[string]<br>key=['filename','id'] | get a sigle file, include a metadata field |
| /api/gridfs              | POST   | fs=[string]                          | upload a new file                          |
| /api/gridfs/:id          | DELETE | fs=[string]<br>key=['filename','id'] | delete a single file                       |
| /api/gridfs/:id/metadata | PATCH  | fs=[string]<br>key=['filename','id'] | modify the metadata field                  |


The parameter `:id` is considered either as an identifier or
filename depending on the value of query parameter `key` which
could take on of the values `id` or `filename` respectively.

Note that the path `/api/gridfs` depends on the user election.

## Options

The second argument to the function `gridfs` is an object with options
to configure the endpoints. It is required to provide a function member
to get the mongodb connection:

```javascript
{
  getDb: () => {return db}
}
```

Other members which are optional are:

* `maxFileSize`: the maximum file size allowed. The default limit is 200MB.
* `fsCollections`: it is an array of string which contains the allowed collection
  names to be used in the query parameter `fs`. This array is used to
  validate the query parameter `fs`.
* `getKeyMetadata`: it is a function which should return an object. This
  object will be associated to the file in the gridfs collection. The
  filename will be unique for that object value. This objects is
  stored within the metadata for the file in the gridfs. The function will
  receive as argument the request object `req`. For instance, the following
  function build the key object from the url query parameter id:

```javascript
function getKeyMetadata(req) {
  return {id: req.query.id};
}
```

* `getMetadata`: it is a function which should return an object,
  this object will be stored within the metadata for the file. The function will
  receive as argument the request object `req`. The returned object should not
  contain the keys returned from getKeyMetadata, they will be discarded.
  For instance, the following function build the an extra metadata object from
  the query parameters tag1 and tag2:

```javascript
function getOtherMetadata(req) {
  return {
    tag1: req.query.tag1,
    tag2: req.query.tag1
  };
}
```
## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing
coding style. Add unit tests for any new or changed
functionality. Lint and test your code.
