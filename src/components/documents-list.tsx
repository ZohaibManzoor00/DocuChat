import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../firebaseAdmin";
import { PlaceholderDocument } from "./placeholder-document";
import { Document } from "./document";

export async function DocumentsList() {
  await auth.protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const documentSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  return (
    <>
      <h1 className="text-3xl p-5 font-extralight">My Documents (<strong>{documentSnapshot.docs.length}</strong>)</h1>
      <div className="flex flex-wrap p-5 justify-center lg:justify-start gap-5 rounded-sm max-w-7xl mx-auto">
        <PlaceholderDocument />
        {documentSnapshot.docs.map((doc) => {
          const { name, downloadUrl, size } = doc.data();
          return (
            <Document
              key={doc.id}
              id={doc.id}
              name={name}
              size={size}
              downloadUrl={downloadUrl}
            />
          );
        })}
      </div>
    </>
  );
}
