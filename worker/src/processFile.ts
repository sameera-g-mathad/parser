import { redisClient, redisSub, pg, updateUploads } from './db';
import { readFileSync, unlinkSync } from 'fs';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
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

/**
 * @param path Path of the file uploaded in the volume
 * @param upload_id Upload id stored in the uploads table
 * @returns Promise<boolean>, that returns whether the embedding process
 * was a success or not.
 */
const createEmbeddings = async (
  path: string,
  upload_id: string
): Promise<boolean> => {
  try {
    // 1. Load the pdf using a PdfLoader
    const loader = new PDFLoader(path, { splitPages: false });
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
      (doc.metadata as unknown as string) = upload_id;
    }

    // 4. Use PgVectorStore to create embeddings.
    // Note: Can create own class to store, create and retrieve
    // embeddings using pgvector with regular postgres,
    //  I am doing this since this project was to learn
    // langchain.
    await PGVectorStore.fromDocuments(docs, openAIEmbeddings, {
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
      throw Error('Upload to s3 failed.');
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
      'http://localhost:3050/app/dashboard',
      'Go to Dashboard',
      '#2dd4bf'
    );
    sendEmail(email, template, 'Your PDF was processed successfully ✅');
  } catch (error) {
    // Send failed mail to the user.
    const template = await getTemplate(
      firstName,
      lastName,
      'There was an issue with your upload',
      `Unfortunately, we couldn’t process your uploaded PDF [${originalName}]. Please try again with a valid file format or check that the file is not corrupted.`,
      'http://localhost:3050/app/dashboard',
      'Go to Dashboard',
      '#f87171'
    );
    sendEmail(email, template, 'We couldn’t process your PDF ❌');
  } finally {
    //  Unlink the file from shared volume mount
    deletePdf(path);
  }
});
