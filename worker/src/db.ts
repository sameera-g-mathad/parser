import { createClient } from 'redis';
import { Pool } from 'pg';

// Create a pg db
export const pg = new Pool({
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT!),
});

/**
 * Method to update the row of the uplaods table.
 * @param id Id of the upload record
 * @param status Status can be either 'active' or 'failed', since the row
 * will be set to 'processing' from the very start.
 */
export const updateUploads = async (
  id: string,
  status: 'active' | 'failed',
): Promise<void> => {
  await pg.query(
    `UPDATE uploads SET status=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$1`,
    [id, status],
  );
};

/**
 * Method to delete the uplaod record if for any reason
 * embedding or uploading to s3 fails.
 * This automatically deletes embeddings if any exist.
 * @param id Id of the upload record
 */
export const deleteUpload = async (id: string): Promise<void> => {
  await pg.query(`DELETE FROM uploads WHERE id=$1`, [id]);
};

/**
 * Method to get all the filenames from user uploads
 * to delete them from s3.
 * @param id Id of the user to get uploads.
 */
export const getUserUploads = async (
  id: string,
): Promise<{ file_name: string }[]> => {
  const result = await pg.query(
    `SELECT file_name FROM uploads WHERE user_id=$1`,
    [id],
  );
  return result.rows;
};

/**
 * Method to delete the user from the database.
 * This is done when the user requests to delete
 * their account.
 * @param id Id of the user to be deleted.
 */
export const deleteUser = async (id: string): Promise<void> => {
  await pg.query(`DELETE FROM users WHERE id=$1`, [id]);
};

// Create a redis client.
export const redisClient = createClient({
  url: process.env.REDISURL,
});

// Create a redis duplicate to listen to publishing events.
export const redisSub = redisClient.duplicate();
redisSub.connect();
