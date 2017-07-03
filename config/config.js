import Joi from 'joi';
// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(3000),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  DB_URI: Joi.string().required()
    .description('SQL DB full uri'),
  MONGODB_URI: Joi.string().required()
    .description('Mongo DB URI'),
  MAILGUN_KEY: Joi.string().required()
    .description('Mail Gun Secret Key')
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  sqlDebug: envVars.SQL_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  dbUri: envVars.DB_URI,
  mailgun_key: envVars.MAILGUN_KEY,
  s3_key: envVars.AWS_S3_KEY,
  s3_secret: envVars.AWS_S3_SECRET,
  mongoUri: envVars.MONGODB_URI
};

export default config;
