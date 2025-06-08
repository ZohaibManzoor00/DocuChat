import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Embeddings } from "@langchain/core/embeddings";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    // Pad to 1536 dimensions by repeating the vector
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

  // Initialize padded Gemini embeddings
  const embeddings = new PaddedGeminiEmbeddings();

  const index = pineconeClient.Index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `---Namespace ${docId} already exists, reusing existing embeddings---`
    );
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      namespace: docId,
    });
    return pineconeVectorStore;
  } else {
    // download from firestore then embed
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
