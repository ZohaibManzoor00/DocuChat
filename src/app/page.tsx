import CssGridBackground from "@/components/css-grid-background";
import FramerSpotlight from "@/components/framer-spotlight";
import TypingPromptInput from "@/components/typing-prompt-input";
import { Bot, Brain, ChevronDown, Zap } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import HeroButtons from "@/components/hero-buttons";
import VideoPlayer from "@/components/video-player";

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
                  Get trusted AI answers from any PDF - with context from your
                  document and your chat history.
                </p>
                <Bot className="size-4 ml-1" />
              </div>
              <TypingPromptInput />

              <HeroButtons />
            </div>
          </div>
        </section>

        <section id="video-preview" className="py-10 pb-20 bg-muted/30">
          <div className="px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                See How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Watch how easy it is to upload your PDF and start having
                intelligent conversations with your documents
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <VideoPlayer />

              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 rounded-lg bg-background border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    AI understands your document context and provides relevant
                    insights
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg bg-background border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Responses</h3>
                  <p className="text-sm text-muted-foreground">
                    Get immediate answers to questions about your PDF content
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg bg-background border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <ChevronDown className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Simply drag and drop your PDF to start the conversation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
