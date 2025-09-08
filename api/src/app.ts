import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import authRouter from './routes/authRoute';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { AppError } from './utils/AppError';
const app = express();

// adds body to request
app.use(express.json());

//
app.use(cookieParser());

//
app.use(cors());

// logs requests, Remove during prod.
app.use(morgan('dev'));

// rate-limiter
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1hr
    message: 'Too many requests from the used ip, try again after some time.',
  })
);

// auth flow
app.use('/api/auth', authRouter);

// for all the invalid urls.
app.use(/.*/, (req: Request, _res: Response, next: NextFunction) => {
  next(
    new AppError(`The requested url ${req.originalUrl} doesn't exists`, 404)
  );
});

// global error handler to handle thrown errors
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'failure',
      message: error.message,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error.',
  });
});

export default app;
