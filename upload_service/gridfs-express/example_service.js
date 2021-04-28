const express = require('express');
const mongodb = require('mongodb');
const app = express();

const gridfs = require('./index');

const url = 'mongodb://localhost:27017/gridfs_test';

let db = null;

mongodb.MongoClient.connect(url, (err, database) => {
  if (err) {
    throw err;
  }

  db = database;
  // Start the application after the database connection is ready
  const port = 3000;

  app.listen(port);
  console.log('Listening on port 3000');
});

const routerAPI = new express.Router();

gridfs(routerAPI, {
  getDb: () => db
});

app.use('/api/gridfs', routerAPI);
