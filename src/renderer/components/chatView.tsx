export default function ChatView() {
  return (
    <div className="flex-1 bg-gray-700 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-gray-800">
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-400 rounded-full" />
            <div>
              <div className="text-sm font-bold">사용자{i}</div>
              <div className="text-sm">
                안녕하세요! 이것은 메시지입니다. #{i}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
