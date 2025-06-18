"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useTransition } from "react";
import { deleteDocument } from "@/actions/delete-document";

interface Props {
  id: string;
  name: string;
  downloadUrl: string;
  size: number;
}
export function Document({ id, name, downloadUrl, size }: Props) {
  const { isPro } = useSubscription();
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();

  return (
    <div className="flex bg-background flex-col shadow-2xl w-64 h-80 rounded-xl drop-shadow-md border border-border justify-between p-4 transition-all transform hover:scale-105 cursor-pointer group">
      <div
        className="flex-1"
        onClick={() => router.push(`/dashboard/files/${id}`)}
      >
        <p className="font-semibold line-clamp-2">{name}</p>
        <p className="text-sm text-muted-foreground group-hover:text-primary transition-all">
          {byteSize(size).value} KB
        </p>
      </div>

      <div className="flex space-x-2 justify-end">
        <Button
          variant="outline"
          disabled={isDeleting || !isPro}
          onClick={() => {
            const prompt = window.confirm(
              "Are you sure you want to delete this document?"
            );
            if (prompt) {
              startTransition(async () => {
                await deleteDocument(id);
              });
            }
          }}
        >
          <Trash2Icon className="size-6" />
          {!isPro && <span>PRO feature</span>}
        </Button>
        <Button asChild variant="outline" className="text-secondary">
          <a
            href={downloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <DownloadCloud className="size-6 text-primary" />
          </a>
        </Button>
      </div>
      {/* <div className="flex items-center gap-2 mt-auto">
        <Button variant="outline" size="icon" className="w-full">
          <DownloadIcon className="w-4 h-4" />
        </Button>
      </div> */}
    </div>
  );
}
