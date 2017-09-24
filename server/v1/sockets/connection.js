import socket from 'socket.io';
import express from 'express';
import jwt from 'jsonwebtoken';
import http from 'http';
import config from '../../../config/config';

const port = 4004;
const app = express();
const server = http.createServer(app);
const io = socket.listen(server);
const debug = true;
server.listen(port);

io.on('connection', (client) => {
  client.on('authenticate', (data) => {
    try {
      const decoded = jwt.verify(data.token, config.jwtSecret);
      if (decoded !== undefined) {
        client.authenticated = true; // eslint-disable-line
      }
    } catch (err) {
      client.authenticated = false; // eslint-disable-line
      client.disconnect(); // force disconnect not authorized client
    }
    if (debug) {
      console.log(client.authenticated); // eslint-disable-line
    }
  });
  client.on('update_dashboard', () => {
    // get last valid post

  });
});
