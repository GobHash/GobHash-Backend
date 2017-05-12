import Joi from 'joi';
import fs from 'fs';
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
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const certPrivate = fs.readFileSync('privateKey.pem', 'utf8');
const certPublic = fs.readFileSync('publicKey.pub', 'utf8');

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecretPrivate: certPrivate,
  jwtSecretPublic: certPublic,
  dbUri: envVars.DB_URI,
};

export default config;
