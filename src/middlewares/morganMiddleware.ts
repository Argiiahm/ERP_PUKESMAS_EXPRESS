import morgan, { type StreamOptions } from 'morgan';
import { logger } from '../utils/logger.js';

// Link Morgan to Winston stream
const stream: StreamOptions = {
    write: (message) => logger.http(message.trim()),
};

// Skip HTTP logging if not in development mode
const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
};

export const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream, skip }
);
