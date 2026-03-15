import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const requireAuth = async (req, res, next) => {
  let token;

  // Why: Adhere to the HTTP specification for Bearer token transmission.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  try {
    // Why: Cryptographically verify the token has not been tampered with and hasn't expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Why: Execute a live database lookup to guarantee the user's role and status are current.
    // This bridges the gap between stateless JWTs and stateful RBAC requirements.
    const currentUser = await User.findById(decoded.sub).select('-password');

    if (!currentUser) {
      return res.status(401).json({ message: 'Not authorized. User account no longer exists.' });
    }

    // Why: Attach the live, fully-hydrated Mongoose document to the request.
    // The authorization.middleware.js will now read the exact, up-to-the-second req.user.role.
    req.user = currentUser;

    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    // Why: Catch JWT-specific errors (TokenExpiredError, JsonWebTokenError) without crashing the server.
    return res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
  }
};