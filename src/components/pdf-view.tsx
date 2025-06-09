"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Button } from "./ui/button";

interface Props {
  url: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfView({ url }: Props) {
  const [file, setFile] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const fetchFile = async () => {
      const res = await fetch(url);
      const file = await res.blob();
      setFile(file);
    };
    fetchFile();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="sticky top-0 z-50 p-4 rounded-lg bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-6xl px-2 grid grid-cols-6 gap-2">
          <Button
            variant="outline"
            disabled={pageNumber === 1}
            onClick={() => {
              if (pageNumber > 1) setPageNumber(pageNumber - 1);
            }}
          >
            Previous
          </Button>
          <p className="flex items-center justify-center">
            {pageNumber} of {numPages}
          </p>

          <Button
            variant="outline"
            disabled={pageNumber === numPages}
            onClick={() => {
              if (numPages && pageNumber < numPages)
                setPageNumber(pageNumber + 1);
            }}
          >
            Next
          </Button>

          <Button
            variant="outline"
            onClick={() => setRotation((rotation + 90) % 360)}
          >
            <RotateCw className="size-4" />
          </Button>

          <Button
            variant="outline"
            onClick={() => setScale(scale * 1.2)}
            disabled={scale >= 1.5}
          >
            <ZoomInIcon />
          </Button>

          <Button
            variant="outline"
            onClick={() => setScale(scale / 1.2)}
            disabled={scale <= 0.75}
          >
            <ZoomOutIcon />
          </Button>
        </div>
      </div>
      {!file ? (
        <Loader2Icon className="animate-spin size-20 text-primary mt-20" />
      ) : (
        <Document
          loading={null}
          file={file}
          rotate={rotation}
          onLoadSuccess={onDocumentLoadSuccess}
          className="m-4 overflow-y-scroll"
        >
          <Page className="shadow-lg" pageNumber={pageNumber} scale={scale} />
        </Document>
      )}
    </div>
  );
}
