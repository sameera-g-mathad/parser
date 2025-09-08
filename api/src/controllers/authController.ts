import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { hash } from 'bcryptjs';
import { redisClient, redisPub } from '../db';
import { insert, selectAll, userExists } from '../models/useModel';
import { AppError, catchAsync } from '../utils';

const SIGN_UP_VERIFICATION_KEY = `user:token:`;

// Copied from frontend under /auth/hookes/useValidation.ts
const emailRegex =
  /^[0-9a-zA-Z]+(\.?[0-9a-zA-Z+_])*@[0-9a-zA-Z]+\.(com|dev|edu|org|net)$/;
const passwordRegex = /^((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{15,30}$/;

// method to check if email is valid
const isEmailValid = (email: string): boolean => {
  return emailRegex.test(email);
};

// method to check if password is valid
const isPasswordValid = (password: string): boolean => {
  return passwordRegex.test(password);
};

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
export const createUserRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Mandatory fields check
    if (!firstName || !lastName || !password || !email || !confirmPassword) {
      return next(new AppError('Mandatory fields missing', 400));
    }
    // Valid email check
    if (!isEmailValid(email))
      return next(
        new AppError(
          'Email is invalid. It should be like user@example.com and end with .com, .dev, .edu, .org, or .net',
          400
        )
      );

    // check if the user already exists.
    if (await userExists(email))
      return next(
        new AppError(
          'An account with this email already exists. Please log in instead.',
          400
        )
      );

    // check regex for password
    if (!isPasswordValid(password))
      return next(
        new AppError(
          'Password is invalid. It must be 15-30 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
          400
        )
      );

    // Password match check
    if (password !== confirmPassword) {
      return next(
        new AppError(
          'Passwords do not match. Please make sure both fields are identical.',
          400
        )
      );
    }

    const emailKey = `user:${email}`;
    // check if email is present, so that user doesn't request signup many times.
    if (await redisClient.get(emailKey))
      return next(
        new AppError(
          'A verification email has already been sent to this address. Please check your inbox and verify your email before requesting again.',
          400
        )
      );

    // Convert the password into a hash to store
    // encrypted version.
    const hashPassword = await hash(password, 11);

    // Create a random url to be sent to user for
    // verification.
    const verification_id = randomBytes(64).toString('hex');

    // Store the verification id in redis, will be used
    // later for storing user info.
    // Pattern: user:token:<token>: {email, password: encrypted.}
    const USER_KEY = SIGN_UP_VERIFICATION_KEY + verification_id;
    await redisClient.hSet(USER_KEY, {
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    redisPub.publish('signup', USER_KEY); // publish the event.
    // Note verification id will be used to send the verification link to user.

    await redisClient.expire(USER_KEY, 300); // 5mins for the user to verify email.

    // set the user variable so that subsequent clicks are prevented.
    await redisClient.set(emailKey, '1');

    // expire email after 2.5 mins after which user can request verification link again.
    await redisClient.expire(emailKey, 150);

    // return success, i.e email will be sent to the user.
    // No user creation, only after user verification.

    res.status(201).json({
      status: 'success',
      message:
        'A verification email has been sent. Please check your inbox to complete registration.',
    });
  }
);

export const verifyAndCreateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await redisClient.hGetAll(SIGN_UP_VERIFICATION_KEY + id);
    if (Object.keys(user).length === 0) {
      return next(
        new AppError(
          'Verification link is invalid or has expired. Please sign up again.',
          400
        )
      );
    }
    const { firstName, lastName, email, password } = user;
    if (await userExists(email))
      return next(
        new AppError(
          'An account with this email already exists. Please log in instead.',
          400
        )
      );

    const newUser = await insert(firstName, lastName, email, password);
    res.status(201).json({
      status: 'success',
      message:
        'Your account has been created successfully. Please log in to continue.',
    });
  }
);
// get all users, dummy in place.
export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await selectAll();
    if (!user) return next(new AppError('No users found', 400));
    res.status(200).json({
      status: 'success',
      users: user,
    });
  }
);
