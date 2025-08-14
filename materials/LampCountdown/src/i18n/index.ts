import { kit } from '@ray-js/panel-sdk';
import Strings from './strings';
const { I18N } = kit;

const i18n = new I18N(Strings);

const oldGetLang = i18n.getLang;
const oldFormatValue = i18n.formatValue;

i18n.getLang = (key: keyof (typeof Strings)['zh']) => {
  const _key = key;
  return oldGetLang.call(i18n, _key);
};

i18n.formatValue = (key: keyof (typeof Strings)['zh'], ...args: any[]) => {
  const _key = key;
  return oldFormatValue.call(i18n, _key, ...args);
};

export default i18n;
