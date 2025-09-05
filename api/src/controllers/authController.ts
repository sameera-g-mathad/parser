import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { compare, hash } from 'bcryptjs';
import { redisClient } from '../db';
import { insert, selectAll } from './../models/useModel';

const USER_KEY = `user:token`;

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
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, confrimPassword } = req.body;

    // Will handle errors properly.
    if (!password || !email || !confrimPassword) {
      throw Error('Mandatory fields missing');
    }
    // Will handle errors properly.
    if (password !== confrimPassword) {
      throw Error(`Passwords need to match.`);
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
    const key = USER_KEY + verification_id;
    await redisClient.hSet(key, {
      email,
      password: hashPassword,
    });

    // create a duplicate instance for publishing event.
    const redisPub = redisClient.duplicate();
    redisPub.connect(); // connect to instance.

    redisPub.publish('signup', verification_id); // publish the event.
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
  } catch (e) {
    res.status(400).json({
      data: {
        status: 'Failure',
        message: (e as Error).message,
      },
    });
  }
};

// get all users, dummy in place.
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await selectAll();
    res.status(200).json({
      data: {
        status: 'success',
        users: user,
      },
    });
  } catch (e) {
    res.status(400).json({
      data: {
        status: 'Not valid.',
      },
    });
  }
};
