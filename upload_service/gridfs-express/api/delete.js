const gridBucket = require('./bucket');
const queryFs = require('./query-fs');
const queryType = require('./query-key');
const Boom = require('boom');

function define(router) {
  router.delete('/:file_id', queryFs.middleware, queryType.middleware, (req, res, next) => {
    let key = {};

    if (req.query.key === 'id') {
      key = {_id: req.params.file_id};
    } else {
      key = {filename: req.params.file_id};
    }
    const [
      bucket,
      keyMetadata,
      cursor
    ] = gridBucket.build(req, key);

    cursor.next().then((doc) => {
      if (doc === null) {
        return Promise.reject(Boom.notFound('file not found', {
          key,
          keyMetadata
        }));
      }
      return bucket.delete(doc._id);
    })
    .then(() => res.json(key))
    .catch((error) => {
      if (error.isBoom) {
        return next(error);
      }
      const data = {
        key,
        keyMetadata,
        error
      };

      return next(Boom.badImplementation(error.message, data));
    });
  });
}

exports.define = define;
