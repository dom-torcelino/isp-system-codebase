import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Why: The request must pass through requireAuth before it ever reaches getCurrentUser. 
// If requireAuth fails, the flow stops and getCurrentUser is never executed.
router.get('/me', requireAuth, getCurrentUser);

export default router;