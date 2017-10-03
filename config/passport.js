import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../server/v1/models/user.model';

const Strategy = passportLocal.Strategy;

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  async (username, password, cb) => {
    try {
      const user = await User.findOne({ username: username.toLowerCase() });
      const valid = await bcrypt.compare(password, user.password);
      if (valid === true && user.admin === true) {
        return cb(null, user);
      }
      return cb(null, false);
    } catch (e) {
      return cb(null, false);
    }
  }
));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.get(id);
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
});

export { passport }; //eslint-disable-line
