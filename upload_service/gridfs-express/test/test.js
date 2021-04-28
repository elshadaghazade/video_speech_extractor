/* eslint no-process-env: "off" */
/* eslint max-lines: "off" */
/* global describe, it, after, before */

const chakram = require('chakram');
const {expect} = chakram;
const fs = require('fs');
const path = require('path');
const {HTTP200, HTTP201, HTTP400, HTTP404} = require('../api/constants');

process.env.NODE_ENV = 'test';

const service = require('./fixture/service');

describe('GRIDFS-EXPRESS', () => {
  let url = '';
  let anId = '';
  const anyId = '5aa8fe3fc1ff1a2330a6acca';

  before('start server', (done) => {
    service.start('/api/gridfs/v2');
    service.app.on('ready', () => {
      url = service.getEndPoint();
      done();
    });
  });

  describe('UPLOAD', () => {

    it('return 400 on POST /api/gridfs?fs=unknown', () => {
      const response = chakram.post(`${url}?fs=unknown`);

      expect(response).to.have.status(HTTP400);
      expect(response)
      .to.comprise
      .json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'invalid query parameter fs=unknown',
        data: {
          validFs: [
            'input',
            'output'
          ]
        }
      });
      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });

    it('return 400 on POST /api/gridfs with no file', () => {
      const response = chakram.post(`${url}?fs=input&id=myid`);

      expect(response).to.have.status(HTTP400);
      expect(response)
      .to.comprise
      .json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'No file provided'
      });
      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });

    it('return 201 on POST /api/gridfs with multiform', () => {
      const file = path.resolve(__dirname, './fixture/data/sample_file.txt');

      /* eslint no-void: 0 */
      const response = chakram.post(`${url}?fs=input&id=myid`, void 0, {
        formData: {
          file: fs.createReadStream(file)
        },
        headers: {'Content-Type': 'multipart/form-data; charset=utf-8;'}
      });

      expect(response).to.have.status(HTTP201);
      expect(response)
      .to.comprise
      .json({
        filename: 'sample_file.txt'
      });
      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();

    });

    it('return 201 on POST /api/gridfs another file', () => {
      const file = path.resolve(__dirname, './fixture/data/sample_file2.txt');

      /* eslint no-void: 0 */
      const response = chakram.post(`${url}?fs=input&id=myid`, void 0, {
        formData: {file: fs.createReadStream(file)},
        headers: {'Content-Type': 'multipart/form-data charset=utf-8'}
      });

      expect(response).to.have.status(HTTP201);
      expect(response)
      .to.comprise
      .json({
        filename: 'sample_file2.txt'
      });
      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();

    });


    it('return 201 on POST the same file repeated', () => {
      const file = path.resolve(__dirname, './fixture/data/sample_file.txt');

      /* eslint no-void: 0 */
      const response = chakram.post(`${url}?fs=input&id=myid&tag=mytag`, void 0, {
        formData: {
          file1: fs.createReadStream(file),
          file2: fs.createReadStream(file)
        },
        headers: {'Content-Type': 'multipart/form-data'}
      });

      expect(response).to.have.status(HTTP201);
      expect(response)
      .to.comprise
      .json({
        filename: 'sample_file.txt'
      });
      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();

    });
  });

  describe('GET ALL FILES INFO', () => {
    it('return 200 on GET /api/gridfs', () => {
      const response = chakram.get(`${url}?fs=input&id=myid`);

      expect(response).to.have.status(HTTP200);
      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait().then(() => {
        const {body} = response.valueOf();

        // console.log(body);
        expect(body).to.be.a('array');
      });
    });

    it('return 200 & files=[] on GET /api/gridfs & no matching key-metadata', () => {
      const response = chakram.get(`${url}?fs=input&id=wrong_id`);

      expect(response).to.have.status(HTTP200);
      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait().then(() => {
        const {body} = response.valueOf();

        // console.log(body);
        expect(body).to.be.a('array');
        // eslint-disable-next-line no-unused-expressions
        expect(body).to.be.empty;
      });
    });
  });

  describe('GET SINGLE FILE INFO', () => {
    it('return 400 on GET /api/gridfs/:file_id/info no query fs', () => {
      const response = chakram.get(`${url}/${anyId}/info`);

      expect(response).to.have.status(HTTP400);
      expect(response).to.comprise.json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'missing query parameter fs',
        data: {
          validFs: [
            'input',
            'output'
          ]
        }
      });

      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });

    it('return 400 on GET /api/gridfs/:file_id/info?key=unknown', () => {
      const response = chakram.get(`${url}/${anyId}/info?fs=input&key=unknown`);

      expect(response).to.have.status(HTTP400);
      expect(response).to.comprise.json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid query parameter key=unknown',
        data: {
          validKeys: [
            'id',
            'filename'
          ]
        }
      });

      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });

    it('return 400 on GET /api/gridfs/invalid_id/info', () => {
      const response = chakram.get(`${url}/invalid_id/info?fs=input&id=myid&key=id`);

      expect(response).to.have.status(HTTP400);
      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait().then(() => {
        const {body} = response.valueOf();

        expect(body).to.have.keys([
          'statusCode',
          'error',
          'message',
          'data'
        ]);
        expect(body.data).to.have.keys(['_id']);
      });
    });

    it(`return 404 on GET /api/gridfs/${anyId}`, () => {
      const response = chakram.get(`${url}/${anyId}?fs=input&id=myid&key=id`);

      expect(response).to.have.status(HTTP404);
      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait().then(() => {
        const {body} = response.valueOf();

        expect(body).to.have.keys([
          'statusCode',
          'error',
          'message',
          'data'
        ]);
        expect(body.data).to.have.keys(['_id']);
      });
    });

    it('return 404 on GET /api/gridfs/not-found.txt', () => {
      const response = chakram.get(`${url}/not-found.txt?fs=input&id=myid&key=filename`);

      expect(response).to.have.status(HTTP404);
      expect(response).to.comprise.json({
        statusCode: 404,
        error: 'Not Found',
        message: 'file not found',
        data: {
          filename: 'not-found.txt'
        }
      });

      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait();
    });

    it('return 200 on GET /api/gridfs/sample_file.txt/info', () => {
      const response = chakram.get(`${url}/sample_file.txt/info?fs=input&id=myid&key=filename`);

      expect(response).to.have.status(HTTP200);
      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait().then(() => {
        const {body} = response.valueOf();

        expect(body).to.have.keys([
          '_id',
          'length',
          'chunkSize',
          'uploadDate',
          'md5',
          'filename',
          'metadata'
        ]);
        expect(body.metadata).to.be.a('object');
        anId = body._id;
      });
    });

    it('return 200 on GET /api/gridfs/:file_id/info', () => {
      const response = chakram.get(`${url}/${anId}/info?fs=input&id=myid&key=id`);

      expect(response).to.have.status(HTTP200);
      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait().then(() => {
        const {body} = response.valueOf();

        // console.log(body);
        expect(body).to.have.keys([
          '_id',
          'length',
          'chunkSize',
          'uploadDate',
          'md5',
          'filename',
          'metadata'
        ]);
        expect(body.metadata).to.be.a('object');
      });
    });

    it('return 200 on download GET /api/gridfs/:file_id key=filename', () => {
      const response = chakram.get(`${url}/sample_file.txt?fs=input&id=myid&key=filename`);

      expect(response).to.have.status(HTTP200);

      after(() => {
        // console.log(JSON.stringify(response.valueOf().response.headers, null, '  '));
      });
      return chakram.wait().then(() => {
        expect(response.valueOf().body).to.equal('hello gridfs');
      });
    });

    it('return 200 on download GET /api/gridfs/:file_id key=id', () => {
      const response = chakram.get(`${url}/${anId}?fs=input&id=myid`);

      expect(response).to.have.status(HTTP200);

      after(() => {
        // console.log(JSON.stringify(response.valueOf().response.headers, null, '  '));
      });
      return chakram.wait().then(() => {
        expect(response.valueOf().body).to.equal('hello gridfs');
      });
    });

  });

  describe('PATCH metadata', () => {
    it('return 200 on patch /api/gridfs/:file_id/metadata&key=filename', () => {
      const response = chakram.patch(`${url}/sample_file2.txt/metadata?fs=input&id=myid&key=filename`, {
        field1: 'hello',
        field2: 'world'
      });

      expect(response).to.have.status(HTTP200);
      // expect(response).to.comprise.json({filename: 'sample_file2.txt'});

      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait().then(() => {
        const {body} = response.valueOf();

        expect(body).to.have.keys([
          'key',
          'update'
        ]);
        expect(body.key).to.have.keys(['filename']);
      });
    });

    it('return 200 on patch /api/gridfs/:file_id/metadata', () => {
      const response = chakram.patch(`${url}/${anId}/metadata?fs=input&id=myid`, {
        field1: 'hello',
        field2: 'world'
      });

      expect(response).to.have.status(HTTP200);
      // expect(response).to.comprise.json({filename: 'sample_file2.txt'});

      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait().then(() => {
        const {body} = response.valueOf();

        expect(body).to.have.keys([
          'key',
          'update'
        ]);
        expect(body.key).to.have.keys(['_id']);
      });
    });

    it('return 400 on patch + empty body /api/gridfs/:file_id/metadata', () => {
      const response = chakram.patch(`${url}/${anId}/metadata?fs=input&id=myid`);

      expect(response).to.have.status(HTTP400);
      expect(response).to.comprise.json({
        statusCode: HTTP400,
        error: 'Bad Request',
        message: 'empty metadata provided',
        data: {
          key: {
            _id: anId
          }
        }
      });

      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait();
    });

    it('return 400 on patch + body not object /api/gridfs/:file_id/metadata', () => {
      const response = chakram.patch(`${url}/${anId}/metadata?fs=input&id=myid`, 'hello');

      expect(response).to.have.status(HTTP400);
      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, []));
      });
      return chakram.wait();
    });

    it('return 404 on patch invalid id /api/gridfs/invalid_id/metadata', () => {
      const response = chakram.patch(`${url}/not_found/metadata?fs=input&id=myid`, {
        field1: 'hello',
        field2: 'world'
      });

      expect(response).to.have.status(HTTP400);
      expect(response).to.comprise.json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
        data: {
          _id: 'not_found'
        }
      });

      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait();
    });
  });

  describe('DELETE SINGLE FILE', () => {
    it('return 400 on DELETE /api/gridfs/:file_id?key=unknown', () => {
      const response = chakram.delete(`${url}/${anId}?fs=input&key=unknown`);

      expect(response).to.have.status(HTTP400);
      expect(response).to.comprise.json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid query parameter key=unknown',
        data: {
          validKeys: [
            'id',
            'filename'
          ]
        }
      });

      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });

    it('return 404 on DELETE /api/gridfs/:file_id & empy keyMetadata', () => {
      const response = chakram.delete(`${url}/${anId}?fs=input`);

      expect(response).to.have.status(HTTP404);
      expect(response).to.comprise.json({
        statusCode: 404,
        error: 'Not Found',
        message: 'file not found',
        data: {
          key: {_id: anId},
          keyMetadata: {metadata: {}}
        }
      });

      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });

    it('return 200 on DELETE /api/gridfs/:file_id', () => {
      const response = chakram.delete(`${url}/${anId}?fs=input&id=myid`);

      expect(response).to.have.status(HTTP200);
      expect(response).to.comprise.json({_id: anId});

      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait();
    });

    it('return 200 on DELETE /api/gridfs/:filename', () => {
      const response = chakram.delete(`${url}/sample_file2.txt?fs=input&id=myid&key=filename`);

      expect(response).to.have.status(HTTP200);
      expect(response).to.comprise.json({filename: 'sample_file2.txt'});

      after(() => {
        // console.log(JSON.stringify(response.valueOf().body, null, '  '));
      });
      return chakram.wait();
    });
  });

  after('stop service', (done) => {
    service.close();
    done();
  });
});
