const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressListRoutes = require('express-list-routes');
const gridfs = require('./gridfs-express');
const amqp = require('amqplib/callback_api');
const transcriptRouter = require('./app/transcript/routes');

const app = express();
const url = "mongodb://elshad:123456@mongo:27017/";
let db, amqpChannel, queue = 'vids';

app.use(cors());

app.use('/', express.static('static'));


amqp.connect('amqp://rabbitmq', function(error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    amqpChannel = channel;

    channel.assertQueue(queue, {
      durable: true
    });
  });
});

const postCallback = (uploaded) => {
  const vid = uploaded._id.toString();
  app.locals.db.collection('videos.files').findOne({
    _id: mongodb.ObjectId(vid)
  }).then(result => {
    if (!result) {
      return;
    }

    app.locals.db.collection('transcripts').findOne({
      md5: result.md5
    }).then(result => {
      if (!result) {
        if (amqpChannel) {
          amqpChannel.sendToQueue(queue, Buffer.from(vid));
        }
      } else {
        app.locals.db.collection('videos.files').deleteMany({
          _id: mongodb.ObjectId(vid)
        })
        .then(result => {
          app.locals.db.collection('videos.chunks').deleteMany({
            files_id: mongodb.ObjectId(vid)
          })
          .then(result => {})
          .catch(error => {});
        })
        .catch(error => {});
      }
    });
  });
}

const routerAPI = express.Router();

gridfs(routerAPI, {
  getDb: () => app.locals.db,
  getKeyMetadata: (req) => {
    return {id: req.query.id}
  },
  getOtherMetadata: (req) => {
    return req.body
  },
  fsCollections: [
    'videos'
  ]
}, postCallback);

app.use(bodyParser.json());
app.use('/api/transcript_generator', routerAPI);
app.use('/api/transcript', transcriptRouter);

expressListRoutes({prefix: '/api/transcript_generator'}, 'API:', routerAPI);

var mongoClient = new mongodb.MongoClient(url, { useUnifiedTopology: true });
mongoClient.connect((err, client) => {
  if(err) throw err;

  app.locals.db = client.db('video_transcript_generator');
  var server = app.listen(3000, '0.0.0.0');
  server.keepAliveTimeout = 3600000;
  server.headersTimeout = 4000000;
});