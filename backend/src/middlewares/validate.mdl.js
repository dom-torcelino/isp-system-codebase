import Joi from 'joi';
import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware factory to validate request data against a Joi schema.
 * @param {Object} schema - Object containing Joi schemas for 'body', 'query', or 'params'.
 * @returns {Function} Express middleware function.
 */
export const validate = (schema) => (req, res, next) => {
  // Why: Dynamically extract only the parts of the request that the schema expects to validate.
  const validSchema = Object.keys(schema).reduce((acc, key) => {
    if (['params', 'query', 'body'].includes(key)) {
      acc[key] = schema[key];
    }
    return acc;
  }, {});

  const objectToValidate = Object.keys(validSchema).reduce((acc, key) => {
    acc[key] = req[key];
    return acc;
  }, {});

  // Why: Compile the schema map into a single Joi object for comprehensive validation.
  const joiSchema = Joi.object(validSchema);
  
  const { value, error } = joiSchema.validate(objectToValidate, {
    abortEarly: false, // Why: Return all validation errors to the client at once, rather than one at a time.
    stripUnknown: true, // Why: Crucial for security. Silently drops any keys not explicitly defined in the schema.
    allowUnknown: false, // Why: Fails the validation if unknown keys are present in top-level definitions.
  });

  if (error) {
    // Why: Map Joi's complex error array into a clean, comma-separated string for the ApiError message.
    const errorMessage = error.details.map((details) => details.message).join(', ');
    
    // Why: Throw a 400 Bad Request. The global error handler will catch this and send it to the client.
    return next(new ApiError(400, errorMessage));
  }

  // Why: Overwrite the Express request properties with the sanitized, type-coerced data from Joi.
  // This ensures controllers never process raw, untrusted input.
  Object.assign(req, value);
  return next();
};