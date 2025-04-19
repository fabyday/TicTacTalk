interface UserBarProps {
  onSettingsClick: () => void;
}

export default function UserBar({ onSettingsClick }: UserBarProps) {
  return (
    <div className="h-14 bg-gray-800 flex items-center justify-between px-4">
      {/* 유저 정보 */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-400 rounded-full" />
        <div>
          <div className="text-sm font-bold">내 닉네임</div>
          <div className="text-xs text-gray-400">#1234</div>
        </div>
      </div>

      {/* 우측 버튼들 */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white">🎤</button>
        <button className="text-gray-400 hover:text-white">🎧</button>
        <button
          className="text-gray-400 hover:text-white"
          onClick={onSettingsClick}
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
