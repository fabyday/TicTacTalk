import React, { useState } from "react";
import { useSettings } from "../../hooks/useSettings";

export function GeneralSettings() {
  const {
    theme,
    language,
    notifications,
    autoStart,
    setTheme,
    setLanguage,
    setNotifications,
    setAutoStart,
    resetToDefaults,
    getSystemLocale,
    getCurrentLanguageName,
  } = useSettings();

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Zustand persist 미들웨어가 자동으로 저장하므로 별도 저장 로직 불필요
      setSaveMessage('설정이 저장되었습니다!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setSaveMessage('설정 저장에 실패했습니다.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setSaveMessage('기본값으로 복원되었습니다!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">일반 설정</h2>
      
      <div className="space-y-6">
        {/* 테마 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">테마</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                className="text-blue-600"
              />
              <span className="text-gray-300">다크 모드</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                className="text-blue-600"
              />
              <span className="text-gray-300">라이트 모드</span>
            </label>
          </div>
        </div>

        {/* 언어 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">언어</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">언어 선택</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'system' | 'ko' | 'en' | 'ja')}
                className="w-full bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="system">시스템 언어 사용</option>
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
              <div className="text-sm text-gray-400 mb-1">현재 언어</div>
              <div className="text-white font-medium">{getCurrentLanguageName()}</div>
              {language === 'system' && (
                <div className="text-xs text-gray-500 mt-1">
                  시스템 로케일: {getSystemLocale()}
                </div>
              )}
            </div>
            
            {/* 언어 설정 설명 */}
            <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-blue-300 mb-2">언어 설정 안내</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <p><strong>시스템 언어 사용:</strong> 운영체제의 언어 설정을 자동으로 따릅니다.</p>
                <p><strong>수동 선택:</strong> 애플리케이션에서 사용할 언어를 직접 지정합니다.</p>
                <p className="text-yellow-400">언어를 변경하면 애플리케이션을 재시작해야 할 수 있습니다.</p>
              </div>
            </div>
            
            <div className="text-xs text-gray-400">
              언어를 변경하면 애플리케이션을 재시작해야 할 수 있습니다.
            </div>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">알림</h3>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="text-blue-600 rounded"
            />
            <span className="text-gray-300">데스크톱 알림 활성화</span>
          </label>
        </div>

        {/* 자동 시작 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">시스템</h3>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="text-blue-600 rounded"
            />
            <span className="text-gray-300">시스템 시작 시 자동 실행</span>
          </label>
        </div>

        {/* 저장 버튼들 */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            기본값으로 복원
          </button>
          
          <div className="flex items-center space-x-3">
            {saveMessage && (
              <span className={`text-sm ${
                saveMessage.includes('실패') ? 'text-red-400' : 'text-green-400'
              }`}>
                {saveMessage}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {isSaving ? '저장 중...' : '설정 저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 