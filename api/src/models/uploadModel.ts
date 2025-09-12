import { pg } from '../db';

export const insertUpload = async (user_id: string, fileName: string) => {
  const upload = await pg.query(
    `INSERT INTO UPLOADS(user_id, file_name, status) VALUES($1, $2, $3) RETURNING id`,
    [user_id, fileName, 'processing']
  );
  return upload.rows[0];
};
