import { auth } from "@clerk/nextjs/server";
import { PlaceholderDocument } from "./placeholder-document";
import { adminDb } from "../../firebaseAdmin";
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
    <div className="max-w-7xl mx-auto pt-3 pb-20">
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
    </div>
  );
}
