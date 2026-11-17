import { router } from '@ray-js/ray';

export type HomeEntry = 'alarm' | 'records' | 'openMode' | 'lock' | 'set';

/** 首页各功能入口。 */
const entryRoutes: Record<HomeEntry, string> = {
  alarm: '/alarm',
  records: '/records',
  openMode: '/openMode',
  lock: '/lock',
  set: '/set',
};

export function openHomeEntry(entry: HomeEntry) {
  router.push(entryRoutes[entry]);
}
