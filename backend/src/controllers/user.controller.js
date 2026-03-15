// Note: If you created a user.service.js, you should import { getUserById } here instead of calling the Model directly.
import { User } from '../models/user.model.js';

export const getCurrentUser = async (req, res) => {
  try {
    // Why: req.user.sub is the immutable user ID we packed into the JWT during login.
    // .select('-password') explicitly prevents the database from even returning the password field to the Node.js memory.

    if (!req.user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(req.user);
  } catch (error) {
    console.error('[UserController Error]:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};