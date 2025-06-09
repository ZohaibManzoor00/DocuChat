import { useUser } from "@clerk/nextjs";
import { BotIcon, Loader2Icon, UserIcon } from "lucide-react";

import { Message } from "./chat-view";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  message: Message;
}
export function ChatMessage({ message }: Props) {
  const isHuman = message.role === "human";
  const { user } = useUser();

  return (
    <div
      className={cn(
        "flex items-start gap-3 group pb-4",
        isHuman ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className="flex-shrink-0">
        <Avatar className="h-9 w-9">
          {isHuman ? (
            <>
              <AvatarImage
                src={user?.imageUrl || "/placeholder.svg"}
                alt="User"
              />
              <AvatarFallback className="bg-primary/10">
                <UserIcon className="h-5 w-5" />
              </AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-primary/10">
              <BotIcon className="h-5 w-5" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <div
        className={cn(
          "flex flex-col max-w-[80%] rounded-lg px-4 py-3 text-sm",
          isHuman
            ? "bg-muted text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {message.message === "Thinking..." ? (
          <div className="flex items-center justify-center py-2">
            <Loader2Icon className="animate-spin h-5 w-5" />
          </div>
        ) : (
          <div
            className={cn(
              "prose prose-sm max-w-none",
              isHuman ? "prose-slate" : "prose-invert"
            )}
          >
            <Markdown>{message.message}</Markdown>
          </div>
        )}
        <span
          className={cn(
            "text-xs mt-1 self-end opacity-70",
            isHuman ? "text-muted-foreground" : "text-primary-foreground/70"
          )}
        >
          {message.createdAt.getTime()}
        </span>
      </div>
    </div>
  );
}
