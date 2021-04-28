const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const app = express();


const expressListRoutes = require('express-list-routes');

const gridfs = require('../../index');

const dburl = process.env.MONGO_URL || 'mongodb://localhost:27017/gridfs_fixture';

let db = null;

const routerAPI = new express.Router();

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

/*
app.use((req, res, next) => {
  console.log('[BODY] --', req.body);
  next();
});
*/

let server = null;

exports.app = app;

exports.start = (path) => mongodb.MongoClient.connect(dburl)
  .then((database) => {
    app.use(path, routerAPI);
    exports.getEndPoint = () => `http://localhost:${server.address().port}${path}`;
    db = database;
    const port = process.env.PORT || 0;

    server = app.listen(port, () => {
      console.log(`server listen on ${server.address().port}`);
      expressListRoutes({prefix: path}, 'API:', routerAPI);
      app.emit('ready', null);
    });
    exports.server = server;
  });

exports.close = () => {
  db.close()
  .then(() => {
    server.close();
  });
};

/* eslint no-process-env: "off" */
if (process.env.NODE_ENV !== 'test') {
  exports.start('/api/gridfs/v2');
}
