"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";

interface Props {
  id: string;
  name: string;
  downloadUrl: string;
  size: number;
}
export function Document({ id, name, downloadUrl, size }: Props) {
  const router = useRouter();
  console.log(downloadUrl);
  return (
    <div className="flex bg-primary flex-col w-64 h-80 rounded-xl drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 cursor-pointer group">
      <div
        className="flex-1"
        onClick={() => router.push(`/dashboard/files/${id}`)}
      >
        <p className="font-semibold line-clamp-2">{name}</p>
        <p className="text-sm text-muted-foreground group-hover:text-primary transition-all">
          {byteSize(size).value} KB
        </p>
      </div>
    </div>
  );
}
