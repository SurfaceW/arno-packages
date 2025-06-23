import { create, type StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { zustandLogger } from './log.middle-ware';

export type StateCreatorFnType<T = any> = StateCreator<
  T,
  [['zustand/devtools', never], ['zustand/persist', unknown], ['zustand/immer', never]],
  [],
  T
>;

export const composedMiddlewares = <T extends object>(
  f: StateCreator<T, [], [], T>,
  storeName: string,
) => {
  // Use type assertion to bypass the complex middleware type issues
  return devtools(zustandLogger(immer(f as any), storeName), { name: storeName }) as any;
};

export const composedPersistMiddlewares = <T extends object>(
  f: StateCreator<T, [], [], T>,
  storeName: string
) => {
  // Use type assertion to bypass the complex middleware type issues
  return devtools(persist(zustandLogger(immer(f as any), storeName), { name: storeName }), { name: storeName }) as any;
};

