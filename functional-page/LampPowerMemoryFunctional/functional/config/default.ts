/*
 * @Author: mjh
 * @Date: 2024-12-25 16:06:48
 * @LastEditors: mjh
 * @LastEditTime: 2025-03-18 17:22:20
 * @Description:
 */
import res from '@/res';
import Strings from '../i18n';
export const getDefaultMemoryMode = () => [
  {
    mode: '1',
    icon: res.powerMemory1,
    title: Strings.getLang('lpmf_recoverMemory'),
    desc: Strings.getLang('lpmf_recoverMemory_desc'),
  },
  {
    mode: '0',
    icon: res.powerMemory0,
    title: Strings.getLang('lpmf_initialMemory'),
    desc: Strings.getLang('lpmf_initialMemory_desc'),
  },
  {
    mode: '2',
    title: Strings.getLang('lpmf_customMemory'),
    desc: Strings.getLang('lpmf_customMemory_desc'),
  },
];

export const defaultColors = [
  { hue: 0, saturation: 1000, value: 1000 },
  { hue: 120, saturation: 1000, value: 1000 },
  { hue: 240, saturation: 1000, value: 1000 },
];
export const defaultWhite = [
  { temperature: 0, brightness: 1000 },
  { temperature: 500, brightness: 1000 },
  { temperature: 1000, brightness: 1000 },
];

export const defaultWhiteC = [{ brightness: 10 }, { brightness: 500 }, { brightness: 1000 }];
