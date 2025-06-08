"use client";

import { cn } from "@/lib/utils";
import { CircleArrowDown, RocketIcon } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function FileUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, open, isFocused, isDragAccept, isDragActive } =
    useDropzone({
      onDrop,
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
            <p>Drag 'n' drop some files here, or click to select files</p>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
