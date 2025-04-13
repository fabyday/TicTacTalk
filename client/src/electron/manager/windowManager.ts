import { BrowserWindow } from "electron";
import path from "path";

export class WindowManager {
  private WindowManager() {}
  protected static __instance: WindowManager | null = null;

  private m_window: BrowserWindow | null = null;
  static async getInstance() {
    if (WindowManager.__instance == null) {
      WindowManager.__instance = new WindowManager();
      WindowManager.__instance.initialize();
    }
    return WindowManager.__instance;
  }

  protected async initialize() {}

  protected async createWindow(): Promise<BrowserWindow> {
    if (this.m_window == null) {
      this.m_window = new BrowserWindow({
        titleBarStyle: "hidden",
        width: 1280,
        height: 800,
        transparent: true, // 핵심!
        frame: false,
        webPreferences: {
          preload: path.join(__dirname, "preload.js"),
        },
      });
      this.m_window.setMenu(null);
      this.m_window.loadFile(path.join(__dirname, "renderer/renderer.html"));
    }

    if (process.env.DEBUG) {
      this.m_window.webContents.openDevTools({ mode: "detach" });
    }

    return this.m_window;
  }

  async getWindow(): Promise<BrowserWindow> {
    if (this.m_window == null) {
      return await this.createWindow();
    }
    return this.m_window;
  }
}
