import { Request, Response, NextFunction } from 'express';

/**
 * A general method to handle errors properly.
 * @param callback Function that needs to be wrapped in try/catch.
 * @returns Method wrapped.
 */
export const catchAsync = (callback: (...args: any) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
};
