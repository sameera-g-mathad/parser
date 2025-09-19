import { NextFunction, Request, response, Response } from 'express';
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { conversationalRetrievelQA, stream } from '../utils/langchainConfig';
import {
  getUploadById,
  insertUpload,
  selectUploads,
} from '../models/uploadModel';
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
 * This method is to get the uploads
 * from the database and return it back
 * to the users.
 */
export const getUploads = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the user id from the request.
    const user_id = req.user.id;

    // get all uploads.
    const uploads = await selectUploads(user_id);

    res.status(200).json({
      status: 'success',
      message: 'Succesfull',
      uploads,
    });
  }
);

/**
 * Method to get the url from the s3 bucket
 * to serve the user. Id is needed.
 */
export const getUploadPdfUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. get the id from the url
    const { id } = req.params;

    // 2. Find an upload if present.
    const upload = await getUploadById(id);

    // 3. if there is no upload or the id was deleted
    // return back.
    if (upload === undefined) {
      return next(new AppError('No file exists', 400));
    }

    const filename = upload.file_name;

    // s3 command options.
    const getOptions: GetObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET!,
      Key: filename,
    };

    // 4. Get the url with getSignedUrl.
    const url = await getSignedUrl(s3, new GetObjectCommand(getOptions), {
      expiresIn: 300,
    });

    // 5. Return the success response.
    res.status(200).json({
      status: 'success',
      message: 'successful',
      url,
    });
  }
);

/**
 * Method to stream response from llm to the frontend.
 * A single question is taken and converted into a statndalone
 * question along with the chat history using langchain.
 * This question is later sent to the llm along with the context.
 */
export const requestLLM = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get query from the user.
    const { query } = req.body;
    // get id from url.
    const { id } = req.params;

    // retreive context and standalone data.
    const response = await conversationalRetrievelQA.invoke({
      question: query,
      chatHistory: [], // will implement this.
      uploadId: id,
    });

    // stream response to the user. Sending
    // of response is handled inside. The message
    // is stored to store in the db.
    const aiMessage = await stream(res, response.output);

    // This part is to return the pages from
    // which the contents were taken.

    // Use of set to avoid duplicates
    const uniquePageNumbers = new Set();
    // using an empty array to maintain order.
    const pageNumbers = [];
    const context: any = response.output.context;

    // add page numbers into the array.
    for (let i = 0; i < context.length; i++) {
      const page = context[i].page_number;
      if (!uniquePageNumbers.has(page)) {
        pageNumbers.push(page);
        uniquePageNumbers.add(page);
      }
    }

    // creating an object, since streams
    // need strings and this object is sent in
    // the same stream, tokens are sent.
    const pageResponse = {
      event: 'pageNumber',
      pageNumbers,
    };

    // Write the pageNumbers,
    res.write(JSON.stringify(pageResponse) + '\n'); // \n is important if there are multiple objects.
    // end the stream.
    res.end();
  }
);
