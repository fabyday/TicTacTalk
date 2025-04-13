import { contextBridge, ContextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("audio", {
  audioData: (callback: (data: ArrayBuffer) => void) => {
    ipcRenderer.on("opus-data", (_, data) => callback(data));
  },
});
