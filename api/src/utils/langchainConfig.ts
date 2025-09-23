import { Response } from 'express';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { CustomPgVector } from '../db/CustomVectorDB';
import { pg } from '../db';
const openAIOptions = {
  apiKey: process.env.Open_Api_Key!,
};
// Define an llm
const llm = new ChatOpenAI(openAIOptions);

// Create a output parser
const parser = new StringOutputParser();

// create embeddings instance
const embeddings = new OpenAIEmbeddings(openAIOptions);

const retriever = new CustomPgVector(embeddings, {
  pool: pg,
  tableName: 'documents',
});

// Prompt to convert a question into standalone
// question fromt the chat history.
const standAlonePrompt = ChatPromptTemplate.fromTemplate(`
Given the chat history and the latest user input, rewrite the input as a standalone question.

Chat history:
{chatHistory}

User input: {question}

Standalone question:
`);

// answer prompt that take in the question and retrieved data to
// answer.
const QAPrompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful AI assistant. Use the context below to answer.

Context:
{context}

Question: {question}

Answer:
`);
// Create new instance. This is used for streaming
const streamLLm = new ChatOpenAI({
  ...openAIOptions,
  streaming: true,
});

// Chain to take the chat_history and convert it into a standalone
// question
const condenseChain = RunnableSequence.from([standAlonePrompt, llm, parser]);

// Runnable sequence flow to handle both condensation, retrieval.
export const conversationalRetrievelQA = RunnableSequence.from([
  // pass down the inputs.
  new RunnableMap({
    steps: {
      question: (input: any) => input.question,
      chatHistory: (input: any) => input.chatHistory,
      uploadId: (input: any) => input.uploadId,
    },
  }),
  // run the condenseChain,
  {
    question: condenseChain,
    input: new RunnablePassthrough(),
  },
  // retrieve the documents.
  {
    output: async (prev: any) => {
      const docs = await retriever.similaritySearch(prev.question, 5, {
        uploadId: prev.input.uploadId,
      });

      return {
        context: docs,
        question: prev.question,
      };
    },
  },
]);

/**
 *
 * @param res Express response to send response back to the user
 * @param input Input with both context and question to ask the llm.
 * @returns Response Stream back to the user.
 */
export const stream = async (
  res: Response,
  input: { context: any; question: any }
): Promise<string> => {
  try {
    // store the whole message to persist in db.
    let aiMessage = '';

    // set llm callbacks for handling
    // streams.
    streamLLm.callbacks = [
      {
        // send each token as generated back to the user.
        handleLLMNewToken: (token: string) => {
          const resAsObj = {
            event: 'token',
            token: token,
          };
          res.write(JSON.stringify(resAsObj) + '\n'); // \n is important if there are multiple objects.
          aiMessage += token; // accumulate message.
        },
      },
    ];
    // create a stream chain.
    const qaChain = RunnableSequence.from([QAPrompt, streamLLm]);

    // invoke chain.
    await qaChain.invoke(input);

    // return the whole message.
    return aiMessage;
  } catch (error) {
    throw error;
  }
};
