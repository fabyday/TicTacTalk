import { useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

export const useSettings = () => {
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
    getCurrentLanguage,
    getSystemLocale,
  } = useSettingsStore();

  // 테마 적용
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // 언어 적용
  useEffect(() => {
    applyLanguage(language);
  }, [language]);

  const applyTheme = (currentTheme: string) => {
    if (currentTheme === 'light') {
      document.body.style.backgroundColor = "#ffffff";
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.body.style.backgroundColor = "#111827"; // bg-gray-900
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const applyLanguage = (currentLanguage: string) => {
    let targetLanguage = currentLanguage;
    
    if (currentLanguage === 'system') {
      const systemLocale = getSystemLocale();
      targetLanguage = systemLocale.split('-')[0];
    }
    
    // 실제 애플리케이션에서는 여기서 i18n 라이브러리를 사용하여 언어를 변경합니다
    console.log('언어 변경:', targetLanguage);
    
    // 예시: document.documentElement.lang = targetLanguage;
  };

  const getLanguageDisplayName = (langCode: string) => {
    switch (langCode) {
      case 'system':
        return `시스템 언어 (${getSystemLocale()})`;
      case 'ko':
        return '한국어';
      case 'en':
        return 'English';
      case 'ja':
        return '日本語';
      default:
        return '한국어';
    }
  };

  const getCurrentLanguageName = () => {
    if (language === 'system') {
      const langCode = getSystemLocale().split('-')[0];
      switch (langCode) {
        case 'ko':
          return '한국어';
        case 'en':
          return 'English';
        case 'ja':
          return '日本語';
        default:
          return '한국어';
      }
    }
    return getLanguageDisplayName(language);
  };

  return {
    // State
    theme,
    language,
    notifications,
    autoStart,
    
    // Actions
    setTheme,
    setLanguage,
    setNotifications,
    setAutoStart,
    resetToDefaults,
    
    // Computed
    getCurrentLanguage,
    getSystemLocale,
    getLanguageDisplayName,
    getCurrentLanguageName,
  };
}; 