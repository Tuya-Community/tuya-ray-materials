import { PathPointType } from '@/typings';

// pathHeader占13个字节
export const PATH_HEADER_LENGTH = 13;

export const PATH_POINT_TYPE_MAP: Record<string, PathPointType> = {
  '00': 'common',
  '10': 'charge',
  '01': 'transitions',
  '11': 'mop',
};
