const fs = require('fs');
const mongodb = require('mongodb');
const gridBucket = require('./bucket');
const {ObjectID} = mongodb;
const state = require('./state');
const formidable = require('formidable');
const queryFs = require('./query-fs');
const constants = require('./constants');
const Boom = require('boom');

function gridfsInsert(req, file) {
  const [
    bucket,
    keyMetadata,
    cursor
  ] = gridBucket.build(req, {filename: file.name});

  return cursor.toArray().then((docs) => {
    if (docs.length > 0) {
      return Promise.all(
        docs.map((doc) => bucket.delete(doc._id).then(() => doc._id))
      );
    }
    return Promise.resolve([new ObjectID()]);
  })
  .then((idDocs) => {
    const [id] = idDocs;
    const otherMetadata = state.getOtherMetadata(req);
    const metadata = Object.assign({}, otherMetadata, keyMetadata.metadata);

    return new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
      .pipe(bucket.openUploadStreamWithId(id, file.name, {metadata}))
      .on('error', (errorPipe) => {
        console.log(errorPipe);
        fs.unlink(file.path, () => {
          reject(errorPipe);
        });
      })
      .on('finish', () => {
        fs.unlink(file.path, () => {
          resolve({
            _id: id,
            filename: file.name
          });
        });
      });
    });
  });
}

function define(router, postCallback) {
  router.post('', queryFs.middleware, (req, res, next) => {

    // create an incoming form object
    const form = new formidable.IncomingForm();

    if (state.maxFileSize) {
      form.maxFileSize = state.maxFileSize;
    }
    // store all uploads in the /uploads directory
    form.uploadDir = state.dirUploads;

    const filesReceived = [];
    const filesUploaded = [];

    /* every time a file has been uploaded successfully,
    stream it to gridfs */
    form.on('file', (field, file) => {
      // Fs.rename(file.path, Path.join(form.uploadDir, file.name));
      if (filesReceived.includes(file.name)) {
        console.log(`file already provided: ${file.name}`);
      } else {
        filesReceived.push(file.name);
        if (filesReceived.length === 1) {
          const promiseInsert = gridfsInsert(req, file);

          filesUploaded.push(promiseInsert);
        }
      }
    });

    // log any errors that occur
    form.on('error', (err) => {
      console.log('form.on error:', err);
      return next(Boom.badRequest(err.message, err));
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => {
      if (filesUploaded[0]) {
        return filesUploaded[0]
        .then((uploaded) => {
          postCallback(uploaded);
          res.status(constants.HTTP201).json(uploaded)
        });
      }
      return next(Boom.badRequest('No file provided'));
    });

    // parse the incoming request containing the form data
    form.parse(req);
  });
}

exports.define = define;
