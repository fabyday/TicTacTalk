import * as dgram from "dgram";
import { WindowManager } from "./windowManager";
import {
  applyOptionToLogger,
  createLogger,
  LoggerOption,
  LogLevel,
} from "../logger";
import Logger, { MainLogger } from "electron-log";

export class LogManager {
  protected static __instance: LogManager | null = null;
  /**
   * default level is info
   */

  private m_log_map: Map<string, MainLogger>;
  private constructor() {
    this.m_log_map = new Map();
  }
  static async getInstance() {
    if (LogManager.__instance) {
      LogManager.__instance = new LogManager();
    }
    return LogManager.__instance;
  }

  /**
   * set default logger
   */
  public setLoggerAttributes(logger?: MainLogger, options?: LoggerOption) {
    if (typeof options === "undefined") {
      return; // do nothing if options is undefined.
    }

    if (typeof logger === "undefined") {
      // if logger is undefined, default logger will set options
      applyOptionToLogger(Logger.default, options);
    } else {
      applyOptionToLogger(logger, options);
    }
  }

  private _addLoggerToMap(logger: MainLogger) {
    if (!this.m_log_map.has(logger.logId)) {
      this.m_log_map.set(logger.logId, logger);
    } else {
      //raise error
      throw Error("trest");
    }
  }

  /**
   *
   * @param logId
   * logId. If LogId isn't existed on Map,
   * then manager create new logger for Id.
   * @param autoCreationFlag
   * if atuoCreationFlag is false, it raise Exception
   */
  getLogger(logId?: string, autoCreationFlag: boolean = true) {
    if (typeof logId === "undefined") {
      return Logger.default;
    }
    let selLogger = this.m_log_map.get(logId);
    if (typeof selLogger === "undefined" && autoCreationFlag) {
      selLogger = createLogger(logId, {});
      this._addLoggerToMap(selLogger);
    } else {
      throw Error("logger not found");
    }
    return selLogger;
  }
}
