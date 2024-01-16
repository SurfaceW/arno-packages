import { create } from 'zustand';

export const createZustandStoreFactory = <T>(storeCreateFn: (uid: string) => ReturnType<typeof create>) => {
  const localMap = new Map<string, ReturnType<ReturnType<typeof create>>>();
  return (uid: string) => {
    if (localMap.has(uid)) {
      return localMap.get(uid) as T;
    }
    localMap.set(uid, storeCreateFn(uid));
    return localMap.get(uid) as T;
  }
}