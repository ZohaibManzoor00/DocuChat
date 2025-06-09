import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../../../../firebaseAdmin";
import { PdfView } from "@/components/pdf-view";
import { ChatView } from "@/components/chat-view";

interface Props {
  params: Promise<{ id: string }>;
}
export default async function ChatToFilePage({ params }: Props) {
  await auth.protect();

  const { id } = await params;

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .get();

  const url = ref.data()?.downloadUrl;

  if (!url) {
    throw new Error("File not found");
  }

  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      <div className="col-span-5 lg:col-span-2 overflow-y-auto">
        <ChatView id={id}/>
      </div>

      <div className="col-span-5 lg:col-span-3 border-r-2  lg:-order-1 overflow-auto">
        <PdfView url={url} />
      </div>
    </div>
  );
}
