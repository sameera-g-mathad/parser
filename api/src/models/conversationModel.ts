import { pg } from '../db';

/**
 * Method to insert messages into coversation table.
 * @param uploadId - Message created for the uplaodId
 * @param message - Actutal message either from the
 * @param by - Generated message either by 'ai' or 'human'
 */
export const insertConversation = async (
  uploadId: string,
  message: string,
  by: 'human' | 'ai'
): Promise<void> => {
  await pg.query(
    `
        INSERT INTO conversations(upload_id, message, type) VALUES($1, $2, $3);
        `,
    [uploadId, message, by]
  );
};

/**
 * Method to return all the conversations for a particular upload Id.
 * @param uploadId Id of the upload for which all the conversations have to be returned
 * @returns Array of conversations
 */
export const getConversationById = async (uploadId: string): Promise<any> => {
  const conversations = await pg.query(
    `
    SELECT message, type 
    FROM conversations
    WHERE upload_id=$1
    ORDER BY created_at ASC;
    `,
    [uploadId]
  );
  return conversations.rows;
};
