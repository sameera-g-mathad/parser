import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { hash } from 'bcryptjs';
import { redisClient, redisPub } from '../db';
import { insert, selectAll } from '../models/useModel';
import { AppError, catchAsync } from '../utils';

const key = `user:token`;

/**
 * The creteUser method validates user input, such as
 * (email, password and confirmPassword) and stores the
 * information in a redis hash Set with `5mins` expiration time.
 * This is because the emails are not validated, rather a email
 * verification will be sent before registering the user. Since
 * this is a side project, I decided to go forward with this.
 * Also, sending email is off-loaded to the worker instance
 * by publishing a `signup` event.
 */
export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Will handle errors properly.
    if (!password || !email || !confirmPassword) {
      return next(new AppError('Mandatory fields missing', 404));
    }
    // Will handle errors properly.
    if (password !== confirmPassword) {
      return next(new AppError('Passwords need to match.', 404));
    }

    // Convert the password into a hash to store
    // encrypted version.
    const hashPassword = await hash(password, 11);

    // Create a random url to be sent to user for
    // verification.
    const verification_id = randomBytes(64).toString('hex');

    // Store the verification id in redis, will be used
    // later for storing user info.
    // Pattern: user:token:<token>: {email, password: encrypted.}
    const USER_KEY = key + verification_id;
    await redisClient.hSet(USER_KEY, {
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    redisPub.publish('signup', USER_KEY); // publish the event.
    // Note verification id will be used to send the verification link to user.

    await redisClient.expire(key, 300); // 5mins for the user to verify email.

    // return success, i.e email will be sent to the user.
    // No user creation, only after user verification.
    res.status(201).json({
      data: {
        status: 'success',
        data: {
          status: 'success',
          message: 'Please check',
        },
      },
    });
  }
);

// get all users, dummy in place.
export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await selectAll();
    if (!user) return next(new AppError('No users found', 400));
    res.status(200).json({
      data: {
        status: 'success',
        users: user,
      },
    });
  }
);
