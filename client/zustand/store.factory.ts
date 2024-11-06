import { create } from 'zustand';

export const createZustandStoreFactory = <T>(storeCreateFn: (uid: string, storeFn: {
  destroy: () => void;
}) => any) => {
  const localMap = new Map<string, ReturnType<ReturnType<typeof create>>>();
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