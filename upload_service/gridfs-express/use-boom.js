const boom = require('boom');

try {
  throw Error('invalid password');
} catch (error) {
  const bError = boom.badImplementation(error.message, {error});

  console.log(JSON.stringify(bError));
}
