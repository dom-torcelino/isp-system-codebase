import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { loginLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Why: Explicitly defining the method (POST) prevents attackers from probing the endpoint with GET or PUT requests.
// Note: In production, import and attach a rate-limiter middleware here (e.g., express-rate-limit) before the 'login' controller.
router.post('/login', loginLimiter ,login);

// Why: If you decide to add a password reset flow later, the routes would go here.
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

export default router;