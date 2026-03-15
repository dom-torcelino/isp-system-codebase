import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Why: Reject malformed requests immediately before consuming database connection pool resources.
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  // Why: Fetch the user document. Mongoose will include the hashed password field automatically unless explicitly excluded in the schema.
  const user = await User.findOne({ email });

  // Why: Use the custom instance method attached to the Mongoose schema to encapsulate the bcrypt logic.
  // The user check must happen first to prevent calling comparePassword on a null object.
  const isMatch = user && (await user.comparePassword(password));

  if (!isMatch) {
    // Why: Use a generic error. Never specify "User not found" or "Incorrect password".
    res.status(401);
    throw new Error('Invalid credentials.');
  }

  // Why: Sign the JWT using the secure environment secret.
  // 'sub' (Subject) is the industry standard claim for the user identifier.
  const token = jwt.sign(
    { sub: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // Why: Return the token and the user object. 
  // The userSchema's toJSON transform automatically strips the 'password' and '__v' fields here before it hits the network.
  res.status(200).json({
    token,
    user,
  });
});