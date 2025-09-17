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

// Chain to take the chat_history and convert it into a standalone
// question
const condenseChain = RunnableSequence.from([standAlonePrompt, llm, parser]);

// Chain to take the data context retrieved and question for the llm
// to answer.
const qaChain = RunnableSequence.from([QAPrompt, llm, parser]);

// Runnable sequence flow to handle both condensation, retrieval, conversation.
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
    context: async (prev: any) => {
      return await retriever.similaritySearch(prev.question, 5, {
        uploadId: prev.input.uploadId,
      });
    },
    question: new RunnablePassthrough(),
  },
  // finally run the rag chain.
  {
    answer: qaChain,
  },
]);
