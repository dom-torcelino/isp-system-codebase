import mongoose from 'mongoose';

// Why: Export the connection function to be awaited in server.js before starting the HTTP listener.
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  // Why: Fail fast. Prevent the application from starting in an unstable state.
  if (!mongoURI) {
    console.error('[DB] ❌ FATAL ERROR: MONGO_URI is not defined in the environment variables.');
    process.exit(1); 
  }

  try {
    // Why: Execute the initial connection. Mongoose 6+ applies optimal default settings automatically.
    const conn = await mongoose.connect(mongoURI);
    console.log(`[DB] ✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] ❌ Initial Connection Failed: ${error.message}`);
    process.exit(1); 
  }
};

// Why: Attach global listeners to the connection object to monitor health after the initial boot.
mongoose.connection.on('disconnected', () => {
  console.warn('[DB] ⚠️ MongoDB connection lost. Mongoose will attempt to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('[DB] 🔄 MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (error) => {
  // Why: Log runtime database errors (e.g., authentication failures during reconnect) without crashing the active server.
  console.error('[DB] ❌ MongoDB runtime error:', error);
});