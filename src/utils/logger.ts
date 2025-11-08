import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'logs');

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const ERROR_LOG_FILE = path.join(LOGS_DIR, 'error.log');
const API_LOG_FILE = path.join(LOGS_DIR, 'api.log');

function getTimestamp(): string {
  return new Date().toISOString();
}

function formatLogEntry(level: string, message: string, data?: any): string {
  const timestamp = getTimestamp();
  const dataString = data ? ` | Data: ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataString}\n`;
}

function writeToFile(filePath: string, content: string): void {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
    }
    
    fs.appendFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error('Failed to write to log file:', error);
    console.error('Log content:', content);
  }
}

export const errorLogger = {
  error(message: string, error?: Error | unknown, metadata?: Record<string, any>): void {
    const errorData: any = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...metadata,
    };
    
    const logEntry = formatLogEntry('ERROR', message, errorData);
    writeToFile(ERROR_LOG_FILE, logEntry);
    
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${message}`, errorData);
    }
  },

  warn(message: string, metadata?: Record<string, any>): void {
    const logEntry = formatLogEntry('WARN', message, metadata);
    writeToFile(ERROR_LOG_FILE, logEntry);
    
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WARN] ${message}`, metadata);
    }
  },
};

export const apiLogger = {
  request(
    method: string,
    path: string,
    operationName?: string | null,
    userId?: string | null,
    metadata?: Record<string, any>
  ): void {
    const logData = {
      method,
      path,
      operationName,
      userId,
      ...metadata,
    };
    
    const logEntry = formatLogEntry('REQUEST', `${method} ${path}`, logData);
    writeToFile(API_LOG_FILE, logEntry);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API REQUEST] ${method} ${path}`, logData);
    }
  },

  response(
    method: string,
    path: string,
    statusCode: number,
    operationName?: string | null,
    duration?: number,
    metadata?: Record<string, any>
  ): void {
    const logData = {
      method,
      path,
      statusCode,
      operationName,
      duration: duration ? `${duration}ms` : undefined,
      ...metadata,
    };
    
    const logEntry = formatLogEntry('RESPONSE', `${method} ${path} - ${statusCode}`, logData);
    writeToFile(API_LOG_FILE, logEntry);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API RESPONSE] ${method} ${path} - ${statusCode}`, logData);
    }
  },

  graphql(
    operationName: string | null,
    operationType: 'query' | 'mutation' | 'subscription',
    userId?: string | null,
    duration?: number,
    errors?: any[]
  ): void {
    const logData = {
      operationName,
      operationType,
      userId,
      duration: duration ? `${duration}ms` : undefined,
      hasErrors: errors && errors.length > 0,
      errorCount: errors?.length || 0,
    };
    
    const logEntry = formatLogEntry(
      'GRAPHQL',
      `${operationType.toUpperCase()} ${operationName || 'Anonymous'}`,
      logData
    );
    writeToFile(API_LOG_FILE, logEntry);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[GRAPHQL] ${operationType.toUpperCase()} ${operationName || 'Anonymous'}`, logData);
    }
  },

  info(message: string, metadata?: Record<string, any>): void {
    const logEntry = formatLogEntry('INFO', message, metadata);
    writeToFile(API_LOG_FILE, logEntry);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API INFO] ${message}`, metadata);
    }
  },
};

export const logger = {
  error: errorLogger.error,
  warn: errorLogger.warn,
  api: apiLogger,
};

