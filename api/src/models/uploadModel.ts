import { pg } from '../db';

/**
 *
 * @param user_id
 * @param fileName
 * @param originalName
 * @returns
 */
export const insertUpload = async (
  user_id: string,
  fileName: string,
  originalName: string
) => {
  const upload = await pg.query(
    `INSERT INTO UPLOADS(user_id, file_name, original_name, status) VALUES($1, $2, $3, $4) RETURNING id`,
    [user_id, fileName, originalName, 'processing']
  );
  return upload.rows[0];
};
