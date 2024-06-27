import { create } from 'zustand';

export const createZustandStoreFactory = <T>(storeCreateFn: (uid: string, storeFn: {
  destroy: () => void;
}) => ReturnType<typeof create>) => {
  const localMap = new Map<string, ReturnType<ReturnType<typeof create>>>();
  return (uid: string) => {
    if (localMap.has(uid)) {
      return localMap.get(uid) as T;
    }
    localMap.set(uid, storeCreateFn(uid, {
      destroy: () => {
        localMap.delete(uid);
      }
    }));
    return localMap.get(uid) as T;
  }
}