import { Message } from "../../services/types";
import { GuideLine } from "./GuideLine";
import { MessageBlock } from "./MessageBlock";
import { useTranslation } from "react-i18next";

interface ChatViewProps {
  messages?: Message[];
  lastMessageReadId?: number;
}

export function MessageFeed({
  messages,
  lastMessageReadId: lastReadMessageId,
}: ChatViewProps) {
  /**
   * TODO guideText
   */
  // const t = (ts:any)=>undefined;
  const { t } = useTranslation();

  const notifyNewMessage = (
    <GuideLine guideText={t("renderer.components.chat.MessageFeed.NewMessage")} textColor="red" lineColor="red" />
  );
  return (
    <div
      className=" h-full  bg-gray-800 p-4 border-t border-gray-600 space-y-3 
    overflow-y-scroll
    scroll-messagefeed
    "
      style={
        {
          "--scrollbar-thumb-color": "red",
          "--scrollbar-track-color": "coral",
        } as React.CSSProperties
      }
    >
      {typeof messages === "undefined" || messages.length === 0  ? (
        <div className="text-center text-gray-400 py-8">
          <div className="text-lg">{t("renderer.components.chat.MessageFeed.NoMessages")}</div>
        </div>
      ) : (
        messages.map((message, index) => {
          const currentDate = message.createdAt.slice(0, 10); // YYYY-MM-DD
          const prevDate =
            index > 0 ? messages[index - 1].createdAt.slice(0, 10) : null;

          const isNewDay = currentDate !== prevDate;
          const lastreadedMessageId = lastReadMessageId ?? message.id;
          const isNewMessage = message.id > lastreadedMessageId;
          const isNewMessageLineNeeded = message.id === lastreadedMessageId + 1;
          return (
            <>
              {isNewDay && (
                <GuideLine
                  guideText={currentDate}
                  textColor="gray"
                  lineColor="gray"
                ></GuideLine>
              )}
              {isNewMessage && isNewMessageLineNeeded && notifyNewMessage}
              <MessageBlock data={message} />
            </>
          );
        })
      )}
    </div>
  );
}
