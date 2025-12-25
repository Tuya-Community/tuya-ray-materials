import { getSystemInfoSync } from 'ray';

const systemInfo = getSystemInfoSync();

export const isInIDE = systemInfo?.brand === 'devtools';
