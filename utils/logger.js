import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Create log entry
const createLogEntry = (level, message, meta = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
};

// Write to log file
const writeToFile = (filename, logEntry) => {
  const logPath = path.join(logsDir, filename);
  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFileSync(logPath, logLine);
};

// Logger object
export const logger = {
  error: (message, meta = {}) => {
    const logEntry = createLogEntry(LOG_LEVELS.ERROR, message, meta);
    console.error(logEntry);
    writeToFile('error.log', logEntry);
  },

  warn: (message, meta = {}) => {
    const logEntry = createLogEntry(LOG_LEVELS.WARN, message, meta);
    console.warn(logEntry);
    writeToFile('app.log', logEntry);
  },

  info: (message, meta = {}) => {
    const logEntry = createLogEntry(LOG_LEVELS.INFO, message, meta);
    console.log(logEntry);
    writeToFile('app.log', logEntry);
  },

  debug: (message, meta = {}) => {
    const logEntry = createLogEntry(LOG_LEVELS.DEBUG, message, meta);
    console.debug(logEntry);
    writeToFile('debug.log', logEntry);
  }
};

// Request logger middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.url} - ${res.statusCode}`, logData);
    } else {
      logger.info(`${req.method} ${req.url} - ${res.statusCode}`, logData);
    }
  });

  next();
};
