import { NextFunction, Request, Response } from 'express';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { insertUpload } from '../models/uploadModel';
import { AppError, catchAsync } from '../utils';
import { redisPub } from '../db';

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
 * Method to upload files into s3 bucket and start the
 * embedding process. Max size allowed is 50Mb.
 */
export const uploadFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the file name.
    const file = req.file;

    // 1. If there is no file, return error.
    if (!file) {
      return next(new AppError('No file uploaded. Please attach a file.', 400));
    }

    // Set the filename, used format: <user_id>_<current_date>_<filename>.
    const fileName = `${req.user.id}_${Date.now()}_${file.originalname}`;

    // base bucket configuration.
    const bucketOptions: PutObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET!,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // upload file to aws s3.
    // try the process, to know if s3 thows error
    // or was it a success.
    try {
      const putCommand = new PutObjectCommand(bucketOptions);
      await s3.send(putCommand);
    } catch (error) {
      // 3. Throw error if the file upload to s3 failed.
      return next(
        new AppError('Something went wrong while uploading your file.', 500)
      );
    }

    // Insert the filename into uploads table
    const upload = await insertUpload(req.user.id, fileName);

    // upload_key format to publish event: upload:<unique_id_in_db>:<filename>
    const upload_key = `upload:${upload.id}:${fileName}`;

    // publish the event for redis to pick up.
    await redisPub.publish('processFile', upload_key);

    // return a succesful response.
    res.status(200).json({
      status: 'success',
      message:
        'File uploaded successfully. Embeddings generation in progress. Access will be granted once processing is complete.',
    });
  }
);
