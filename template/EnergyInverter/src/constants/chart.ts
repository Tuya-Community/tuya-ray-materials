import Strings from '@/i18n';

export const OVERVIEW = 'overview';
export const PRODUCE = 'produce';
export const USAGE = 'usage';
export const BATTERY = 'battery';

export const INITIAL_DATATYPE = OVERVIEW;

export const DATA_TABS = [
  { title: Strings.getLang('totalOutput'), type: PRODUCE },
  { title: Strings.getLang('typeOverview'), type: OVERVIEW },
  { title: Strings.getLang('typeUsage'), type: USAGE },
  { title: Strings.getLang('typeBattery'), type: BATTERY },
];

export const ELE_PRODUCE_USAGE = 'ele_produce_usage'; // 发电-用电量: 发电量-充电量-并网量
export const ELE_PRODUCE_STORE = 'ele_produce_store'; // 发电-充电量

export const ELE_USAGE_DISCHARGE = 'ele_store_discharge'; // 用电-放电量
export const ELE_USAGE_PRODUCE = 'ele_usage_produce'; // 用电-发电量: 总用电量-来自购电量-来自放电量

export const ELE_STORE_PERCENT = 'ele_store_percent'; // 电池百分比
export const ELE_STORE_SOC = 'ele_store_soc'; // 电池百分比

export const ELE_PRODUCE = 'ele_produce'; // 累计发电量
export const ELE_SELFUSE_CAL = 'ele_selfuse_cal'; // 自发自用
export const ELE_PRODUCE_GRIDCN = 'ele_produce_gridcn'; // 发电-并网量

export const ELE_USAGE = 'ele_usage'; // 累计用电量
export const ELE_SELFSUFFICIENCY_CAL = 'ele_selfsufficiency_cal'; // 自给自足
export const ELE_USAGE_PURCHASE = 'ele_purchase'; // 用电-购电量

export const PORTRAIT = 'portrait';
export const LANDSCAPE = 'landscape';

export const INITIAL_LC_DATA_LIST = [
  {
    type: Strings.getLang('co2Title'),
    value: 0,
    unit: Strings.getLang('co2Unit'),
    path: '/res/images/chart/co2.png',
  },
  {
    type: Strings.getLang('treeTitle'),
    value: 0,
    unit: Strings.getLang('treeUnit'),
    path: '/res/images/chart/tree.png',
  },
  {
    type: Strings.getLang('coalTitle'),
    value: 0,
    unit: Strings.getLang('coalUnit'),
    path: '/res/images/chart/coal.png',
  },
  {
    type: Strings.getLang('electricityTitle'),
    value: 0,
    unit: Strings.getLang('electricityUnit'),
    path: '/res/images/chart/electricity.png',
  },
];
