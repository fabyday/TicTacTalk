import { Message } from "../../services/types";
import { ChatInput } from "./ChatInput";
import { MessageFeed } from "./MessageFeed";

interface ChatViewProps {
  messages: Message[];
}

interface ChatViewProps2 {
  channelId: string;
}

export function ChatView({ messages }: ChatViewProps) {
  return (
    <div className="bg-gray-800 flex-1 p-4 space-y-1">
      <div className="">
        <p className="text-xl text-white">Header</p>
      </div>
      <MessageFeed messages={messages} />
      <ChatInput />
    </div>
  );
}
