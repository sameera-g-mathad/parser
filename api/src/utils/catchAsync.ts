import { Request, Response, NextFunction } from 'express';

export const catchAsync = (callback: (...args: any) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
};
