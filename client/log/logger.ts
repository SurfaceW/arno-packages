import { LogEntries, getLogLevel, isBrowserContext } from '@arno/shared';
import pino, { Logger, LoggerOptions } from 'pino';

type PinoLogObjType = {
  msg: string;
  time: string;
  level: number;
};

/**
 * Get a logger use pino
 * @doc https://github.com/pinojs/pino/blob/ba5ab33bfa9738b6ccd96f2647e08edbcf9a6358/docs/ecosystem.md
 * @param name namespace of logger
 * @example
 * ```
 * const lg = getLogger('im');
 * lg.error('oops: crashed');
 * lg.info('hello world %s %d %f %o:', 'string', 1, 1.1, { a: 1 });
 * ```
 */
export function getLogger<LogNSlevelConfig extends LogEntries = any>(
  name: keyof LogNSlevelConfig,
  options?: {
    pinoConfigs?: LoggerOptions;
  }
): Logger {
  const pinoConfig = { name: name as string, level: getLogLevel((name as string) || '*') };
  const isBrowser = isBrowserContext();
  return pino(
    {
      ...pinoConfig,
      browser: {
        // browser output control
        // @see https://github.com/pinojs/pino/blob/HEAD/docs/browser.md#browser-api
        asObject: isBrowser,
        write: {
          trace: function (o) {
            console.trace(`[${new Date((o as PinoLogObjType).time).toLocaleString()}] ${(o as PinoLogObjType).msg}`);
          },
          info: function (o) {
            console.info(`[${new Date((o as PinoLogObjType).time).toLocaleString()}] ${(o as PinoLogObjType).msg}`);
          },
          warn: function (o) {
            console.warn(`[${new Date((o as PinoLogObjType).time).toLocaleString()}] ${(o as PinoLogObjType).msg}`);
          },
          error: function (o) {
            console.error(`[${new Date((o as PinoLogObjType).time).toLocaleString()}] ${(o as PinoLogObjType).msg}`);
          },
          fatal: function (o) {
            console.error(`[${new Date((o as PinoLogObjType).time).toLocaleString()}] %c${(o as PinoLogObjType).msg}`, 'font-weight: bold;');
          }
        }
      },
      ...options?.pinoConfigs,
    }
  );
}