// components/ChatUI.tsx
import React, { useState } from "react";
import { Send, RefreshCw, Bug } from "lucide-react";
import { Message } from "../services/api";

interface ChatUIProps {
  channelName: string;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  onSend: (text: string) => void;
  onReload: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatUI({
  channelName,
  messages,
  loading,
  sending,
  onSend,
  onReload,
  messagesEndRef,
}: ChatUIProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    onSend(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-700 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <div>메시지를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-700 flex flex-col">
      {/* 채널 헤더 */}
      <div className="bg-gray-800 p-4 border-b border-gray-600 flex justify-between">
        <h2 className="text-white font-semibold">#{channelName}</h2>
        <button
          onClick={onReload}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-lg">아직 메시지가 없습니다</div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
                {message.user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-white">
                    {message.user?.username || "알 수 없음"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-200 whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="bg-gray-800 p-4 border-t border-gray-600 flex space-x-3">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white p-2 rounded-lg"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
