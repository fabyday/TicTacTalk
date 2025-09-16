import { BrowserWindow } from "electron";
import path from "path";

async function createWindow(width?: number, height?: number) {
  let win = new BrowserWindow({
    titleBarStyle: "hidden",
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "images/icon.jpg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMenu(null);
  win.loadFile(path.join(__dirname, "renderer/renderer.html"));
  // if (process.env.DEBUG) {
    win.webContents.openDevTools({ mode: "detach" });
  // }
}
