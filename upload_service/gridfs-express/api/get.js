const queryFs = require('./query-fs');
const queryKey = require('./query-key');
const gridBucket = require('./bucket');
const Boom = require('boom');

function define(router) {
  router.get('', queryFs.middleware, (req, res) => {
    const [, , cursor] = gridBucket.build(req);

    return cursor.toArray().then((documents) => {
      res.json(documents);
    });
  });

  router.get('/:file_id',
            queryFs.middleware,
            queryKey.middleware,
            (req, res, next) => {
    let key = {};

    if (req.query.key === 'id') {
      key = {_id: req.params.file_id};
    } else {
      key = {filename: req.params.file_id};
    }
    const [bucket, , cursor] = gridBucket.build(req, key);

    cursor.toArray().then((documents) => {
      if (documents.length) {
        res.set('Content-Disposition', `attachment; filename=${documents[0].filename}`);

        /** set the proper content type */
        res.set('Content-Type', 'application/octet-stream');

        /** return response */
        return bucket.openDownloadStream(documents[0]._id).pipe(res);
      }
      return next(Boom.notFound('file not found', key));
    });
  });

  router.get('/:file_id/info',
            queryFs.middleware,
            queryKey.middleware,
            (req, res, next) => {
    let key = {};

    if (req.query.key === 'id') {
      key = {_id: req.params.file_id};
    } else {
      key = {filename: req.params.file_id};
    }
    const [, , cursor] = gridBucket.build(req, key);

    cursor.toArray().then((documents) => {
      if (documents.length) {
          return res.json(documents[0]);
      }
      return next(Boom.notFound('file not found', key));
    });
  });
}

exports.define = define;
