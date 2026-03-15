import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 8080;

// Why: Separate the Express 'app' from the physical 'server'. 
// This allows you to easily import the 'app' into testing frameworks (like Jest) without accidentally opening network ports during tests.
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Why: Ensure the database is fully connected BEFORE accepting any incoming HTTP traffic.
    await connectDB(); 

    server.listen(PORT, () => {
      console.log(`[SERVER] 🚀 API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('[SERVER] ❌ Failed to start:', error);
    process.exit(1);
  }
};

startServer();