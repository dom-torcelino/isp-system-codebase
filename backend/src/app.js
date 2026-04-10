import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// Why: Initialize Sentry early so it can instrument Express and capture errors across all middleware/routes.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
  });
}

// Why: Trust the first proxy in front of Express. This ensures req.ip represents the real client.
// CRITICAL: Only enable this if your backend is actually deployed behind a proxy (e.g., Heroku, AWS, Nginx).
app.set('trust proxy', 1);

// Why: Helmet sets security-related HTTP headers (X-Content-Type-Options, Strict-Transport-Security, etc.).
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Required if we move to HttpOnly cookies later
}));

// Why: Parses incoming JSON payloads so req.body is accessible in controllers.
app.use(express.json());

// Why: Mount the modular routers. This keeps the main app file clean as you scale to 30+ modules.
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/enterprises', enterpriseRoutes);

// Why: Handle requests to endpoints that don't exist before they hit the error handler.
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error down to the errorHandler
});

// Why: Mount the error handler last. Express routes errors down the middleware chain until it hits a 4-argument function.
app.use(errorHandler);

export default app;