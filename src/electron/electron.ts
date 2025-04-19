import { app, BrowserWindow, ipcMain } from "electron";
import * as dgram from "dgram";
import * as path from "path";
import * as npth from "./functional/native_path";
import { initializeApp } from "./functional/appInitializer";
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    titleBarStyle: "hidden",
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMenu(null);
  win.loadFile(path.join(__dirname, "renderer/renderer.html"));
  if (process.env.DEBUG) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(async () => {
  initializeApp();
  createWindow();
  
});
