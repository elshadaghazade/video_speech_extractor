const tmp = require('tmp');
const state = require('./api/state');
const utils = require('./api/utils');
const apiPost = require('./api/post');
const apiDelete = require('./api/delete');
const apiGet = require('./api/get');
const apiPatch = require('./api/patch');
const apiHttpError = require('./api/http-error');

function defaultGetKeyMetadata() {
  return {};
}

function defaultGetOtherMetadata() {
  return {};
}

function createTempDir() {
  tmp.dir({template: '/tmp/gridfs-XXXXXX'}, (err, path, ignored) => {
    if (err) {
      console.log(err);
    } else {
      state.dirUploads = path;
      console.log(`temporary dir created: ${path}`);
    }
  });
}

module.exports = (router, options, postCallback=()=>{}) => {
  if (!utils.isValue(options) || !utils.isValue(options.getDb)) {
    throw new Error('options.getDb is undefined or null');
  }

  if (typeof options.getDb === 'function') {
    state.getDb = options.getDb;
  } else {
    throw new Error('options.getDb must be a function');
  }

  const fsOptions = options.fsCollections || ['fs'];

  if (typeof fsOptions === 'string') {
    state.fsCollections = [fsOptions];
  } else if (Array.isArray(fsOptions)) {
    state.fsCollections = fsOptions;
  } else {
    throw new Error(`bad config property db.fs = ${fsOptions}. Must be a string or an Array.`);
  }

  state.fsCollections.forEach((fsName) => {
    if (typeof fsName !== 'string') {
      throw new Error(`Invalid member ${fsName} options.fsCollection, must be a string`);
    }
  });

  state.getKeyMetadata = options.getKeyMetadata || defaultGetKeyMetadata;
  if (typeof state.getKeyMetadata !== 'function') {
    throw new Error('options.getKeyMetadata must be a function');
  }

  state.getOtherMetadata = options.getOtherMetadata || defaultGetOtherMetadata;
  if (typeof state.getOtherMetadata !== 'function') {
    throw new Error('options.getOtherMetadata must be a function');
  }

  if (options.maxFileSize) {
    if (typeof options.maxFileSize !== 'number') {
      throw new Error('options.maxFileSize must be a number');
    }
    state.maxFileSize = options.maxFileSize;
  }

  createTempDir();

  apiPost.define(router, postCallback);
  apiGet.define(router);
  apiDelete.define(router);
  apiPatch.define(router);
  apiHttpError.define(router);
};
