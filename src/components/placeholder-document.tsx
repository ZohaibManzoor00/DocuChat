"use client";

import { useRouter } from "next/navigation";

import { PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

export function PlaceholderDocument() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/upload");
  };

  return (
    <Button
      onClick={handleClick}
      className="flex flex-col bg-primary text-primary-foreground items-center w-64 h-80 rounded-xl drop-shadow-md"
    >
      <PlusCircleIcon className="size-14" />
      <p>Add a document</p>
    </Button>
  );
}
