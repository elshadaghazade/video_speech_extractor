const queryFs = require('./query-fs');
const queryKey = require('./query-key');
const gridBucket = require('./bucket');
const state = require('./state');
const {ObjectID} = require('mongodb');
const dot = require('dot-object');
const Boom = require('boom');

function define(router) {
  router.patch('/:file_id/metadata', queryFs.middleware, queryKey.middleware, (req, res, next) => {
    let key = null;

    if (req.query.key === 'filename') {
      key = {filename: req.params.file_id};
    } else {
      key = {_id: req.params.file_id};
    }
    const [
      ,
      keyMetadata,
      cursor
    ] = gridBucket.build(req, key);

    cursor.toArray().then((docs) => {
      const [id] = docs;

      if (id) {
        const otherMetadata = state.getOtherMetadata(req);
        const db = state.getDb();

        Object.keys(keyMetadata).forEach((value) => {
          Reflect.deleteProperty(otherMetadata, value);
        });
        if (Object.keys(otherMetadata).length === 0) {
          return next(Boom.badRequest('empty metadata provided', {key}));
        }
        const metadata = {metadata: otherMetadata};

        return db.collection(`${req.query.fs}.files`).updateOne(
          {_id: new ObjectID(id._id)},
          {$set: dot.dot(metadata)}
        )
        .then((result) => res.json({
          key,
          update: result
        }));
      }
      return next(Boom.notFound('file not found', key));
    })
    .catch((error) => {
      next(Boom.badImplementation(error.message, {
        key,
        errCode: error.code,
        errMessage: error.message
      }));
    });
  });
}

exports.define = define;
