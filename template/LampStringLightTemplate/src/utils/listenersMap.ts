import { getArray } from './kit';

const listenersMap: Map<string, VoidFunction[]> = new Map();

export const updateKey = (key: string, map: (val: any[]) => any[]) => {
  const value = listenersMap.get(key);
  listenersMap.set(key, map(getArray(value)));
};

export const dispatch = (key: string) => {
  const listeners = listenersMap.get(key);
  getArray(listeners).forEach(l => l());
};
