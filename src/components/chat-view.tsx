"use client";

import { db } from "../../firebase";
import { useRef, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { askQuestion } from "@/actions/ask-question";
import { ChatMessage } from "./chat-message";
import { toast } from "sonner";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

interface Props {
  id: string;
}

const formSchema = z.object({
  message: z.string().min(1),
});

export function ChatView({ id }: Props) {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const userQuestion = values.message;

    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: userQuestion,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, userQuestion);
      if (!success) {
        toast.custom((t) => (
          <div className="w-full max-w-md bg-red-600 text-destructive-foreground border border-destructive rounded-lg p-4 shadow-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm opacity-80">{message}</p>
            </div>
            <Button
              variant="link"
              onClick={() => toast.dismiss(t)}
              className="ml-4 text-sm underline text-white hover:text-white/80"
            >
              Close
            </Button>
          </div>
        ));

        setMessages((prev) =>
          prev.slice(0, -1).concat([
            {
              role: "ai",
              message: `Whoops... ${message}`,
              createdAt: new Date(),
            },
          ])
        );
      }
    });

    form.reset();
  };

  const [snapshot, loading] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!snapshot) return;

    const lastMessage = messages.pop();

    if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();

      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });

    setMessages(newMessages);
  }, [snapshot]);

  return (
    <div className="flex flex-col h-full overflow-scroll ">
      <div className="flex-1 w-full ">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-4 animate-spin mt-20 text-primary" />
          </div>
        ) : (
          <div className="p-5">
            {messages.length === 0 && (
              <ChatMessage
                key={"placeholder"}
                message={{
                  role: "ai",
                  message: "Ask me anything about the document!",
                  createdAt: new Date(),
                }}
              />
            )}

            {messages.map((message, idx) => (
              <ChatMessage key={idx} message={message} />
            ))}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex sticky bottom-0 space-x-2 p-5 bg-primary"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Ask me anything about the document, e.g. 'Summarize this document'"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="secondary"
            className="text-md dark:text-primary hover:bg-black hover:text-white dark:hover:bg-secondary"
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "Ask"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
