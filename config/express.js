import express from 'express';
import swaggerUi from 'gobhash-swagger';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sessionStore from 'session-memory-store';
import compress from 'compression';
import jsyaml from 'js-yaml';
import methodOverride from 'method-override';
import cors from 'cors';
import fs from 'fs';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import ensureLogin from 'connect-ensure-login';

import winstonInstance from './winston';
import routes from '../server/v1/routes/index.route';
import config from './config';
import { passport } from './passport';
import User from '../server/v1/models/user.model';
import APIError from '../server/v1/helpers/APIError';

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync('server/v1/docs/api_docs.yml', 'utf8');
const reactDocs = fs.readFileSync('react_docs/index.html', 'utf8');
const login = fs.readFileSync('server/v1/docs/login.html', 'utf8');
const signup = fs.readFileSync('server/v1/docs/signup.html', 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);
const MemoryStore = sessionStore(session);

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(session({
  secret: config.cookieKey,
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore()
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}
// mount all routes on /api path
app.use('/v1', routes);

// swagger ui config
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc, false, {}, '.swagger-ui .topbar { background-color: rgb(112, 111, 111); }'));

app.get('/login', (req, res) => {
  res.send(login);
});

app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

app.get('/signup', (req, res) => {
  res.send(signup);
});

app.post('/signup', async (req, res) => {
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

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.use(express.static('react_docs/'));
app.use(express.static('server/v1/docs/'));

app.get('/docs', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.send(reactDocs);
});

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});


// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.message,
    stack: config.env === 'development' ? err.stack : {}
  })
);

export default app;
