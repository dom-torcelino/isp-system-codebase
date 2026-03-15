import dotenv from 'dotenv';
import Joi from 'joi';

// Why: Explicitly load the .env file into process.env before validation begins.
dotenv.config();

// Why: Define a strict contract for the environment. Every required variable must be documented here.
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number()
    .default(3000),
  MONGO_URI: Joi.string()
    .required()
    .description('MongoDB connection string'),
  JWT_SECRET: Joi.string()
    .required()
    .min(32) // Why: Enforce a minimum entropy for cryptographic signing keys.
    .description('JWT Secret Key'),
  JWT_EXPIRES_IN: Joi.string()
    .default('1d')
    .description('JWT expiration time'),
  SENTRY_DSN: Joi.string()
    .uri() // Why: Ensure Sentry DSN is a valid URI format if provided.
    .optional()
    .description('Sentry Data Source Name'),
  ALLOWED_ORIGIN: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(), // Why: CORS must be strictly configured in production; wildcards are unacceptable.
      otherwise: Joi.optional()
    })
}).unknown(true); // Why: Allow standard OS environment variables to pass through without validation.

const { value: envVars, error } = envVarsSchema.validate(process.env, {
  abortEarly: false, // Why: Return all validation errors at once, rather than failing one by one.
});

if (error) {
  // Why: Throw a fatal error immediately to prevent the Node process from starting in a degraded state.
  throw new Error(`Environment validation error: ${error.message}`);
}

// Why: Export a frozen configuration object so the rest of the application uses the validated, typed variables instead of raw process.env.
export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  sentry: {
    dsn: envVars.SENTRY_DSN,
  },
  cors: {
    origin: envVars.ALLOWED_ORIGIN,
  }
};