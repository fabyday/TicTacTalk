import { app, BrowserWindow, ipcMain } from "electron";
import * as dgram from "dgram";
import * as path from "path";
import * as npth from "./functional/native_path";
import {
  afterInitializeApp,
  beforeInitializeApp,
  initializeApp,
} from "./functional/appInitializer";

// Opus 디코더 초기화 (동적 로딩)
let OpusDecoder: any = null;
let opusDecoderInstance: any = null;
let win: BrowserWindow;


//App Entry
beforeInitializeApp().then(async () => {
  await app.whenReady();
  await initializeApp();
  await afterInitializeApp();
});
