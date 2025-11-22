import { useTranslation } from "react-i18next";
import { Message } from "../../services/types";
import { ChatInput } from "./ChatInput";
import { MessageFeed } from "./MessageFeed";

interface ChatViewProps {
  channelName?: string;
  messages?: Message[];
  onFocus?: () => void;
  onScroll?: () => void;
}

export function ChatView({ channelName, messages }: ChatViewProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-800 flex-1 p-4 space-y-1">
      <div className="">
        <p className="text-xl text-white">
          {channelName || t("renderer.components.chat.ChatView.UnknownChannelName")}
        </p>
      </div>
      <MessageFeed messages={messages} />
      <ChatInput />
    </div>
  );
}
