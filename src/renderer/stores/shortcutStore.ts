import { create } from 'zustand';

export interface Shortcut {
  id: string;
  name: string;
  description: string;
  defaultKey: string;
  currentKey: string;
}

interface ShortcutState {
  shortcuts: Shortcut[];
  editingShortcut: string | null;
  
  // Actions
  setShortcut: (id: string, key: string) => void;
  setEditingShortcut: (id: string | null) => void;
  resetShortcut: (id: string) => void;
  resetAllShortcuts: () => void;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: 'minimize', name: '창 최소화', description: '애플리케이션 창을 최소화합니다', defaultKey: 'Ctrl+M', currentKey: 'Ctrl+M' },
  { id: 'maximize', name: '창 최대화', description: '애플리케이션 창을 최대화합니다', defaultKey: 'F11', currentKey: 'F11' },
  { id: 'search', name: '검색', description: '채널이나 사용자를 검색합니다', defaultKey: 'Ctrl+K', currentKey: 'Ctrl+K' },
  { id: 'settings', name: '설정', description: '설정 창을 엽니다', defaultKey: 'Ctrl+,', currentKey: 'Ctrl+,' },
  { id: 'mute', name: '음소거', description: '음성을 음소거합니다', defaultKey: 'Ctrl+Shift+M', currentKey: 'Ctrl+Shift+M' },
  { id: 'deafen', name: '듣기 중지', description: '듣기를 중지합니다', defaultKey: 'Ctrl+Shift+D', currentKey: 'Ctrl+Shift+D' },
];

// localStorage에서 단축키 로드
const loadShortcuts = (): Shortcut[] => {
  try {
    const saved = localStorage.getItem('app-shortcuts');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (error) {
    console.error('단축키 로드 실패:', error);
  }
  return DEFAULT_SHORTCUTS;
};

// localStorage에 단축키 저장
const saveShortcuts = (shortcuts: Shortcut[]) => {
  try {
    localStorage.setItem('app-shortcuts', JSON.stringify(shortcuts));
  } catch (error) {
    console.error('단축키 저장 실패:', error);
  }
};

export const useShortcutStore = create<ShortcutState>((set, get) => {
  const initialState = loadShortcuts();
  
  return {
    shortcuts: initialState,
    editingShortcut: null,

    setShortcut: (id, key) => {
      const { shortcuts } = get();
      const updatedShortcuts = shortcuts.map(shortcut => 
        shortcut.id === id ? { ...shortcut, currentKey: key } : shortcut
      );
      set({ shortcuts: updatedShortcuts });
      saveShortcuts(updatedShortcuts);
    },

    setEditingShortcut: (id) => {
      set({ editingShortcut: id });
    },

    resetShortcut: (id) => {
      const { shortcuts } = get();
      const updatedShortcuts = shortcuts.map(shortcut => 
        shortcut.id === id ? { ...shortcut, currentKey: shortcut.defaultKey } : shortcut
      );
      set({ shortcuts: updatedShortcuts });
      saveShortcuts(updatedShortcuts);
    },

    resetAllShortcuts: () => {
      set({ shortcuts: DEFAULT_SHORTCUTS });
      saveShortcuts(DEFAULT_SHORTCUTS);
    },
  };
}); 