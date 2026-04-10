export const errorHandler = (err, req, res, next) => {
  // Why: Use the error's own statusCode (e.g., from ApiError) if available, otherwise fall back to the response status.
  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message;

  // Why: Catch MongoDB bad ObjectIDs. If a user tries to GET /api/users/123, Mongoose throws a CastError.
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found. Invalid ID format.';
  }

  // Why: Catch Mongoose schema validation errors (e.g., missing required fields) and return a 400 Bad Request.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Why: Extract and join all the specific validation failure messages into a single string for the frontend UI.
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Why: Catch MongoDB duplicate key errors (e.g., trying to register an email that already exists).
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered. Please use a different value.';
  }

  // Why: Log the raw error to the server console for debugging, regardless of environment.
  console.error(`[Global Error] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    message,
    // Why: Only expose the exact file/line number crash data if the server is running in development mode.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};