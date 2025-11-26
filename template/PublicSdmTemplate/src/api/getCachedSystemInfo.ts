import { getSystemInfoSync } from '@ray-js/ray';

type SystemInfo = ReturnType<typeof getSystemInfoSync>;

let systemInfo = null;

export const getCachedSystemInfo = () => {
  if (systemInfo === null) {
    systemInfo = getSystemInfoSync();
  }
  return (systemInfo ?? {}) as SystemInfo;
};
