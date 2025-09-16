import { create } from 'zustand';

interface UserVolumeData {
  [userId: number]: number; // userId -> volume (0-100)
}

interface UserVolumeState {
  userVolumes: UserVolumeData;
  defaultVolume: number;
  
  // Actions
  setUserVolume: (userId: number, volume: number) => void;
  getUserVolume: (userId: number) => number;
  resetUserVolume: (userId: number) => void;
  resetAllVolumes: () => void;
}

const DEFAULT_VOLUME = 100;

// localStorage에서 사용자 볼륨 설정 로드
const loadUserVolumes = (): UserVolumeData => {
  try {
    const saved = localStorage.getItem('user-volumes');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('사용자 볼륨 설정 로드 실패:', error);
  }
  return {};
};

// localStorage에 사용자 볼륨 설정 저장
const saveUserVolumes = (userVolumes: UserVolumeData) => {
  try {
    localStorage.setItem('user-volumes', JSON.stringify(userVolumes));
  } catch (error) {
    console.error('사용자 볼륨 설정 저장 실패:', error);
  }
};

export const useUserVolumeStore = create<UserVolumeState>((set, get) => {
  const initialUserVolumes = loadUserVolumes();
  
  return {
    userVolumes: initialUserVolumes,
    defaultVolume: DEFAULT_VOLUME,

    // Actions
    setUserVolume: (userId, volume) => {
      const clampedVolume = Math.max(0, Math.min(100, volume));
      const newUserVolumes = {
        ...get().userVolumes,
        [userId]: clampedVolume
      };
      
      set({ userVolumes: newUserVolumes });
      saveUserVolumes(newUserVolumes);
    },
    
    getUserVolume: (userId) => {
      const { userVolumes } = get();
      return userVolumes[userId] ?? DEFAULT_VOLUME;
    },
    
    resetUserVolume: (userId) => {
      const { userVolumes } = get();
      const newUserVolumes = { ...userVolumes };
      delete newUserVolumes[userId];
      
      set({ userVolumes: newUserVolumes });
      saveUserVolumes(newUserVolumes);
    },
    
    resetAllVolumes: () => {
      set({ userVolumes: {} });
      saveUserVolumes({});
    },
  };
}); 