import { RBAC_MATRIX } from '../config/rbac.js';

/**
 * Enforces RBAC on API routes based on the module and required access level.
 * @param {string} moduleName - The module being accessed (e.g., 'tenants', 'billing').
 * @param {'readonly' | 'full'} requiredAccess - Minimum access level required.
 */
export const requireAccess = (moduleName, requiredAccess = 'readonly') => {
  return (req, res, next) => {
    // Why: req.user must be populated by auth.middleware.js before this runs.
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'Unauthorized: User role missing.' });
    }

    const currentAccessLevel = RBAC_MATRIX[userRole]?.[moduleName] || 'none';

    // Why: Instantly drop the request if the role has absolutely no access to the module.
    if (currentAccessLevel === 'none') {
      return res.status(403).json({ 
        message: `Forbidden: ${userRole} does not have access to ${moduleName}.` 
      });
    }

    // Why: Prevent a 'readonly' user (like a Technician) from executing a 'full' action (like deleting a ticket).
    if (requiredAccess === 'full' && currentAccessLevel !== 'full') {
      return res.status(403).json({ 
        message: `Forbidden: Action requires full access to ${moduleName}.` 
      });
    }

    next();
  };
};