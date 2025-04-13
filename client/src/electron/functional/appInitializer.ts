import { WindowManager } from "../manager/windowManager";

export async function initializeApp() {
  await initializeManager();
  await initializeHandler();
}

async function initializeManager() {
  await ConfigureManager.getInstance();
  await WindowManager.getInstance();
}

async function initializeHandler() {}
