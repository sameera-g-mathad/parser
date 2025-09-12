import { Request, Response, NextFunction, CookieOptions } from 'express';
import { randomBytes } from 'crypto';
import { hash, compare } from 'bcryptjs';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { redisClient, redisPub } from '../db';
import {
  insertUser,
  selectAll,
  userExists,
  searchUser,
  updateUserPassword,
  findById,
} from '../models/useModel';
import { AppError, catchAsync } from '../utils';

const SIGN_UP_VERIFICATION_KEY = `user:token:`;
const FORGOT_VERIFICATION_KEY = 'user:email:';

// get secret, expires and cookieExpires from env vars.
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const JWT_EXPIRES = process.env.JWT_EXPIRES!;
const JWT_COOKIE_EXPIRES = process.env.JWT_COOKIE_EXPIRES!;

// Copied from frontend under /auth/hookes/useValidation.ts
const emailRegex =
  /^[0-9a-zA-Z]+(\.?[0-9a-zA-Z+_])*@[0-9a-zA-Z]+\.(com|dev|edu|org|net)$/;

const passwordRegex = /^((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{15,30}$/;

// funtion to check if email is valid
const isEmailValid = (email: string): boolean => {
  return emailRegex.test(email);
};

// funtion to check if password is valid
const isPasswordValid = (password: string): boolean => {
  return passwordRegex.test(password);
};

/**
 * A wrapper to generate a random string using randomBytes funtion.
 * @param size Defualt = 64. Size of the bytes to be generated.
 * @returns string
 */
const getRandomId = (size: number = 64): string => {
  return randomBytes(size).toString('hex');
};

/**
 * A wrapper to encrypt the plain password.
 * @param password Regular password entered by the user.
 * @param saltLength Salt length to create a new password.
 * @returns Encrypted password
 */
const hashPassword = async (
  password: string,
  saltLength: number = 11
): Promise<string> => {
  return await hash(password, saltLength);
};

/**
 * Function to return redisKeys. Can be done in
 * a single line, but added here for consistency
 * @param entity Entity being stored, ex: user
 * @param key key being stored, ex: email
 * @param value value being stored, ex: test@test.com
 * @example user:email:test@test.com
 * @returns A redis key.
 */
const redisKey = (entity: string, key: string, value: string): string => {
  return `${entity}:${key}:${value}`;
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

    const emailKey = redisKey('user', 'signUp', email);
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
    const hashedPassword = await hashPassword(password);

    // Create a random url to be sent to user for
    // verification.
    const verification_id = getRandomId();

    // Store the verification id in redis, will be used
    // later for storing user info.
    // Pattern: user:token:<token>: {email, password: encrypted.}
    const USER_KEY = SIGN_UP_VERIFICATION_KEY + verification_id;
    await redisClient.hSet(USER_KEY, {
      firstName,
      lastName,
      email,
      password: hashedPassword,
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

/**
 * This methodis used to verify and create the user.
 * A unique url is sent to the user during signup.
 * when the user clicks the url, this method is invoked.
 * Checks if the url is valid, has been expired and
 * finally creates the user in the database.
 */
export const verifyAndCreateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the unique url.
    const { id } = req.params;
    // 1. Check if the id/token is present in redis db.
    // If expired, then user did not click within allowed
    // limit.
    const user = await redisClient.hGetAll(SIGN_UP_VERIFICATION_KEY + id);
    if (Object.keys(user).length === 0) {
      return next(
        new AppError(
          'Verification link is invalid or has expired. Please sign up again.',
          401
        )
      );
    }
    // get user details.
    const { firstName, lastName, email, password } = user;
    // 2. Check if the user already exists. If so return
    // error.
    if (await userExists(email))
      return next(
        new AppError(
          'An account with this email already exists. Please log in instead.',
          400
        )
      );

    // 3. Create the user in the db and return the response.
    const newUser = await insertUser(firstName, lastName, email, password);
    res.status(201).json({
      status: 'success',
      message:
        'Your account has been created successfully. Please log in to continue.',
    });
  }
);

/**
 * SignIn the user. First the email and password
 * fields are validated. Later a jwt token is created
 * and is stored in the response cookie. Finally, response
 * is sent back to user.
 */
export const userSignIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. check if both email and password are present.
    if (!email || !password)
      return next(new AppError('Mandatory fields missing', 400));

    // 2. directly check the db for the user with email.
    // this is because if the user even enters a wrong email
    // or an invalid email, it won't be present in the db.
    // Also check the password and send a common message so
    // the attacker wouldn't know whether the email or password
    // was wrong.
    const user = await searchUser(email);
    if (user === undefined || !(await compare(password, user.password)))
      return next(new AppError('Invalid email or password', 400));

    // Check if any one is invalid/undefined.
    if (
      JWT_SECRET_KEY === undefined ||
      JWT_EXPIRES === undefined ||
      JWT_COOKIE_EXPIRES === undefined
    )
      return next(new AppError('Internal Server Error', 500));

    // Sign the token with user id.
    const token = sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES as any,
    });

    // Set up cookie options such as expiry date,
    // where js can access or how can it be accessed (secure: (true/false) i.e https/http)
    let jwtCookieExpires = parseInt(JWT_COOKIE_EXPIRES);
    const cookieOptions: CookieOptions = {
      expires: new Date(Date.now() + jwtCookieExpires * 24 * 60 * 60 * 1000),
      httpOnly: true, // cannot be accesed by js.
      // secure: true, // this means the cookie can be sent over https connections only.
    };
    res.cookie('jwt', `Bearer ${token}`, cookieOptions);

    res.status(200).json({
      status: 'success',
      message: 'Logged In Succesfully!!',
    });
  }
);

/**
 * Method used to request a link to reset the password.
 * Checks if the email is valid, user exists, and if the
 * request itself is valid, i.e the user is requesting more emails
 * even after sending one. Creates a random token and sends it to
 * the user email via worker. the link is valid for 5 mins after which
 * the link will be expired. The user email is also stored for 3 mins
 * to prevent user from requesting more emails.
 */
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Only email is needed.
    const { email } = req.body;
    // 1. Valid email check
    if (!email || !isEmailValid(email))
      return next(
        new AppError(
          'Please enter a valid email address (e.g., user@example.com).',
          400
        )
      );
    // 2. Check if the user actually exisits.
    const user = await searchUser(email);
    if (user === undefined)
      return next(
        new AppError(
          'We couldn’t find an account with that email. Please sign up to get started',
          401
        )
      );

    // create a email key to check redis db.
    const emailKey = redisKey('user', 'forgotPassword', email);

    // This is to make sure, user doesn't requests emails
    // over and over again.
    const stored_email = await redisClient.get(emailKey);

    // 3. Check if the user has already requested an reset email.
    if (stored_email !== null)
      return next(
        new AppError(
          'A reset email has already been sent to this address. Please check your inbox and verify your email before requesting again.',
          400
        )
      );

    // generate a random id for reset link.
    const verification_id = getRandomId();

    // create the token
    const token = FORGOT_VERIFICATION_KEY + verification_id;

    /*
     * Store relevant info in redis.
     * email - Recipient to send email to.
     * password - Needed to check if the user is
     * entering the old password instead of a different
     * one.
     * firstName, lastName - For email template.
     */
    await redisClient.hSet(token, {
      email,
      password: user.password,
      firstName: user.firstname,
      lastName: user.lastname,
    });

    // publish token for worker to pickup.
    await redisPub.publish('forgotPassword', token);
    // the token/hash has 5mins to expire.
    await redisClient.expire(token, 300);

    // store and set expire to user emails.
    // Needed for check 3, above.
    await redisClient.set(emailKey, '1');
    await redisClient.expire(emailKey, 150);

    // finally send a successful response.
    res.status(200).json({
      status: 'success',
      message:
        'A reset email has been sent. Please check your inbox to reset your password.',
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

/**
 * This method is used to check if the link used by the user
 * to reset password is valid or not. If not then send a unauthorized
 * response. If the url is valid, send a success response.
 */
export const validateResetLink = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the id from the url
    const { id } = req.params;

    // check if the user reset link is still active. If not
    // return a unauthorized error.
    const user = await redisClient.hGetAll(FORGOT_VERIFICATION_KEY + id);
    if (Object.keys(user).length === 0) {
      return next(
        new AppError(
          'This password reset link is invalid or has expired. Please request a new one.',
          401
        )
      );
    }

    // Return succesfull response.
    res.status(200).json({
      status: 'success',
      message:
        'This reset link is active. Please continue to update your password.',
    });
  }
);

/**
 * This method is used to reset the password of the user
 * if the link they use is valid. Firstly the link is checked
 * if it is active or not. If the user is present, if the password
 * is valid or if the passwords matches. Also tests if the user new
 * password is same as the current password. Finally the password
 * is updated.
 */
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // 1. check if the user reset link is still active. If not
    // return a unauthorized error.
    const token = FORGOT_VERIFICATION_KEY + id;
    const user = await redisClient.hGetAll(FORGOT_VERIFICATION_KEY + id);
    if (Object.keys(user).length === 0) {
      return next(
        new AppError(
          'Verification link is invalid or has expired. Please sign up again.',
          401
        )
      );
    }

    // 2. check if the user already exists.
    if (!(await userExists(user.email)))
      return next(new AppError("Account doesn't exists.", 401));

    const { password, confirmPassword } = req.body;

    // 3. Mandatory fields check
    if (!password || !confirmPassword) {
      return next(new AppError('Mandatory fields missing', 400));
    }

    // 4. check regex for password
    if (!isPasswordValid(password))
      return next(
        new AppError(
          'Password is invalid. It must be 15-30 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
          400
        )
      );

    // 5. Password match check
    if (password !== confirmPassword) {
      return next(
        new AppError(
          'Passwords do not match. Please make sure both fields are identical.',
          400
        )
      );
    }

    // 6. Check if the old password is equal to new password.
    const passwordMatch = await compare(password, user.password);
    if (passwordMatch) {
      return next(
        new AppError('New password cannot be same as old password.', 400)
      );
    }

    // 7. create a new password.
    const newPassword = await hashPassword(password);

    // 8. Update the user table.
    await updateUserPassword(user.email, newPassword);

    // 9. Return a success response
    res.status(200).json({
      status: 'success',
      message: 'Password is reset. Please continue to login.',
    });
  }
);

/**
 * Method to signout users. If a key 'jwt' is
 * present in cookie than it will be cleared and
 * the user will be logged out.
 */
export const userSignOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // If cookie has no jwt, return error.
    if (!req.cookies.jwt) {
      next(new AppError('You are not logged in.', 400));
    }
    // assumes the cookie is in jwt
    res.clearCookie('jwt');
    res.status(200).json({
      status: 'success',
      message: 'You have been logged out successfully.',
    });
  }
);

/**
 * Protect access to all routes, i.e if the user is loggedIn,
 * then the user can access protected routes. This method checks the
 * same. It starts by checking if the cookie has jwt, and if so,
 * it is decoded to get the user_id back and the user is retrieved
 * for the id, if user exists, then the jwt expiry date is checked with
 * current date, and if this works, the password changed time is compared
 * with the issued date. If all of this fail, then the user will
 * be blocked from using the protected routes.
 */
// a sma
// interface RequestWithUser extends Request{
//   user: object;
// }

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const jwt = req.cookies.jwt;

    // 1. If no jwt, unauthorized.
    if (!jwt)
      return next(
        new AppError('You must be logged in to access this resource.', 401)
      );

    const token = jwt.split(' ')[1]; // will always be 'Bearer <token>'

    // 2. check for decoded payload
    let payload: JwtPayload;
    try {
      payload = verify(token, JWT_SECRET_KEY) as JwtPayload;
    } catch (err) {
      return next(
        new AppError('Invalid or expired token. Please log in again.', 401)
      );
    }

    const { id, iat, exp } = payload;

    // 3. If the payload has incomplete data, the jwt is invalid.
    if (!id || !iat || !exp)
      return next(
        new AppError('Invalid token payload. Please log in again', 400)
      );

    // find a user by id.
    const user = await findById(id);

    // 4. If there is no user or user deleted their account,
    // then block access.
    if (user === undefined || user.length === 0) {
      res.clearCookie('jwt');
      return next(new AppError('User no longer exists.', 404));
    }

    const passwordChangedAt = new Date(user.pct).getTime() / 1000;
    const now = Date.now() / 1000;

    // 5. Check for token expire time.
    if (now > exp) {
      return next(
        new AppError('Your session has expired. Please log in again.', 401)
      );
    }

    // 6. Check if the user changed password after password
    // was issued.
    if (passwordChangedAt > iat) {
      return next(
        new AppError('Password was recently changed. Please log in again.', 401)
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
    }; // adding user to the request.
    next();
  }
);
