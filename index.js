// config should be imported before importing any other file
import newrelic from 'newrelic';       // eslint-disable-line
import polyfill from 'babel-polyfill'; // eslint-disable-line
import mongoose from 'mongoose';
import pmx from 'pmx';                 // eslint-disable-line
import Sequelize from 'sequelize';
import http from 'http';
import socket from 'socket.io';
import redis from 'socket.io-redis';
import { socketConnection, socketEmitter } from './server/v1/sockets/connection';

pmx.init({ http: true }); // eslint-disable-line enable http keymetris
import config from './config/config';  // eslint-disable-line
import app from './config/express';    // eslint-disable-line

const server = http.createServer(app);
const io = socket.listen(server);
io.adapter(redis(config.redisURL));
const debug = require('debug')('express-mongoose-es6-rest-api:index');

const connectedIO = socketConnection(io);
export const emmiter = socketEmitter(connectedIO);

mongoose.connect(config.mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.Promise = global.Promise; // Tell mongoose to use es6 promises
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});
// Or you can simply use a connection uri
const sequelize = new Sequelize(config.dbUri);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.'); // eslint-disable-line
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err); // eslint-disable-line
  });
// Conection to database where is save the GuateCompras data
const sequelizeWidgets = new Sequelize(config.dbUriG); // eslint-disable-line
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection two has been established successfully. GuateCompras'); // eslint-disable-line
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err); // eslint-disable-line
  });

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  server.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
  });
}

export default app;
