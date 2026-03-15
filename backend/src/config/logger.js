import winston from 'winston';
import { config } from './env.js';

// Why: Native Error objects lose their stack trace when stringified or passed to Winston. This interceptor ensures the stack is preserved in the log output.
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger = winston.createLogger({
  // Why: Set verbosity based on environment. 'debug' helps trace local issues, while 'info' reduces noise and I/O overhead in production.
  level: config.env === 'development' ? 'debug' : 'info',
  
  format: winston.format.combine(
    enumerateErrorFormat(),
    // Why: Use structured JSON in production for machine readability. Use formatted text in development for human readability.
    config.env === 'production' ? winston.format.uncolorize() : winston.format.colorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  
  transports: [
    new winston.transports.Console({
      // Why: Ensure OS-level tools and Docker correctly flag these as error streams.
      stderrLevels: ['error'],
    }),
    
    // Why: Persistent file logging with built-in rotation to prevent disk exhaustion. 
    // Note: In a strict 12-Factor App deployed to Kubernetes, file transports are often removed entirely in favor of stdout/stderr aggregation.
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // Why: Rotate after 5MB.
      maxFiles: 5,      // Why: Keep only the 5 most recent rotated files.
    }),
    
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});