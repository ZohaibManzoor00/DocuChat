import { useUser } from "@clerk/nextjs";
import { Message } from "./chat-view";
// import Image from "next/image";
import { BotIcon, Loader2Icon, UserIcon } from "lucide-react";
import Markdown from "react-markdown";

interface Props {
  message: Message;
}
export function ChatMessage({ message }: Props) {
  const isHuman = message.role === "human";
  const { user } = useUser();

  return (
    <div className={`chat ${isHuman ? "chat-start" : "chat-end"}`}>
      <div className="w-10 rounded-full">
        {isHuman ? (
          user?.imageUrl && (
            // <Image
            // src={user.imageUrl}
            //   alt="User profile pic"
            //   width={40}
            //   height={40}
            //   className="rounded-full"
            // />
            <UserIcon className="size-7" />
          )
        ) : (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
            <BotIcon className="size-7" />
          </div>
        )}
      </div>

      <div className="">
        {message.message === "Thinking..." ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin size-5" />
          </div>
        ) : (
          <Markdown>{message.message}</Markdown>
        )}
      </div>
    </div>
  );
}
