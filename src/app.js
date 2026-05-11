import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import AppError from './utils/appError.js';
import globalErrorHandler from './middlewares/errorMiddleware.js';
import healthRouter from './routes/healthRoutes.js';
import cardRouter from './routes/cardRoutes.js';
import authRouter from './routes/authRoutes.js';
import readingRouter from './routes/readingRoutes.js';
import { setupSwagger } from './config/swagger.js';

const app = express();

// Set security HTTP headers
// Note: helmet might block swagger UI CSS/JS if not configured properly, 
// but for development it's usually fine.
app.use(helmet());

// Setup Swagger
setupSwagger(app);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization could be added here (e.g., mongoSanitize, xss)

// Implement CORS
app.use(cors());

// 2) ROUTES
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/cards', cardRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/readings', readingRouter);

// Handle unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 3) ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
