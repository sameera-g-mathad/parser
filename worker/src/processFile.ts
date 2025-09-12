import { redisClient, redisSub, updateUploads } from './db';
import { readFileSync } from 'fs';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Document } from '@langchain/core/documents';

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
 * Read file from /shared volume uploaded by api
 * @param path filepath to where the file is stored.
 * @returns Contents read in buffer format.
 */
const readPdf = (path: string): NonSharedBuffer => {
  const content = readFileSync(path);
  return content;
};

/**
 *
 * @param fileName Filename to store in s3.
 * @param path Path of the file uploaded in the volume
 * @param mimetype the contentType to be used by s3
 * @returns A boolean status whether the upload was sucess or not.
 */
const uploadToS3 = async (
  fileName: string,
  path: string,
  mimetype: string
): Promise<boolean> => {
  // read file
  const body = readPdf(path);

  // create a put object command with necessary info
  const putCommandOptions: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Body: body,
    ContentType: mimetype,
  };
  // try to upload the file
  try {
    await s3.send(new PutObjectCommand(putCommandOptions));
  } catch (error) {
    // send upload false back.
    console.log(error);
    return false;
  }
  return true;
};

redisSub.subscribe('processFile', async (channel, message) => {
  try {
    // get required info from the redis client
    const { fileName, path, mimetype } = await redisClient.hGetAll(channel);
    const id = channel.split(':')[1];
    // 1. Try to upload file to s3.
    const s3Status = await uploadToS3(fileName, path, mimetype);

    // 2. if the upload was a fail stop the process
    // and update the uploads table.
    if (!s3Status) {
      updateUploads(id, 'failed');
      throw Error('Upload to s3 failed.');
    }
    // 3. Need to embed text.

    // Finally update the row as active
    // for usage.
    updateUploads(id, 'active');
  } catch (error) {
    console.log((error as Error).message);
  }
});
