import { readFileSync, unlinkSync } from 'fs';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
} from '@aws-sdk/client-s3';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
// import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import {
  redisClient,
  redisSub,
  pg,
  updateUploads,
  deleteUpload,
  getUserUploads,
  deleteUser,
} from './db';
import { CustomPgVector } from './CustomVectorDB';
import { getTemplate } from './templates/getTemplate';
import { sendEmail } from './transporter';

// create a s3 client with the
// region and credentials.
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

// type used to delete uploads from s3.
type S3DelteFile = { file_name: string };

const openAIEmbeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.Open_Api_Key!,
});

// Create a text splitter once for now.
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkOverlap: 100,
  chunkSize: 512,
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
 * Delete file from /shared volume uploaded by api
 * @param path filepath to where the file is stored.
 * @returns void
 */
const deletePdf = (path: string): void => {
  unlinkSync(path);
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
  mimetype: string,
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

/**
 * Delete the uplaoded file from s3 if
 * upload to s3 -> create embeddings -> send success email
 * fails.
 */
const deleteFromS3Single = async (fileName: string): Promise<void> => {
  // create a put object command with necessary info
  const deleteCommandOptionsSingle: DeleteObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
  };
  // try to delete the file
  try {
    await s3.send(new DeleteObjectCommand(deleteCommandOptionsSingle));
  } catch (error) {
    // send upload false back.
    console.log(error);
    return;
  }
};

/**
 * Delete all uplaoded files from s3 if
 * the user wants to delete their account.
 * Different methods are used due to different
 * classes s3 offers to how files are deleted
 *
 * @param files - Array of objects returned by postgres
 * database with `file_name` property.
 */
const deleteFromS3Bulk = async (files: S3DelteFile[]): Promise<boolean> => {
  // create a put object command with necessary info
  const deleteCommandOptionsBulk: DeleteObjectsCommandInput = {
    Bucket: process.env.AWS_BUCKET,
    Delete: {
      Objects: files.map((file) => ({
        Key: file.file_name,
      })),
      Quiet: true,
    },
  };
  // try to delte the files
  try {
    await s3.send(new DeleteObjectsCommand(deleteCommandOptionsBulk));
    return true;
  } catch (error) {
    // send upload false back.
    console.log(error);
    return false;
  }
};

/**
 * @param path Path of the file uploaded in the volume
 * @param upload_id Upload id stored in the uploads table
 * @returns Promise<boolean>, that returns whether the embedding process
 * was a success or not.
 */
const createEmbeddings = async (
  path: string,
  uploadId: string,
): Promise<boolean> => {
  try {
    // 1. Load the pdf using a PdfLoader
    const loader = new PDFLoader(path, { splitPages: true }); // split pages for page number
    const fileContent = await loader.load();

    // 2. Create chunks using RecursiveTextSplitter
    // chunk_size = 512 # Non modifiable.
    // chunk_overlap = 100 # Non modifiable.
    const docs = await textSplitter.splitDocuments(fileContent);

    // 3. store upload_id in docs as this will help while
    // searching only that document.
    for (let doc of docs) {
      // this is to make sure that upload_id matches
      // the schema, since upload_id is the foreign key
      // of type uuid and not object.
      const pageNumber = doc.metadata.loc.pageNumber;
      doc.metadata = { pageNumber, uploadId };
    }

    // 4. Use Custom created class to create embeddings.
    await CustomPgVector.fromDocuments(docs, openAIEmbeddings, {
      pool: pg,
      tableName: 'documents',
      columns: {
        idColumnName: 'id',
        contentColumnName: 'content',
        vectorColumnName: 'embeddings',
        metadataColumnName: 'upload_id',
      },
    });
    // finally return true stating the
    // process was a success.
    return true;
  } catch (error) {
    // return false indicating fail
    return false;
  }
};

redisSub.subscribe('processFile', async (channel, _message) => {
  const { fileName, path, mimetype, email, firstName, lastName, originalName } =
    await redisClient.hGetAll(channel);
  // get required info from the redis client
  const id = channel.split(':')[1];
  // original name to send it to users.
  try {
    // 1. Try to upload file to s3.
    const s3Status = await uploadToS3(fileName, path, mimetype);

    // // 2. if the upload was a fail stop the process
    // and update the uploads table.
    if (!s3Status) {
      updateUploads(id, 'failed');
      throw Error('Upload to s3 failed.');
    }
    // 3. Need to embed text.
    const embStatus = await createEmbeddings(path, id);
    if (!embStatus) {
      updateUploads(id, 'failed');
      throw Error('Embedding creation failed.');
    }
    // 4. Finally update the row as active
    // for usage.
    updateUploads(id, 'active');

    // 5. Send a succesfull email to the user.
    const template = await getTemplate(
      firstName,
      lastName,
      'Your PDF has been processed!',
      `Good news 🎉 Your uploaded PDF [${originalName}] was processed successfully and is now available in your dashboard.`,
      `${process.env.WEB_URL}/app/dashboard`,
      'Go to Dashboard',
      '#2dd4bf',
    );
    sendEmail(email, template, 'Your PDF was processed successfully ✅');
  } catch (error) {
    // 1. Send failed mail to the user.
    console.log(error);
    const template = await getTemplate(
      firstName,
      lastName,
      'There was an issue with your upload',
      `Unfortunately, we couldn’t process your uploaded PDF [${originalName}]. Please try again with a valid file format or check that the file is not corrupted.`,
      `${process.env.WEB_URL}/app/dashboard`,
      'Go to Dashboard',
      '#f87171',
    );
    sendEmail(email, template, 'We couldn’t process your PDF ❌');
    // 2. Delete the upload id as it failed.
    deleteUpload(id);

    // 3. Delete the uploads from s3 if uploaded previously.
    deleteFromS3Single(fileName);
  } finally {
    //  Unlink the file from shared volume mount
    deletePdf(path);
  }
});

// Listen to Delete User requests.
// Adding here as I need to delete all the files
// in S3.
redisSub.subscribe('deleteUser', async (channel, _message) => {
  try {
    // get the user id from the channel.
    const data = await redisClient.hGetAll(channel);
    if (Object.keys(data).length > 0) {
      const { id, email, firstName, lastName } = data;

      // 1. Get all the upload filenames to delete from s3.
      const fileNames = await getUserUploads(id);

      const s3Status = await deleteFromS3Bulk(fileNames);
      if (!s3Status) {
        updateUploads(id, 'failed');
        throw Error('Delete from from s3 failed.');
      }

      // 2. Delete user from user table.
      await deleteUser(id);

      // 3. Send them a good bye email.
      const template = await getTemplate(
        firstName,
        lastName,
        'Your account has been deleted.',
        ` Thank you for trying Parser.Your demo account, along with all associated files and conversations, 
        has now been permanently deleted from the system.
        I truly appreciate you taking the time to explore Parser. 
        I hope you found it useful, and I’d love to see you again in the future.`,
        `${process.env.WEB_URL}`,
        'Try Parser',
        '#818cf8',
      );

      sendEmail(email!, template, 'Your Parser account has been deleted 👋');
    } else {
      console.log('Error: No data in redis for the key associated.');
    }
  } catch (error) {
    // logging error for now.
    console.log(error);
  }
});
