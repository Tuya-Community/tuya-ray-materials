import Strings from '@/i18n';

export const SYSTEM_INFO = 'SYSTEM_INFO';

export const THEME_COLOR = '#37c3ac';

export const CLEAN_RECORDS_PAGE_SIZE = 50;

export const WEEK_MAP = {
  0: Strings.getLang('TYTimer_day0' as any),
  1: Strings.getLang('TYTimer_day1' as any),
  2: Strings.getLang('TYTimer_day2' as any),
  3: Strings.getLang('TYTimer_day3' as any),
  4: Strings.getLang('TYTimer_day4' as any),
  5: Strings.getLang('TYTimer_day5' as any),
  6: Strings.getLang('TYTimer_day6' as any),
} as const;
