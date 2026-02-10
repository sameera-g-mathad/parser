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
) => {
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
export const deleteUpload = async (id: string) => {
  await pg.query(`DELETE FROM uploads WHERE id=$1`, [id]);
};

// Create a redis client.
export const redisClient = createClient({
  url: process.env.REDISURL,
});

// Create a redis duplicate to listen to publishing events.
export const redisSub = redisClient.duplicate();
redisSub.connect();
