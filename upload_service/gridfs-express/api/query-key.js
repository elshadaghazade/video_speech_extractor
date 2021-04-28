const utils = require('./utils');
const Boom = require('boom');

exports.middleware = (req, res, next) => {
  if (!utils.isValue(req.query.key)) {
    req.query.key = 'id';
    return next();
  }
  const validKeys = [
    'id',
    'filename'
  ];

  if (validKeys.includes(req.query.key)) {
    return next();
  }
  return next(Boom.badRequest(`Invalid query parameter key=${req.query.key}`, {validKeys}));
};
