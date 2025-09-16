// logger/index.ts
interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

const isElectronRenderer = () => {
  return (
    typeof window !== "undefined" &&
    window.process &&
    window.process.type === "renderer"
  );
};

const createLogger = (): Logger => {
  if (isElectronRenderer()) {
    // Electron 렌더러 - IPC 통해 메인 프로세스로 전달
    return {
      info: (msg, ...args) =>
        window.electronAPI?.log.info(msg, ...args) ||
        console.info(msg, ...args),
      warn: (msg, ...args) =>
        window.electronAPI?.log.warn(msg, ...args) ||
        console.warn(msg, ...args),
      error: (msg, ...args) =>
        window.electronAPI?.log.error(msg, ...args) ||
        console.error(msg, ...args),
      debug: (msg, ...args) =>
        window.electronAPI?.log.debug(msg, ...args) ||
        console.debug(msg, ...args),
    };
  } else {
    // On Web Environment
    return {
      info: (msg, ...args) => console.info(`[INFO] ${msg}`, ...args),
      warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
      error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
      debug: (msg, ...args) => console.debug(`[DEBUG] ${msg}`, ...args),
    };
  }
};

export const logger = createLogger();
