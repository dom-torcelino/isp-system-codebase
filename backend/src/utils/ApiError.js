/**
 * Custom error class that carries an HTTP status code.
 * Why: Allows controllers and middleware to throw structured errors
 * that the global errorHandler can serialize into proper HTTP responses.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
