import React from "react";
import { SettingsTab } from "../pages/settings";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onBackToMain?: () => void;
}

export function SettingsSidebar({ activeTab, onTabChange, onBackToMain }: SettingsSidebarProps) {
  const tabs = [
    { id: 'general' as SettingsTab, label: '일반', icon: '⚙️' },
    { id: 'shortcuts' as SettingsTab, label: '단축키', icon: '⌨️' },
    { id: 'voice-video' as SettingsTab, label: '음성 & 비디오', icon: '🎤' },
    { id: 'servers' as SettingsTab, label: '서버 목록', icon: '🌐' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col justify-between overflow-y-auto">
      <div className="p-4 flex-1 flex flex-col">
        <h1 className="text-xl font-bold text-white mb-6">설정</h1>
        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {onBackToMain && (
        <div className="p-4 border-t border-gray-800 bg-gray-900 flex-shrink-0">
          <button
            onClick={onBackToMain}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            ← 메인으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
} 