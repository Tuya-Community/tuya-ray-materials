import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';

export const isInIDE = getCachedSystemInfo().brand === 'devtools';
