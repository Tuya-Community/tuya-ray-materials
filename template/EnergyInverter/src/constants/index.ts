import Strings from '@/i18n';

export * from './chart';

export const DAY = 'day';
export const WEEK = 'week';
export const MONTH = 'month';
export const YEAR = 'year';

export const TIME_FORMAT_TEMPLATE_MAP = {
  [DAY]: 'MM/DD',
  [WEEK]: 'MM/DD',
  [MONTH]: 'YYYY/MM',
  [YEAR]: 'YYYY',
};

export const dateTypeOptions = [
  {
    type: DAY,
    name: Strings.getLang(DAY),
  },
  {
    type: WEEK,
    name: Strings.getLang(WEEK),
  },
  {
    type: MONTH,
    name: Strings.getLang(MONTH),
  },
  {
    type: YEAR,
    name: Strings.getLang(YEAR),
  },
];

export const initialDateTypeActive = DAY;

export const HOUR = 'hour';

export const DATETYPE_API_CONFIG = {
  [DAY]: {
    dateType: HOUR,
    timeFormatTemplate: 'YYYYMMDDHH',
  },
  [WEEK]: {
    dateType: DAY,
    timeFormatTemplate: 'YYYYMMDD',
  },
  [MONTH]: {
    dateType: DAY,
    timeFormatTemplate: 'YYYYMMDD',
  },
  [YEAR]: {
    dateType: MONTH,
    timeFormatTemplate: 'YYYYMM',
  },
};

export const CHART_CONFIG = {
  [DAY]: {
    intervalSize: 20,
    intervalRadius: 0,
    stageLabelFormatTemplate: 'HH',
  },
  [WEEK]: {
    intervalSize: 14,
    intervalRadius: 0,
    stageLabelFormatTemplate: 'MM/DD',
  },
  [MONTH]: {
    intervalSize: 3,
    intervalRadius: 0,
    stageLabelFormatTemplate: 'DD',
  },
  [YEAR]: {
    intervalSize: 8,
    intervalRadius: 0,
    stageLabelFormatTemplate: 'MM',
  },
};

export const DateTag = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const RANGE_STATUS_PENDDING = 'pendding';
export const RANGE_STATUS_START = 'begin';
export const RANGE_STATUS_END = 'end';

export const AlarmCode = {
  unresolved: 1,
  released: 0,
};

export const AlarmIconPath = {
  releasedIcon: '/res/images/icon/released_icon.png',
  unresolvedIcon: '/res/images/icon/unresolved_icon.png',
  alarmIcon: '/res/images/icon/alarm_icon.png',
  faultIcon: '/res/images/icon/fault_icon.png',
  rightGreenIcon: '/res/images/icon/rightGreen_icon.png',
};

const API_SETTING_MAP = {
  InverterWorkModeSetting: 'inverter_work_mode_setting',
};

const DateAction = {
  SUBTRACT: 'subtract',
  ADD: 'add',
};

const IndicatorCodes = {
  EleProduceCost: 'ele_produce_cost',
  EleProduceGridcnCost: 'ele_produce_gridcn_cost',
};

const DeviceDataMultipleDate = {
  BeginDate: '20221020',
};

const PowerUnit = {
  W: 'W',
  KW: 'kW',
  MW: 'MW',
  GW: 'GW',
};

export { API_SETTING_MAP, DateAction, IndicatorCodes, DeviceDataMultipleDate, PowerUnit };
