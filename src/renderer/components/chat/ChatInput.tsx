import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ChatInput() {

  const {t} = useTranslation()
  return (
    <div className="bg-gray-800 p-4 border-t border-gray-600 flex space-x-3">
      <textarea
        //   value={newMessage}
        //   onChange={(e) => setNewMessage(e.target.value)}
        //   onKeyPress={handleKeyPress}
        placeholder={t("renderer.components.chat.ChatInput.WriteMessage")}
        className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={1}
      />
      <button
        //   onClick={handleSend}
        //   disabled={!newMessage.trim() || sending}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white p-2 rounded-lg"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
