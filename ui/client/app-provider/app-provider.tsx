'use client';

import React, { useEffect } from "react";

import { getLogger } from "@arno/client";
import { assignLogLevels, LogEntries } from "@arno/shared";

/**
 * App General Context
 * - getLogger: get logger with namespace
 * - logLevelMap: set log-level for client side with defined ns and log-level
 */
export const AppContext = React.createContext<{
  getLogger: typeof getLogger;
  logLevelMap?: LogEntries;
}>({
  getLogger,
  logLevelMap: {},
});

export const AppClientProvider: React.FC<{
  /**
   * set log-level for client side with defined ns and log-level
   */
  logLevelMap?: LogEntries;
  children: React.ReactNode;
}> = ({ children, logLevelMap }) => {
  useEffect(() => {
    if (logLevelMap) {
      assignLogLevels(logLevelMap);
    }
  }, [logLevelMap]);
  return <AppContext.Provider value={{ getLogger, logLevelMap }}>{children}</AppContext.Provider>;
};
