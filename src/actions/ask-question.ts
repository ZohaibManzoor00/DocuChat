"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../firebaseAdmin";
import { Message } from "@/components/chat-view";
import { generateLangchainCompletion } from "@/lib/langchain";

// const FREE_LIMIT = 3;
// const PRO_LIMIT = 100;

export const askQuestion = async (id: string, question: string) => {
  await auth.protect();

  const { userId } = await auth();

  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  //   const chatSnapshot = await chatRef.get();
  //   const userMessages = chatSnapshot.docs.filter((doc) => doc.data().role === "human")

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);
  //   await chatRef.add({
  //     role: "ai",
  //     message: "Responded",
  //     createdAt: new Date(),
  //   });

  return { success: true, message: null };
};
