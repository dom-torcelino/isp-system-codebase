import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const VALID_ROLES = ['SuperAdmin', 'SystemAdmin', 'Support', 'Technician'];
const BCRYPT_SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: VALID_ROLES, default: 'Technician' },
  tenant: { type: String, required: true, default: 'FiberFast ISP' },
  isEmailVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Why: Modern Mongoose automatically proceeds when an async function resolves. Do not use 'next' callbacks inside async hooks.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
});

// Why: Attach the cryptographic comparison logic directly to the Document instance.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Why: Intercept JSON serialization to permanently strip sensitive fields before they leave the model layer.
// This guarantees the password hash is never accidentally sent to the React frontend.
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);