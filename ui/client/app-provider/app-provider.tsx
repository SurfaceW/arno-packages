'use client';

import React, { useEffect } from 'react';

import { getLogger } from '@arno/client';
import { assignLogLevels, LogEntries } from '@arno/shared';

export type AppContextData<ExtraContext = {}> = ExtraContext & {
  getLogger: typeof getLogger;
  logLevelMap?: LogEntries;
};

/**
 * App General Context
 * - getLogger: get logger with namespace
 * - logLevelMap: set log-level for client side with defined ns and log-level
 */
export const AppContext = React.createContext<AppContextData>({
  getLogger,
  logLevelMap: {},
});

export const AppClientProvider: React.FC<{
  /**
   * set log-level for client side with defined ns and log-level
   */
  logLevelMap?: LogEntries;
  children: React.ReactNode;
  appContext?: AppContextData<unknown>;
}> = ({ children, logLevelMap, appContext }) => {
  useEffect(() => {
    if (logLevelMap) {
      assignLogLevels(logLevelMap);
    }
  }, [logLevelMap]);
  return (
    <AppContext.Provider value={{ getLogger, logLevelMap, ...(appContext || {}) }}>
      {children}
    </AppContext.Provider>
  );
};