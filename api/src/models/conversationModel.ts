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
  by: 'human' | 'ai',
  pageNumbers?: number[],
  running_context?: string,
): Promise<void> => {
  const result = await pg.query(
    `
        INSERT INTO 
        conversations(upload_id, message, type) 
        VALUES($1, $2, $3)
        RETURNING ID;
        `,
    [uploadId, message, by],
  );

  // upload the running context and page numbers to
  // context table
  if (by === 'ai') {
    const id = result.rows[0].id;
    // set a fix for now.
    if (!running_context) running_context = '';
    if (!pageNumbers) pageNumbers = [];
    await pg.query(
      `
        INSERT INTO context(conversation_id, page_numbers, running_context) VALUES($1, $2, $3);
        `,
      [id, pageNumbers, running_context],
    );
  }
};

/**
 * Method to return all the conversations for a particular upload Id.
 * For conversation #type = ai#, since all the pageNumbers and runningContext
 * is store in `Context` table, left join is used. The reason Left join is
 * used here because #type = human# has no corresponding context row and we
 * still want to retain the human messages.
 * @param uploadId Id of the upload for which all the conversations have to be returned
 * @returns Array of conversations
 */
export const getConversationById = async (uploadId: string): Promise<any> => {
  const conversations = await pg.query(
    `
    SELECT conv.message, conv.type, cont.page_numbers as "pageNumbers", cont.running_context as "runningQuestion"
    FROM conversations AS conv
    LEFT JOIN context As cont
    ON conv.id = cont.conversation_id
    WHERE conv.upload_id=$1
    ORDER BY conv.created_at ASC;
    `,
    [uploadId],
  );
  return conversations.rows;
};
