import { LogEntries, getLogLevel, isBrowserContext } from '@arno/shared';
import pino, { Logger, LoggerOptions } from 'pino';
import pretty, { PrettyOptions } from 'pino-pretty';

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
    pinoPrettyConfigs?: PrettyOptions;
  }
): Logger {
  const pinoConfig = { name: name as string, level: getLogLevel((name as string) || '*') };
  const prettyStream = pretty({
    colorize: true,
    translateTime: true,
    include: 'level,time',
    destination: 1,
    sync: true, // by default we write asynchronously
    append: true, // the file is opened with the 'a' flag
    mkdir: true, // create the target destination
    ...options?.pinoPrettyConfigs,
  });
  return pino(
    {
      ...pinoConfig,
      ...options?.pinoConfigs,
    },
    prettyStream
  );
}