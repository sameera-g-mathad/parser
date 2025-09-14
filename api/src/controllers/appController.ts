import { NextFunction, Request, Response } from 'express';
import { S3Client } from '@aws-sdk/client-s3';
import { insertUpload, selectUploads } from '../models/uploadModel';
import { AppError, catchAsync } from '../utils';
import { redisClient, redisPub } from '../db';

// create a s3 client with the
// region and credentials.
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

/**
 * @returns A response that the user is logged In along with user
 * info. Errors are thrown by the protect controller. Check authController
 * for more detail.
 */
export const getMe = catchAsync(async (req: Request, res: Response) => {
  // this retrieves only the email, firstName, and lastName
  // to send back to frontend or use it any where needed.
  const { email, firstName, lastName } = req.user;
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
 * Method to upload a record to uploads table with
 * filename and status as processing. Later publish
 * the event to worker. File is uploaded by multer.
 */
export const uploadFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the file name.
    const file = req.file;

    // 1. If there is no file, return error.
    if (!file) {
      return next(new AppError('No file uploaded. Please attach a file.', 400));
    }

    // get user details for sending email.
    const { email, firstName, lastName } = req.user;

    // Set the filename, used format: <user_id>_<current_date>_<filename>.
    const fileName = file.filename;
    const path = file.path;

    // Insert the filename into uploads table
    const upload = await insertUpload(
      req.user.id,
      fileName,
      req.file?.originalname!
    );

    // upload_key format to publish event: upload:<unique_id_in_db>
    const upload_key = `upload:${upload.id}`;

    // store all the details of a file in redis hash
    await redisClient.hSet(upload_key, {
      fileName,
      path,
      mimetype: file.mimetype,
      email,
      firstName,
      lastName,
      originalName: req.file?.originalname!,
    });

    // Expire the key if the worker doesn't pick
    // it up.
    await redisClient.expire(upload_key, 300);

    // publish the event for redis to pick up.
    await redisPub.publish('processFile', upload_key);

    // return a succesful response.
    res.status(200).json({
      status: 'success',
      message:
        'Your request has been received and is being processed. You will be notified once it is complete.',
    });
  }
);

/**
 *
 */
export const getUploads = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user.id;

    const uploads = await selectUploads(user_id);

    res.status(200).json({
      status: 'success',
      message: 'Succesfull',
      uploads,
    });
  }
);
