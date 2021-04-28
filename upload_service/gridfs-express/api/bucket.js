const {GridFSBucket, ObjectId} = require('mongodb');
const dot = require('dot-object');
const state = require('./state');
const Boom = require('boom');

function build(req, id) {
  const bucket = new GridFSBucket(state.getDb(), {
    'bucketName': req.query.fs
  });
  const metadata = state.getKeyMetadata(req);
  let keyMetadata = {};

  if (Object.keys(metadata).length > 0) {
    keyMetadata = {metadata};
  }
  // the filter must be in dot notation
  const filter = dot.dot(keyMetadata);

  if (id) {
    if (id._id) {
      try {
        filter._id = new ObjectId(id._id);
      } catch (error) {
        throw Boom.badRequest(error.message, id);
      }
    } else if (id.filename) {
      filter.filename = id.filename;
    }
  }

  const cursor = bucket.find(filter);

  return [
    bucket,
    keyMetadata,
    cursor
  ];
}

exports.build = build;
