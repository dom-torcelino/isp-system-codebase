import express from 'express';
// import { getTenants, deleteTenant } from '../controllers/tenant.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAccess } from '../middlewares/authorization.middleware.js';

const router = express.Router();

// Why: ALL tenant routes require authentication.
router.use(requireAuth); 

// Why: Requires 'readonly' (or higher) access to the 'tenants' module.
// SystemAdmin will be blocked here.
router.get('/', requireAccess('tenants', 'readonly') /*, getTenants */);

// Why: Requires 'full' access to the 'tenants' module.
// Only SuperAdmin can pass this point.
router.delete('/:id', requireAccess('tenants', 'full') /*, deleteTenant */);

export default router;