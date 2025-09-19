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

/**
 * to fetch a row given upload id.
 * @param upload_id - Primary key of the upload table.
 * @returns A row corresponding to the id.
 */
export const getUploadById = async (upload_id: string): Promise<any> => {
  const upload = await pg.query(`SELECT * FROM UPLOADS WHERE id=$1`, [
    upload_id,
  ]);
  return upload.rows[0];
};

/**
 * Returns the uploads of the user.
 * @param user_id User Id to return all of their uploded pdfs.
 * @param searchQuery Name of the file typed by the user.
 * @returns 10 recent uploads of the users.
 */
export const selectUploads = async (user_id: string, searchQuery?: string) => {
  const uploads = await pg.query(
    `
    SELECT id, original_name, status, updated_at, created_at
    FROM uploads
    WHERE user_id = $1 AND status <> 'failed' AND original_name ILIKE $2
    ORDER BY updated_at DESC
    OFFSET 0
    LIMIT 10
    `,
    [user_id, `%${searchQuery}%`]
  );
  return uploads.rows;
};
