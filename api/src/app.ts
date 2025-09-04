import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

const app = express();

//
app.use(cookieParser());

//
app.use(cors());

export default app;
