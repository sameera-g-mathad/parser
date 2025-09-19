// adding a duplicate here from api, instead of
// having a common file.
import {
  PGVectorStore,
  PGVectorStoreArgs,
} from '@langchain/community/vectorstores/pgvector';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { Callbacks } from '@langchain/core/callbacks/manager';
import { Document, DocumentInterface } from '@langchain/core/documents';

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

  /**
   * Custom method to add vectors and
   * embeddings into the databae. This method is
   * created because documents is dependent on upload
   * id and will be easy to delete embeddings if they are
   * referenced by upload_id. Also, storing pageNumber to direct
   * users to particular page from where the contents was taken from.
   *
   */
  async addVectors(
    vectors: number[][],
    documents: Document[],
    options?: { ids?: string[] }
  ): Promise<void> {
    // loop through every docuemnt and store the values.
    for (let i = 0; i < documents.length; i++) {
      const pageContent = documents[i].pageContent;
      const vector = vectors[i];
      const uploadId = documents[i].metadata['uploadId'];
      const pageNumber = documents[i].metadata['pageNumber'];

      await this.pool.query(
        `
          INSERT INTO documents(upload_id, page_number, content, embeddings)
          VALUES($1::uuid, $2, $3, $4);
        `,
        [uploadId, pageNumber, pageContent, `[${vector.join(',')}]`]
      );
    }
  }

  /**
   * Need to override this, as this method
   * calls the PGVector internally that throws
   * error onto the screen.
   */
  static async fromDocuments(
    docs: Document[],
    embeddings: EmbeddingsInterface,
    dbConfig: PGVectorStoreArgs & { dimensions?: number }
  ): Promise<PGVectorStore> {
    const vectorStore = new CustomPgVector(embeddings, dbConfig);
    await vectorStore.addDocuments(docs);
    return vectorStore;
  }

  /**
   * Method to preform similarity search. Was overridden
   * for using only those embeddings vectors that are
   * part of the provided uploadId and should not compare
   * other uploads.
   */
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
    const rows = await this.pool.query(
      `
      SELECT id,  page_number, content, embeddings <=> $1 AS similarity
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
