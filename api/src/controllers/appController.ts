import { NextFunction, Request, Response } from 'express';
import { AppError, catchAsync } from '../utils';

/**
 * @returns A response that the user is logged In along with user
 * info. Errors are thrown by the protect controller. Check authController
 * for more detail.
 */
export const getMe = catchAsync(async (req: Request, res: Response) => {
  // this retrieves only the email, firstName, and lastName
  // to send back to frontend or use it any where needed.
  const { email, firstName, lastName } = (req as Request & any).user;
  res.status(200).json({
    status: 'success',
    user: {
      email,
      firstName,
      lastName,
    },
    message: 'Authenticated!!',
  });
});

/**
 * @returns A response after receiving the file succesfully.
 * ---- Need to implement.
 */
export const uploadFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    return next(new AppError('Something went wrong', 400));
  }
);
