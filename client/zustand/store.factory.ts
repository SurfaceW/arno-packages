/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { create } from 'zustand';

const localMap = new Map<string, ReturnType<ReturnType<typeof create>>>();
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore easier for local debugging
  window.__ZUSTAND_STORE_MAP__ = localMap;
}

/**
 * @example example usage:
 * const usSampleStore = (storeId: string, storeFns: { destroy: () => void }) => {
 *   return create()(
 *   composedMiddlewares<SampleStoreState>(
 *     (set, get) => ({
 *       ...
 *     })
 *   )
 * );
 * export const usePromptBlockStoreFactory =
  createZustandStoreFactory<ReturnType<typeof usSampleStore>>(usSampleStore);
 */
export const createZustandStoreFactory = <T>(storeCreateFn: (uid: string, storeFn: {
  destroy: () => void;
}) => any) => {
  return (uid: string) => {
    if (localMap.has(uid)) {
      return localMap.get(uid) as T;
    }
    localMap.set(uid, storeCreateFn(uid, {
      destroy: () => {
        localMap.delete(uid);
      }
    }) as any);
    return localMap.get(uid) as T;
  }
}