/**
 * Wraps async Express controllers to automatically catch errors and pass them to the global error handler.
 * Why: Keeps controllers DRY by eliminating repetitive try/catch blocks.
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    // Why: Promise.resolve handles both sync and async functions. 
    // .catch(next) forwards the error directly to errorHandler.middleware.js.
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};