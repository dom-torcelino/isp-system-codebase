import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Why: Prevent accidental duplication if the script is run twice.
    const exists = await User.findOne({ email: 'super@fiberfast.com' });
    if (exists) {
      console.log('SuperAdmin already exists.');
      process.exit(0);
    }

    await User.create({
      name: 'Global Super Admin',
      email: 'super@fiberfast.com',
      password: process.env.SUPERADMIN_PASSWORD || 'SuperSecret123!',
      role: 'SuperAdmin',
      tenant: 'System', // Why: SuperAdmins transcend standard tenants.
      isEmailVerified: true,
    });

    console.log('✅ SuperAdmin seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();