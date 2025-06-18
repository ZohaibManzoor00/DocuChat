"use client";

import { FrownIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";

export function PlaceholderDocument() {
  const { isOverFileLimit } = useSubscription();
  const router = useRouter();

  const handleClick = () => {
    if (isOverFileLimit) {
      return router.push("/dashboard/upgrade");
    }
    router.push("/dashboard/upload");
  };

  return (
    <Button
      onClick={handleClick}
      className="flex flex-col bg-primary text-primary-foreground items-center w-64 h-80 rounded-xl drop-shadow-md"
    >
      {isOverFileLimit ? (
        <FrownIcon className="size-16" />
      ) : (
        <PlusCircleIcon className="size-16" />
      )}

      <p className="font-semibold">
        {isOverFileLimit ? "Upgrade to add more documents" : "Add a document"}
      </p>
    </Button>
  );
}
