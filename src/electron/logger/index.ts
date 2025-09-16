import Logger, { LogFunctions, MainLogger } from "electron-log";
import path from "path";

export type LogLevel = Logger.LogLevel;

//This script is collection of helper functions.

/**
 * foramt detail
 *
 * seealso
 *  https://github.com/megahertz/electron-log/blob/46a6de343c8b691714025a994420d6d3aeafa1f7/docs/transports/format.md
 */
export interface LoggerFileOption {
  fileFormat?: string;
  path?: string;
  level?: LogLevel;
}

export interface ConsoleLoggerOption {
  level?: LogLevel;
  consoleFormat?: string;
}

export interface LoggerOption {
  file?: LoggerFileOption;
  console?: ConsoleLoggerOption;
}

/**
 * helper function for logger creation
 * @param logId logger Id
 * @param options option
 * @see applyOptionToLogger
 * @returns
 */
export function createLogger(logId: string, options: LoggerOption) {
  const logger = Logger.create({ logId: logId });
  applyOptionToLogger(logger, options);
  return logger;
}

/**
 *
 * @param logger
 * @param options
 */

export function applyOptionToLogger(logger: MainLogger, options: LoggerOption) {
  if (typeof options.console !== "undefined") {
    _applyConsoleOptionToLogger(logger, options.console);
  }
  if (typeof options.file !== "undefined") {
    _applyFileOptionToLogger(logger, options.file);
  }
}

function _applyConsoleOptionToLogger(
  logger: MainLogger,
  options: ConsoleLoggerOption
) {}

function _applyFileOptionToLogger(
  logger: MainLogger,
  options: LoggerFileOption
) {
  if (typeof options.fileFormat !== "undefined") {
    logger.transports.file.format = options.fileFormat;
  }
  logger.transports.file.level = options.level ?? "info";
  if (typeof options.path !== "undefined") {
    const opt_pth = options.path;
    logger.transports.file.resolvePathFn = () => opt_pth;
  }
}
