import { Button } from "@/components/ui/button";
import CssGridBackground from "@/components/css-grid-background";
import FramerSpotlight from "@/components/framer-spotlight";
import TypingPromptInput from "@/components/typing-prompt-input";
import { Brain, Zap } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          <CssGridBackground />
          <FramerSpotlight />
          <div className="container px-4 md:px-6 py-16 md:py-20">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-block rounded-lg bg-muted px-4 py-1.5 text-sm mb-6">
                Enterprise & Personal AI Solution
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-6">
                Secure AI Conversations with your PDF documents
              </h1>
              <br />

              <div className="flex items-center font-medium text-md text-primary max-w-3xl mb-12">
                <p>
                  Get AI insights on any pdf and conversate with a context aware
                  AI that knows your pdf and your chat history
                </p>
                <Brain className="size-6 ml-1" />
              </div>
              <TypingPromptInput />

              <div className="flex flex-wrap justify-center gap-3 mt-16">
                <Button
                  asChild
                  className="flex items-center px-5 py-6 h-[60px] bg-[#1a1d21] hover:bg-[#2a2d31] text-white rounded-xl border-0 dark:bg-primary dark:hover:bg-primary/90 dark:shadow-[0_0_15px_rgba(36,101,237,0.5)] relative overflow-hidden group"
                >
                  <Link href="/dashboard/upload">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 dark:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                    <Zap className="size-5.5 text-white relative z-10" />
                    <div className="flex flex-col items-start relative z-10">
                      <span className="text-[15px] font-medium">
                        Upload PDF
                      </span>
                    </div>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="px-5 py-6 h-[60px] rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[15px] font-medium text-foreground"
                >
                  <Link href="/dashboard">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
