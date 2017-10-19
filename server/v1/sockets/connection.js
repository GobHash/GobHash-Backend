import jwt from 'jsonwebtoken';
import config from '../../../config/config';
import User from '../models/user.model';

const debug = true;
var clients = {}; //eslint-disable-line
const socketConnection = (io) => {
  io.on('connection', (client) => {

    client.on('authenticate', async (data) => {
      try {
        const decoded = jwt.verify(data.token, config.jwtSecret);
        if (decoded !== undefined) {
          client.authenticated = true; // eslint-disable-line
          // join user to a room according to his unique id
          client.join(decoded.id);
          clients[decoded.id] = client;
          client.id = decoded.id;
          // mark user as online
          const user = await User.get(decoded.id);
          user.online = true;
          await user.save();
          client.emit('authenticated', { auth: true });
        } else {
          client.emit('authenticated', { auth: false });
        }
      } catch (err) {
        client.emit('authenticated', { auth: false });
        client.authenticated = false; // eslint-disable-line
        client.disconnect(); // force disconnect not authorized client
      }
    });
    client.on('disconnect', async () => {
      try {
        const user = await User.get(client.id);
        user.online = false;
        await user.save();
        client.disconnect();
      } catch (e) {
        client.authenticated = false; // eslint-disable-line
        client.disconnect();
      }
    });
  });
  return io;
};

const socketEmitter = (io) => {
  const object = {
    sendToUser(follower, post) {

      console.log('sendingg', follower._id);
      io.to(follower._id).emit('update_feed', post);

    }
  };
  return object;
};

export { socketConnection, socketEmitter };
