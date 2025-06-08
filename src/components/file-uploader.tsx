"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { useUpload } from "@/hooks/useUpload";
import { CircleArrowDown, RocketIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleUpload(file);
    } else {
      // do nothing
      // toast
    }
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragActive } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  return (
    <div className="flex flex-col items-center gap-4 max-w-7xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          `p-10 border-2 border-dashed mt-10 w-[90%] border-primary text-primary rounded-lg h-96 flex items-center justify-center`,
          (isFocused || isDragAccept) && "border-primary bg-primary/10"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          {isDragActive ? (
            <>
              <RocketIcon className="h-20 w-20 animate-ping" />
              <p>Drop files here ...</p>
            </>
          ) : (
            <>
              <CircleArrowDown className="h-20 w-20" />
              <p>{`Drag 'n' drop some files here, or click to select files`}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
