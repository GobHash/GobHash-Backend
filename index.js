// config should be imported before importing any other file
import polyfill from 'babel-polyfill'; // eslint-disable-line
import pmx from 'pmx';
import config from './config/config';
import app from './config/express';

pmx.init({ http: true }); // enable http keymetris

const debug = require('debug')('express-mongoose-es6-rest-api:index');


// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
  });
}

export default app;
