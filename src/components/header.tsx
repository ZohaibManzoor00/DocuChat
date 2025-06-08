import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { FilePlus2 } from "lucide-react";

export function Header() {
  return (
    <div className="flex justify-between shadow-sm p-5 border-b items-center">
      <Link href="/dashboard">
        Chat with <span className="text-primary">PDF</span>
      </Link>

      <SignedIn>
        <div className="flex items-center space-x-2">
          <Button asChild variant="link" className="hidden md:flex">
            <Link href="/dashboard/upgrade">Pricing</Link>
          </Button>

          <Button asChild variant="link">
            <Link href="/dashboard">My Documents</Link>
          </Button>

          <Button asChild variant="outline" className="border-primary">
            <Link href="/dashboard/upload">
            <FilePlus2 className="text-primary"/>
            </Link>
          </Button>

        

          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
}
