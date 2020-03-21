const Joi = require('joi');

require('dotenv').config();

// Define validation for all the environment variables
const envVarsSchema = Joi.object({
  MONGO_CONNECTION_STRING: Joi.string().required(),
  NODE_CONFIG_ENV: Joi.string()
    .allow(['dev', 'qa', 'uat', 'prod'])
    .default('dev'),
  PORT: Joi.number().default(7600)
})
  .unknown()
  .required();

const { error, value: env } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  MongoDbConnectionString: env.MONGO_CONNECTION_STRING,
  env: env.NODE_CONFIG_ENV.trim(),
  logPrefix: `country-finder-service :: ${env.NODE_CONFIG_ENV} :: `,
  port: env.PORT,
};

module.exports = config;
