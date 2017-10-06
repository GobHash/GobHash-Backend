import jwt from 'jsonwebtoken';
import config from '../../../config/config';
import User from '../models/user.model';

const debug = true;
const socketConnection = (io) => {
  io.on('connection', (client) => {
    client.on('authenticate', async (data) => {
      try {
        const decoded = jwt.verify(data.token, config.jwtSecret);
        if (decoded !== undefined) {
          client.authenticated = true; // eslint-disable-line
          // join user to a room according to his unique id
          client.join(decoded.id);
          // mark user as online
          const user = await User.get(decoded.id);
          user.online = true;
          await user.save();
        }
      } catch (err) {
        client.authenticated = false; // eslint-disable-line
        client.disconnect(); // force disconnect not authorized client
      }
      if (debug) {
        console.log(client.authenticated); // eslint-disable-line
      }
    });
  });
};

const socketEmitter = (io) => {
  const object = {
    sendToUser(follower, post) {
      io.to(follower.id).volatile.emit('update_feed', post);
    }
  };
  return object;
};

export { socketConnection, socketEmitter };
