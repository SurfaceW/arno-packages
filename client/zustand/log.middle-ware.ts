import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type Logger = <
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
    console.groupCollapsed(`[Store][${name}] updated with args`, args);
    console.log(`store update to:`, get());
    console.trace('updated function trace');
    console.groupEnd()
  }
  return f(loggedSet, get, store)
}

/**
 * A logger middleware for zustand.
 * 
 * - support grouped / labeled and call trace of store update
 */
export const zustandLogger = loggerImpl as unknown as Logger;
