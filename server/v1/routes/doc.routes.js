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

router.use(express.static('react_docs/'));
router.use(express.static('server/v1/docs/'));

// swagger ui config
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc, false, {}, '.swagger-ui .topbar { background-color: rgb(112, 111, 111); }'));

router.get('/login', (req, res) => {
  res.send(login);
});

router.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

router.get('/signup', (req, res) => {
  res.send(signup);
});

router.post('/signup', async (req, res) => {
  try {
    const [hashPassword, hashEmail] = await Promise.all(
      [
        bcrypt.hash(req.body.password, 10),
        bcrypt.hash(req.body.email, 10)
      ]);
    const username = req.body.username;
    const user = await new User({
      username,
      email: hashEmail,
      password: hashPassword
    });
    if (req.body.name !== null && req.body.name !== undefined) {
      user.name = req.body.name;
    }
    if (req.body.token === config.adminToken) {
      user.admin = true;
      await user.save();
      res.redirect('/login');
    }

    return res.redirect('/signup');
  } catch (e) {
    return res.json(e);
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/docs', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.send(reactDocs);
});


export default router;
