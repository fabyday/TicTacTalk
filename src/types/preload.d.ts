export {};
declare global {
  interface Window {
    audio: {
      audioData: (callback: (data: ArrayBuffer) => void) => void;
      decodeOpus: (base64OpusData: string) => Promise<{
        success: boolean;
        pcmData?: number[];
        sampleRate?: number;
        channels?: number;
        error?: string;
      }>;
    };
    electronAPI: {
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      openDevTools: () => void;
      closeDevTools: () => void;
      toggleDevTools: () => void;
      log: {
        info: (message: string, ...args: any[]) => Promise<void>;
        warn: (message: string, ...args: any[]) => Promise<void>;
        error: (message: string, ...args: any[]) => Promise<void>;
        debug: (message: string, ...args: any[]) => Promise<void>;
      };
    };
  }
}
