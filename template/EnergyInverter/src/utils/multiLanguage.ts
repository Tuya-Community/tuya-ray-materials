import Strings from '@/i18n';

// 多语言动态参数
export const I18nDyParam = (I18nStr, DyParam) => {
  let str = Strings.getLang(`${I18nStr}${DyParam}`);
  if (str.includes(`${I18nStr}`)) {
    // 未找到对应多语言
    str = '';
  }
  return str;
};
