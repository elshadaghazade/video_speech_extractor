const utils = require('./utils');
const state = require('./state');
const Boom = require('boom');

exports.middleware = (req, res, next) => {
  if (!utils.isValue(req.query.fs)) {
    if (state.fsCollections.length === 1) {

      [req.query.fs] = state.fsCollections;
    } else {
      return next(Boom.badRequest('missing query parameter fs', {validFs: state.fsCollections}));
    }
  }
  if (state.fsCollections.includes(req.query.fs)) {
    return next();
  }
  return next(Boom.badRequest(`invalid query parameter fs=${req.query.fs}`, {validFs: state.fsCollections}));
};
