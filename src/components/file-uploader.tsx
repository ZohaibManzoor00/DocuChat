"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { StatusText, useUpload } from "@/hooks/useUpload";
import {
  CheckCircle,
  CircleArrowDown,
  Loader2,
  RocketIcon,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";

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
  }, [handleUpload]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragActive } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const isUploading = progress !== null && progress > 0 && progress <= 100;

  const statusIcons: {
    [key in StatusText]: React.ReactNode;
  } = {
    [StatusText.UPLOADING]: <Loader2 className="size-20 animate-spin" />,
    [StatusText.UPLOADED]: <CheckCircle className="size-20" />,
    [StatusText.SAVING]: <Save className="size-20" />,
    [StatusText.GENERATING]: <RocketIcon className="size-20" />,
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-7xl mx-auto">
      {isUploading && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <p className={cn(progress === 100 && "hidden")}>{progress} %</p>
          {status && statusIcons[status as StatusText]}
          <Progress value={progress} className="w-full" />
          {status ? (
            <p className="text-sm text-muted-foreground">{String(status)}</p>
          ) : null}
        </div>
      )}
      {!isUploading && (
        <div
          {...getRootProps()}
          className={cn(
            `p-10 border-2 border-dashed mt-10 w-[90%] border-primary text-primary rounded-lg h-96 flex items-center justify-center`,
            (isFocused || isDragAccept) && "border-primary bg-primary/10"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4 cursor-pointer">
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
      )}
    </div>
  );
}
