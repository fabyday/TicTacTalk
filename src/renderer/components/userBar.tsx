import { useTranslation } from "react-i18next";

export interface User {
  id: string;
  username: string;
  discriminator: string;
}

export interface UserBarProps {
  onSettingsClick: () => void;
  user: User | null;
  onLogout: () => void;
}

export default function UserBar({
  onSettingsClick,
  user,
  onLogout,
}: UserBarProps) {
  const { t } = useTranslation();
  
  return (
    <div className="h-14 bg-gray-800 flex items-center justify-between px-4">
      {/* 유저 정보 */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-400 rounded-full" />
        <div>
          <div className="text-sm font-bold">{user?.username || "사용자"}</div>
          <div className="text-xs text-gray-400">
            #{user?.discriminator || "0000"}
          </div>
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
        <button
          className="text-gray-400 hover:text-red-400 transition-colors"
          onClick={onLogout}
          title="로그아웃"
        >
          🚪
        </button>
      </div>
    </div>
  );
}
