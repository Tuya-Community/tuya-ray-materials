/* eslint-disable one-var */
import _ from 'lodash';
import { getSystemInfoSync } from 'ray';

export interface ThemeValue {
  rangeType: 'blank' | 'bool' | 'enum';
  type: string;
  value: {
    initialize: string;
  };
}

export interface CloudConfig {
  jump_url?: {
    code: 'jump_url';
    description: string;
    name: string;
    selected: boolean;
  };
  timer?: {
    code: 'timer';
    description: string;
    name: string;
    selected: boolean;
  };
}

export interface GlobalConfig {
  background: string;
  fontColor: string;
  themeColor: string;
}

export interface IoTPublicConfig {
  background?: ThemeValue;
  cloud?: CloudConfig;
  dps?: any;
  fontColor?: ThemeValue;
  global: GlobalConfig;
  theme: 'default' | 'light';
  themeColor?: ThemeValue;
  themeImage?: ThemeValue;
  subUiId?: string;
  timestamp?: number;
  other?: Record<string, any>;
}

const { windowWidth: width, windowHeight: height } = getSystemInfoSync();

const getY = (k: number, x: number) => k * (x - width / 2) + height / 2;
const getX = (k: number, y: number) => (y - height / 2) / k + width / 2;

const getCoords = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  let x1: any, y1: any, x2: any, y2: any;
  const k1 = height / width;
  const k2 = -k1;
  const k = Math.tan(rad);
  if (deg === 0) {
    x1 = 0;
    y1 = 0;
    x2 = width;
    y2 = 0;
  } else if (deg < 90) {
    y1 = 0;
    x1 = getX(k, y1);
    y2 = height;
    x2 = getX(k, y2);
    if (k < k1) {
      x1 = 0;
      y1 = getY(k, x1);
      x2 = width;
      y2 = getY(k, x2);
    }
  } else if (deg === 90) {
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = height;
  } else if (deg < 180) {
    y1 = 0;
    x1 = getX(k, y1);
    y2 = height;
    x2 = getX(k, y2);
    if (k > k2) {
      x1 = width;
      y1 = getY(k, x1);
      x2 = 0;
      y2 = getY(k, x2);
    }
  } else if (deg === 180) {
    x1 = width;
    y1 = 0;
    x2 = 0;
    y2 = 0;
  } else if (deg < 270) {
    x1 = width;
    y1 = getY(k, x1);
    x2 = 0;
    y2 = getY(k, x2);
    if (k > k1) {
      y1 = height;
      x1 = getX(k, y1);
      y2 = 0;
      x2 = getX(k, y2);
    }
  } else if (deg === 270) {
    x1 = 0;
    y1 = height;
    x2 = 0;
    y2 = 0;
  } else {
    x1 = 0;
    y1 = getY(k, x1);
    x2 = width;
    y2 = getY(k, x2);
    if (k < k2) {
      y1 = height;
      x1 = getX(k, y1);
      y2 = 0;
      x2 = getX(k, y2);
    }
  }
  x1 += '';
  y1 += '';
  x2 += '';
  y2 += '';
  return {
    x1,
    y1,
    x2,
    y2,
  };
};

export const getUIValue = (theme: IoTPublicConfig, key: string, state?: string) => {
  const stateMap = {
    true: 'on',
    false: 'off',
  };
  const globalConfig = theme?.global || {};
  const dps = theme?.dps || {};
  const timestamp = theme?.timestamp || '0';
  const themeItem = _.get(theme, key) || _.get(dps, key);

  let val;
  if (themeItem) {
    const { rangeType, value, type } = themeItem;
    switch (rangeType) {
      case 'bool':
        // @ts-ignore
        val = value[stateMap[state!]];
        break;

      case 'blank':
        val = value.initialize;
        break;

      case 'enum':
        val = value[state!];
        break;

      default:
        break;
    }
    if (val !== undefined) {
      if (type === 'color') {
        if (val.push) {
          val = val[0];
        } else {
          const valS = Object.values(val);
          if (valS.length === 1) {
            val = valS[0];
          }
          if (valS.length > 2) {
            const { deg, r, ...bg } = val;
            const _bg = Object.keys(bg).reduce((item, k) => {
              // @ts-ignore
              item[`${k}%`] = bg[k]; // eslint-disable-line
              return item;
            }, {});
            let coords = getCoords(deg);
            if (r !== undefined) {
              // @ts-ignore
              coords = { r: `${r}` };
            }
            val = {
              // @ts-ignore
              x1: '50%',
              ..._bg,
              ...coords,
            };
          }
        }
      } else if (type === 'image') {
        val = {
          uri: `${val}?t=${timestamp}`,
        };
      }
    }
  }

  if (val === undefined) {
    // @ts-ignore
    val = globalConfig[key];
  }

  return val;
};
