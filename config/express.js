import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import logger from 'morgan';
import httpStatus from 'http-status';
import helmet from 'helmet';
import methodOverride from 'method-override';
import session from 'express-session';
import redisStore from 'connect-redis';


import APIError from '../server/v1/helpers/APIError';
import config from './config';
import docRoutes from '../server/v1/routes/doc.routes';
import routes from '../server/v1/routes/index.route';
import { passport } from './passport';
import winstonInstance from './winston';

const RedisSession = redisStore(session);
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
  proxy: true,
  store: new RedisSession({
    url: config.redisURL
  })
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
app.use('/', docRoutes);


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
