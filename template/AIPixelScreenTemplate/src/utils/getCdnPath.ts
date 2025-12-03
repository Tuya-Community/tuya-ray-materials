import cdnMap from '../../cdn/cdnImage.json';
import { getCdnUrl } from '@ray-js/ray';

export type CdnImageMapKeys = keyof typeof cdnMap;

export function getCdnPath(path: CdnImageMapKeys): string {
  return getCdnUrl(path as string, cdnMap);
}
