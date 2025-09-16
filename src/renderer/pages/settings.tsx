import React, { useState } from "react";
import { SettingsSidebar } from "../components/settingsSidebar";
import { GeneralSettings } from "../components/settings/GeneralSettings";
import { ShortcutSettings } from "../components/settings/ShortcutSettings";
import { VoiceVideoSettings } from "../components/settings/VoiceVideoSettings";
import { ServerListSettings } from "../components/settings/ServerListSettings";

export type SettingsTab = 'general' | 'shortcuts' | 'voice-video' | 'servers';

interface SettingsPageProps {
  onBackToMain?: () => void;
}

export function SettingsPage({ onBackToMain }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'shortcuts':
        return <ShortcutSettings />;
      case 'voice-video':
        return <VoiceVideoSettings />;
      case 'servers':
        return <ServerListSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <SettingsSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onBackToMain={onBackToMain}
        />
        
        <div className="flex-1 overflow-y-auto bg-gray-800 relative scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-gray-900">
          {/* 뒤로가기 버튼 */}
          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 z-10"
            >
              ← 메인으로 돌아가기
            </button>
          )}
          
          <div className="p-6">
            {renderSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 