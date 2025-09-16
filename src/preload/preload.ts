import { contextBridge, ContextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("audio", {
  audioData: (callback: (data: ArrayBuffer) => void) => {
    ipcRenderer.on("opus-data", (_, data) => callback(data));
  },
  // Opus 디코딩 (메인 프로세스에서 처리)
  decodeOpus: async (base64OpusData: string) => {
    return await ipcRenderer.invoke("decode-opus", base64OpusData);
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => {
    ipcRenderer.send("window-minimize");
  },
  maximizeWindow: () => {
    ipcRenderer.send("window-maximize");
  },
  closeWindow: () => {
    ipcRenderer.send("window-close");
  },
  openDevTools: () => {
    ipcRenderer.send("devtools-open");
  },
  closeDevTools: () => {
    ipcRenderer.send("devtools-close");
  },
  toggleDevTools: () => {
    ipcRenderer.send("devtools-toggle");
  },
  log: {
    info: (message: string, ...args: any[]) =>
      ipcRenderer.invoke("log", "info", message, ...args),
    warn: (message: string, ...args: any[]) =>
      ipcRenderer.invoke("log", "warn", message, ...args),
    error: (message: string, ...args: any[]) =>
      ipcRenderer.invoke("log", "error", message, ...args),
    debug: (message: string, ...args: any[]) =>
      ipcRenderer.invoke("log", "debug", message, ...args),
  },
});
