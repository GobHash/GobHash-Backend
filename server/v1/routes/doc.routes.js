import bcrypt from 'bcryptjs';
import ensureLogin from 'connect-ensure-login';
import express from 'express';
import fs from 'fs';
import jsyaml from 'js-yaml';
import swaggerUi from 'gobhash-swagger';


import { passport } from '../../../config/passport';
import config from '../../../config/config';
import User from '../models/user.model';

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync('server/v1/docs/api_docs.yml', 'utf8');
const reactDocs = fs.readFileSync('react_docs/index.html', 'utf8');
const login = fs.readFileSync('server/v1/docs/login.html', 'utf8');
const signup = fs.readFileSync('server/v1/docs/signup.html', 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

const router = express.Router(); // eslint-disable-line new-cap


// swagger ui config
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc, false, {}, '.swagger-ui .topbar { background-color: rgb(112, 111, 111); }'));
// GET Login HTML page
router.get('/login', (req, res) => {
  res.send(login);
});

// POST login, authenticate
router.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

// GET signup
router.get('/signup', (req, res) => {
  res.send(signup);
});

// POST signup, create admin user
router.post('/signup', async (req, res) => {
  try {
    // hash email and password async
    const [hashPassword, hashEmail] = await Promise.all(
      [
        bcrypt.hash(req.body.password, 10),
        bcrypt.hash(req.body.email, 10)
      ]);
    const username = req.body.username;
    // create new user
    const user = await new User({
      username,
      email: hashEmail,
      password: hashPassword
    });
    if (req.body.name !== null && req.body.name !== undefined) {
      user.name = req.body.name;
    }
    // verify admin token
    if (req.body.token === config.adminToken) {
      user.admin = true; // make user an admin
      await user.save();
      // login automatically the new user
      req.login(user, () => {});
      // send request to api docs
      return res.redirect('/');
    }
    // if not valid admin token
    return res.redirect('/signup');
  } catch (e) {
    return res.redirect('/signup');
  }
});

// logout user
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// load static files
router.use(express.static('react_docs/'));
router.use(express.static('server/v1/docs/'));

// route for react based docs
router.get('/docs', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.send(reactDocs);
});


export default router;
