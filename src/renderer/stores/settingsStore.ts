import { create } from 'zustand';

export interface AppSettings {
  theme: 'dark' | 'light';
  language: 'system' | 'ko' | 'en' | 'ja';
  notifications: boolean;
  autoStart: boolean;
}

interface SettingsState extends AppSettings {
  // Actions
  setTheme: (theme: AppSettings['theme']) => void;
  setLanguage: (language: AppSettings['language']) => void;
  setNotifications: (enabled: boolean) => void;
  setAutoStart: (enabled: boolean) => void;
  resetToDefaults: () => void;
  
  // Computed values
  getCurrentLanguage: () => string;
  getSystemLocale: () => string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'system',
  notifications: true,
  autoStart: false,
};

// localStorage에서 설정 로드
const loadSettings = (): AppSettings => {
  try {
    const saved = localStorage.getItem('app-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('설정 로드 실패:', error);
  }
  return DEFAULT_SETTINGS;
};

// localStorage에 설정 저장
const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('설정 저장 실패:', error);
  }
};

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initialState = loadSettings();
  
  return {
    ...initialState,

    // Actions
    setTheme: (theme) => {
      set({ theme });
      saveSettings({ ...get(), theme });
    },
    
    setLanguage: (language) => {
      set({ language });
      saveSettings({ ...get(), language });
    },
    
    setNotifications: (notifications) => {
      set({ notifications });
      saveSettings({ ...get(), notifications });
    },
    
    setAutoStart: (autoStart) => {
      set({ autoStart });
      saveSettings({ ...get(), autoStart });
    },
    
    resetToDefaults: () => {
      set(DEFAULT_SETTINGS);
      saveSettings(DEFAULT_SETTINGS);
    },

    // Computed values
    getCurrentLanguage: () => {
      const { language } = get();
      if (language === 'system') {
        const systemLocale = get().getSystemLocale();
        const langCode = systemLocale.split('-')[0];
        return langCode;
      }
      return language;
    },

    getSystemLocale: () => {
      return navigator.language || navigator.languages?.[0] || 'ko-KR';
    },
  };
}); 