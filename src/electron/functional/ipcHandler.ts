import { BrowserWindow, ipcMain } from "electron";

export function addWinMinHandler(target: BrowserWindow) {
  ipcMain.on("window-minimize", async () => {
    if (target) {
      target.minimize();
    }
  });
}
export function addWinMaxHandler(target: BrowserWindow) {
  ipcMain.on("window-maximize", () => {
    if (target) {
      if (target.isMaximized()) {
        target.unmaximize();
      } else {
        target.maximize();
      }
    }
  });
}

export function addWinColseHandler(target: BrowserWindow) {
  ipcMain.on("window-close", () => {
    if (target) {
      target.close();
    }
  });
}

export function addDevToolHandler(target: BrowserWindow) {
  // 개발 도구 제어 핸들러
  ipcMain.on("devtools-open", () => {
    if (target) {
      target.webContents.openDevTools({ mode: "detach" });
    }
  });

  ipcMain.on("devtools-close", () => {
    if (target) {
      target.webContents.closeDevTools();
    }
  });

  ipcMain.on("devtools-toggle", () => {
    if (target) {
      if (target.webContents.isDevToolsOpened()) {
        target.webContents.closeDevTools();
      } else {
        target.webContents.openDevTools({ mode: "detach" });
      }
    }
  });
}
