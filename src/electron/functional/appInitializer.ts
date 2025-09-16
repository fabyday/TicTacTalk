import { BrowserWindow, ipcMain } from "electron";
import { WindowManager } from "../manager/windowManager";
import { ConfigureManager } from "../manager/configureManager";
import path from "path";
import { LogManager } from "../manager/LogManager";
import {
  addDevToolHandler,
  addWinColseHandler,
  addWinMaxHandler,
  addWinMinHandler,
} from "./ipcHandler";

export async function initializeApp() {
  // preInit... manager and so on.
  await _initializeBeforeCreateWindow();

  // create Main Window
  const win = await _createWindow();

  // init MainWindow dependent job(ex... handler)
  await _inittializeAfterCreateWindow(win);
}

export async function beforeInitializeApp() {
  LogManager.getInstance();
}

export async function afterInitializeApp() {}

async function _initializeManager() {
  await ConfigureManager.getInstance();

  await WindowManager.getInstance();
}

async function _createWindow(): Promise<BrowserWindow> {
  return (await WindowManager.getInstance()).getWindow();
}

async function _initializeBeforeCreateWindow() {
  await _initializeManager();
}

async function _inittializeAfterCreateWindow(target: BrowserWindow) {
  await _initializeWindowHandler(target);
}

async function _initializeWindowHandler(win: BrowserWindow) {
  addWinColseHandler(win);
  addWinMaxHandler(win);
  addWinMinHandler(win);

  addDevToolHandler(win);
}

async function initializeAppData() {}
