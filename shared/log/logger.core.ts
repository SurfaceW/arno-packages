export type Log4j = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogEntries = Record<string, Log4j>;

/**
 * production environment log level with ns config
 */
const logLevelData: LogEntries = {
  '*': 'info',
  app: 'error',
  // wait for override by biz service
};

/**
 * development environment log level with ns config
 */
const logLevelDevData: Partial<typeof logLevelData> = {
  '*': 'info',
  app: 'debug',
  // wait for override by biz service
};

const logLevelsEntries = new Map<string, Log4j | undefined>(
  Object.entries(
    process.env.NODE_ENV === 'development'
      ? {
          ...logLevelData,
          ...logLevelDevData,
        }
      : logLevelData
  )
);

export function getLogLevel(loggerBizNS?: string): string {
  return logLevelsEntries.get(loggerBizNS || '') || logLevelsEntries.get('*') || 'info';
}

/**
 * Assign and setup log levels for biz service
 * ```ts
 * assignLogLevels({
 *  'im': 'debug',
 *  'im:chat': 'info',
 * });
 * ```
 */
export function assignLogLevels(loggerBizNS: LogEntries) {
  Object.entries(loggerBizNS).forEach(([ns, level]) => {
    logLevelsEntries.set(ns, level);
  });
  return logLevelsEntries;
}


