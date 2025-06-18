import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Brain, FilePlus2, Zap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ThemeSwitcher } from "./theme-switcher";
import UpgradeButton from "./upgrade-button";

export function Header() {
  return (
    <div className="flex justify-between shadow-sm p-5 border-b items-center">
      <Link
        href="/dashboard"
        className="text-lg md:text-xl flex items-center gap-2"
      >
        <Brain className="size-6" />
        DocuChat{" "}
        <span className="text-primary hidden md:flex">Chat with your PDF</span>
      </Link>

      <SignedIn>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            <ThemeSwitcher />
          </div>
          <Button asChild variant="link" className="hidden md:flex text-md">
            <Link href="/dashboard/upgrade">Pricing</Link>
          </Button>

          <Button asChild variant="link" className="text-md">
            <Link href="/dashboard">My Documents</Link>
          </Button>

          <Button asChild variant="outline" className="border-primary">
            <Link href="/dashboard/upload">
              <p className="hidden md:flex">Upload</p>
              <FilePlus2 className="text-primary" />
            </Link>
          </Button>

          <div className="ml-1"/>
          <UpgradeButton />
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button asChild>
            <Link href="/dashboard">
              <Zap className="size-4" />
              Get Started
            </Link>
          </Button>
        </div>
      </SignedOut>
    </div>
  );
}
