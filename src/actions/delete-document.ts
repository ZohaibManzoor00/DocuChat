"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb, adminStorage } from "../../firebaseAdmin";
import { indexName } from "@/lib/langchain";
import { revalidatePath } from "next/cache";
import pineconeClient from "@/lib/pinecone";

export async function deleteDocument(docId: string) {
  await auth.protect();

  const { userId } = await auth();

  await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(docId)
    .delete();

  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET)
    .file(`users/${userId}/files/${docId}`)
    .delete();

  console.log(docId);

  const index = pineconeClient.index(indexName);
  console.log(index);
  await index.namespace(docId).deleteAll();

  revalidatePath("/dashboard");
}
