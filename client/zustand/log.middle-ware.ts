"use client";

import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type ZustandLogger = <
  T extends unknown = unknown,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>

type LoggerImpl = <T extends unknown>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>
  const loggedSet: typeof set = (...args) => {
    set(...args)
    // production should avoid console.log
    if (process.env.NODE_ENV === 'production') return;
    console.groupCollapsed(`📝[Store][${new Date().toLocaleTimeString()}][${name}] changed with:`, args);
    console.log(`store update to:`, get());
    console.trace('updated function trace');
    console.groupEnd()
  }
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore easier for local debugging
    (globalThis?.__ZUSTAND_STORE_MAP__ as Map<string, any>)?.set(name || 'default', store);
  }
  return f(loggedSet, get, store)
}

export type { ZustandLogger };

/**
 * A logger middleware for zustand.
 * 
 * - support grouped / labeled and call trace of store update
 */
export const zustandLogger = loggerImpl as unknown as ZustandLogger;
