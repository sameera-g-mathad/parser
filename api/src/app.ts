import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRouter from './routes/authRoute';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
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

//
app.use('/api/auth', authRouter);

export default app;
