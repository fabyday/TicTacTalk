export {};
declare global {
  interface Window {
    audioBridge: {
      onOpusData: (callback: (data: ArrayBuffer) => void) => void;
    };
  }
}
