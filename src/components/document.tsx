"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  id: string;
  name: string;
  downloadUrl: string;
  size: number;
}
export function Document({ id, name, downloadUrl, size }: Props) {
  console.log(downloadUrl);
  const router = useRouter();
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
      <div className="flex items-center gap-2 mt-auto">
        <Button variant="outline" size="icon" className="w-full">
          <DownloadIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
