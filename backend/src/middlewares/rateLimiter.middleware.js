import rateLimit from 'express-rate-limit';

// Why: Export specific limiters so you can apply different rules to different routes (e.g., APIs get 100/min, Logins get 5/15min).
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { 
    message: 'Too many login attempts from this IP, please try again after 15 minutes.' 
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});