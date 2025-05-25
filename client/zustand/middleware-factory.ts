import { create, type StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { zustandLogger } from './log.middle-ware';

export type StateCreatorFnType<T = any> = StateCreator<
  T,
  [['zustand/devtools', never]],
  []
>;

export const composedMiddlewares = <T extends object>(
  f: StateCreatorFnType<T>,
  storeName: string,
) => {
  return devtools(zustandLogger(immer(f as any), storeName)) as any;
};

export const composedPersistMiddlewares = (f: StateCreatorFnType, storeName: string) => {
  return devtools(persist(zustandLogger(immer(f), storeName), { name: storeName })) as any;
};

