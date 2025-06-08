import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
// import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { Embeddings } from "@langchain/core/embeddings";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
export const googleAIModel = new ChatGoogleGenerativeAI({
  // model: "gemini-pro",
  model: "gemini-1.5-pro",
  apiKey: process.env.GOOGLE_API_KEY,
});

export const openAIModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a custom embeddings class that pads Gemini's vectors
class PaddedGeminiEmbeddings extends GoogleGenerativeAIEmbeddings {
  constructor() {
    super({
      apiKey: process.env.GOOGLE_API_KEY || "",
      modelName: "embedding-001",
    });
  }

  async embedQuery(text: string): Promise<number[]> {
    const embedding = await super.embedQuery(text);
    return this.padEmbedding(embedding);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const embeddings = await super.embedDocuments(texts);
    return embeddings.map(this.padEmbedding);
  }

  private padEmbedding(embedding: number[]): number[] {
    const paddedEmbedding = [...embedding];
    while (paddedEmbedding.length < 1536) {
      paddedEmbedding.push(
        ...embedding.slice(
          0,
          Math.min(embedding.length, 1536 - paddedEmbedding.length)
        )
      );
    }
    return paddedEmbedding;
  }
}

export const indexName = "papafam";

const fetchMessagesFromDB = async (docId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("---Fetching chat history from DB---");
  const LIMIT = 10;

  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "asc")
    .limit(LIMIT)
    .get();

  const chatHistory = chats.docs.map((doc) => {
    return doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message);
  });

  console.log(`---Fetched last ${chatHistory.length} messages successfully---`);

  return chatHistory;
};

const namespaceExists = async (
  idx: Index<RecordMetadata>,
  namespace: string
) => {
  if (namespace === null) throw new Error("Namespace is required");
  const { namespaces } = await idx.describeIndexStats();
  return namespaces?.[namespace] != undefined;
};

export const generateDocs = async (docId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("---Fetching download URL from firestore---");

  const docRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = docRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error("Download URL not found");
  }

  console.log(`---Download URL fetched successfully: ${downloadUrl}---`);

  // fetch pdf from specified url
  const response = await fetch(downloadUrl);
  const data = await response.blob();
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  console.log("---Splitting docs into chunks---");
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`---Splitting docs into chunks: ${splitDocs.length} chunks---`);

  return splitDocs;
};

export const generateEmbeddingsInPinecone = async (docId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let pineconeVectorStore: PineconeStore;

  console.log("---Generating embeddings for docId---");

  const embeddings = new PaddedGeminiEmbeddings();
  //   const embeddings = new OpenAIEmbeddings();

  const index = pineconeClient.Index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `---Namespace ${docId} already exists, reusing existing embeddings---`
    );
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      namespace: docId,
      pineconeIndex: index
    });
    return pineconeVectorStore;
  } else {
    const splitDocs = await generateDocs(docId);
    console.log(
      `---Storing embeddings in namespace ${docId} in the ${indexName} Pinecone vector store ---`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      { namespace: docId, pineconeIndex: index }
    );

    console.log("---Embeddings generated successfully---");

    return pineconeVectorStore;
  }
};

export const generateLangchainCompletion = async (
  docId: string,
  question: string
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const pineconeVectorStore = await generateEmbeddingsInPinecone(docId);

  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found");
  }

  console.log("---Creating a retriever...---");

  const retriever = pineconeVectorStore.asRetriever();

  const chatHistory = await fetchMessagesFromDB(docId);

  console.log("---Defining a prompt template...---");

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get the information relevant to the conversation",
    ],
  ]);

  console.log("---Creating a history-aware retriever chain...---");

  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: googleAIModel,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  console.log("---Defining a prompt template for answering questions...---");

  // const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
  //   ...chatHistory,
  //   ["user", "{input}"],
  //   [
  //     "system",
  //     "Answer the user's questions based on the below context:\n\n{context}",
  //   ],
  // ]);

  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the below context:\n\n{context}",
    ],
    ...chatHistory,
    ["user", "{input}"],
  ]);

  console.log("---Creating a document combining chain...---");
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: googleAIModel,
    prompt: historyAwareRetrievalPrompt,
  });

  console.log("---Creating the main retrieval chain...---");
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  console.log("---Running the chain with a sample conversation...---");

  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  console.log("---Reply generated successfully---");

  return reply.answer;
};
