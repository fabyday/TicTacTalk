import { app, BrowserWindow, ipcMain } from "electron";

import {
  afterInitializeApp,
  beforeInitializeApp,
  initializeApp,
} from "./functional/appInitializer";

let win: BrowserWindow;

//App Entry
beforeInitializeApp().then(async () => {
  await app.whenReady();
  await initializeApp();
  await afterInitializeApp();
});
