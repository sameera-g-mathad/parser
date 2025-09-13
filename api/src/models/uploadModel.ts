import { pg } from '../db';

/**
 * Inserts a new row into uploads table.
 * @param user_id - Id of the user that uploaded the file. (foriegn key)
 * @param fileName - Filename that got uploaded to s3.
 * @param originalName - Unmodified filename that the user uploaded.
 * @returns
 */
export const insertUpload = async (
  user_id: string,
  fileName: string,
  originalName: string
): Promise<any> => {
  const upload = await pg.query(
    `INSERT INTO UPLOADS(user_id, file_name, original_name, status) VALUES($1, $2, $3, $4) RETURNING id`,
    [user_id, fileName, originalName, 'processing']
  );
  return upload.rows[0];
};
