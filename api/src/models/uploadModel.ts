import { pg } from '../db';

/**
 * Inserts a new row into uploads table.
 * @param userId - Id of the user that uploaded the file. (foriegn key)
 * @param fileName - Filename that got uploaded to s3.
 * @param originalName - Unmodified filename that the user uploaded.
 * @returns
 */
export const insertUpload = async (
  userId: string,
  fileName: string,
  originalName: string
): Promise<any> => {
  const upload = await pg.query(
    `INSERT INTO UPLOADS(user_id, file_name, original_name, status) VALUES($1, $2, $3, $4) RETURNING id`,
    [userId, fileName, originalName, 'processing']
  );
  return upload.rows[0];
};

/**
 * to fetch a row given upload id.
 * @param uploadId - Primary key of the upload table.
 * @returns A row corresponding to the id.
 */
export const getUploadById = async (uploadId: string): Promise<any> => {
  const upload = await pg.query(
    `SELECT * 
    FROM UPLOADS WHERE id=$1`,
    [uploadId]
  );
  return upload.rows[0];
};

/**
 * Method to return the stats of the uploads.
 * @param uploadId Upload id for which stats needs to be returned.
 * @returns Returns the total count, active and processing counts
 */
export const getStatsById = async (uploadId: string): Promise<any> => {
  const stats = await pg.query(
    `SELECT 
      COALESCE(COUNT(*),0) AS count, 
      COALESCE(SUM(CASE WHEN status='active' THEN 1 ELSE 0 END),0) as active, 
      COALESCE(SUM(CASE WHEN status='processing' THEN 1 ELSE 0 END),0) as processing
    FROM UPLOADS 
    WHERE user_id=$1
`,
    [uploadId]
  );
  return stats.rows[0];
};

/**
 * Returns the uploads of the user.
 * @param user_id User Id to return all of their uploded pdfs.
 * @param searchQuery Name of the file typed by the user.
 * @returns 10 recent uploads of the users.
 */
export const selectUploads = async (userId: string, searchQuery?: string) => {
  const uploads = await pg.query(
    `
    SELECT id, original_name, status, updated_at, created_at
    FROM uploads
    WHERE user_id = $1 AND status <> 'failed' AND original_name ILIKE $2
    ORDER BY updated_at DESC
    OFFSET 0
    LIMIT 10
    `,
    [userId, `%${searchQuery}%`]
  );
  return uploads.rows;
};

/**
 * Method to return the total number of uploads a user has.
 * @param userId Id of the user to get count of uploads
 */
export const countUploadsbyUserId = async (userId: string) => {
  const count = await pg.query(
    `
    SELECT COUNT(*) AS count 
    FROM uploads 
    WHERE user_id=$1
    `,
    [userId]
  );
  return count.rows[0];
};

/**
 *
 * @param uploadId Primary key of the uploads table to delete
 * the upload.
 * @returns
 */
export const deleteUploadById = async (uploadId: string) => {
  return await pg.query(
    `
    DELETE FROM uploads WHERE id=$1
    `,
    [uploadId]
  );
};
