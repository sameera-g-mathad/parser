import { pg } from './index';
import {
  PGVectorStore,
  PGVectorStoreArgs,
} from '@langchain/community/vectorstores/pgvector';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { Callbacks } from '@langchain/core/callbacks/manager';
import { DocumentInterface } from '@langchain/core/documents';

/**
 * Custom class to retrieve documents from the database for now.
 * This is because of the 'DOCUMENTS' schema in postgres database
 * that stores uploadId not as metadata but as a foreign key, this
 * class handles through a custom pg query.
 */
export class CustomPgVector extends PGVectorStore {
  constructor(embeddings: EmbeddingsInterface, dbConfig: PGVectorStoreArgs) {
    super(embeddings, dbConfig);
  }

  async similaritySearch(
    query: string,
    k?: number,
    filter?: this['FilterType'] | undefined,
    _callbacks?: Callbacks | undefined
  ): Promise<DocumentInterface[]> {
    // 1.  embed the requested query and convert it into a vector.
    const queryEmbeddings = await this.embeddings.embedQuery(query);
    const vectorLiteral = `[${queryEmbeddings.join(',')}]`;

    // 2. Get uploadId.
    const uploadId = filter?.uploadId ?? null;

    const params = uploadId ? [vectorLiteral, k, uploadId] : [vectorLiteral, k];

    // 3. Query the results.
    const rows = await pg.query(
      `
      SELECT id, content, embeddings <=> $1 AS similarity
      FROM documents
      WHERE upload_id = $3 ::uuid
      ORDER BY similarity ASC
      LIMIT $2
      `,
      params
    );

    return rows.rows;
  }
}
