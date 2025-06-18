"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap } from "lucide-react";

export default function HeroButtons() {
  const scrollToVideo = () => {
    document.getElementById("video-preview")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-16">
      <Button
        asChild
        className="flex items-center px-4 py-4 h-[45px] bg-[#1a1d21] hover:bg-[#2a2d31] text-white rounded-xl border-0 dark:bg-primary dark:hover:bg-primary/90 dark:shadow-[0_0_15px_rgba(36,101,237,0.5)] relative overflow-hidden group"
      >
        <Link href="/dashboard/upload">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 dark:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
          <Zap className="size-4 text-white relative z-10" />
          <div className="flex flex-col items-start relative z-10">
            <span className="text-[14px] font-medium mr-2">
              Upload PDF
            </span>
          </div>
        </Link>
      </Button>
      <Button
        onClick={scrollToVideo}
        className="px-4 py-4 h-[45px] rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:via-yellow-400 hover:to-amber-500 text-[14px] font-medium text-white shadow-xl shadow-amber-500/30 dark:shadow-amber-400/40 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700 cursor-pointer"
      >
        See it in action
      </Button>
      <Button
        asChild
        className="px-4 py-4 h-[45px] rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[14px] font-medium text-foreground"
      >
        <Link href="/dashboard">Sign Up</Link>
      </Button>
    </div>
  );
} 