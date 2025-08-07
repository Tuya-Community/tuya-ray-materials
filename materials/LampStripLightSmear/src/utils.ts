/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { getSystemInfoSync } from '@ray-js/ray';

type TPathData = {
  x: number;
  y: number;
  type: TLineType;
  endX?: number;
  endY?: number;
  diameter?: number; // lineCircle 和 circleLine 专用
  width?: number; // 色带的宽度
  length?: number; // 灯带较长的长度
  shortLength?: number; // 灯带较短的长度
};

// canvas 绘制的初始位置
type TInitPos = {
  x?: number;
  y?: number;
  diameter?: number;
  width?: number; // 色带的宽度
  checked?: boolean; // 是否选中
};

enum TLineType {
  leftCircleLine = 'leftCircleLine',
  rightCircleLine = 'rightCircleLine',
  lastCircleLine = 'lastCircleLine',
  horizontalLeftLine = 'horizontalLeftLine',
  horizontalRightLine = 'horizontalRightLine',
}

type TInitData = TInitPos & {
  screenWidth?: number;
  screenHeight?: number;
  lineLength?: number; // 单独横向灯带长度
  length?: number; // 圆弧带较长的直线长度
  shortLength?: number; // 圆弧带较短的直线长度
  width?: number; // 灯带的宽度
  power?: boolean; // 开关是否打开，开关时灯带颜色不一样
  lightColorMaps: { [idx: number]: string }; // 选中的灯带颜色
  checkedSet: Set<number>; // 选中的灯带索引
  isGradient?: boolean; // 是否是渐变
};

// 获取色带的颜色数据
const preData: {
  initData: TInitData;
  lightNum: number;
} = {} as any;

let pathPosData = null;
const checkSet = new Set<number>();

const { windowWidth = 375 } = getSystemInfoSync();

const defaultProps = {
  screenWidth: windowWidth,
  screenHeight: 300,
  lineLength: 34,
  length: 22,
  shortLength: 11,
  x: 186,
  y: 18,
  width: 10,
  diameter: 30,
  power: true,
  checkedSet: checkSet,
};

// 获取每个位置的灯带类型
const getSharpType = (idx: number, lightNum): TLineType => {
  // 最后一个
  if (idx + 1 === lightNum) {
    return TLineType.lastCircleLine;
  }
  // 左侧灯
  if (idx % 4 === 1) {
    return TLineType.leftCircleLine;
  }
  // 水平位置灯右边开始
  // 0 4 8 12
  if (idx % 4 === 0) {
    return TLineType.horizontalRightLine;
  }
  // 水平位置灯左边开始
  // 2 6 10 14
  if ((idx - 2) % 4 === 0) {
    return TLineType.horizontalLeftLine;
  }
  // 右侧灯
  return TLineType.rightCircleLine;
};

// 获取色带位置数据
export const getSharpPathPosData = (lightNum: number, _initData: TInitData): TPathData[] => {
  const { diameter, width } = _initData;
  const offsetDistance = 10; // 两个相邻图形的间隙
  let prePathData = null;
  const border = 1;
  // 思路为获取上一个的位置信息，动态计算下一个的位置信息， 根据逻辑获取图形的类型
  const pathData: TPathData[] = new Array(lightNum).fill(1).map((_, idx) => {
    const _idx = idx;
    const sharpType: TLineType = getSharpType(_idx, lightNum);
    // 水平右始位置灯
    // 0 4 8 12
    if (sharpType === TLineType.horizontalRightLine) {
      let { x, y } = _initData;
      const { lineLength } = _initData;
      if (prePathData) {
        x = prePathData.endX - offsetDistance;
        y = prePathData.endY;
      }
      const endX = x - lineLength;
      const endY = y;
      const rightLine = {
        x,
        y,
        endX,
        endY,
        type: sharpType,
        width,
        border,
        idx: _idx,
      };
      prePathData = rightLine;
      return rightLine;
    }
    // 水平左始位置灯
    // 2 6 10 14
    if (sharpType === TLineType.horizontalLeftLine) {
      let { x, y } = _initData;
      const { lineLength } = _initData;
      if (prePathData) {
        x = prePathData.endX + offsetDistance;
        y = prePathData.endY;
      }
      const endX = x + lineLength;
      const endY = y;
      const leftLine = {
        x,
        y,
        endX,
        endY,
        type: sharpType,
        width,
        border,
        idx: _idx,
      };

      prePathData = leftLine;
      return leftLine;
    }
    // 左侧灯
    if (sharpType === TLineType.leftCircleLine) {
      let { x, y } = _initData;
      const { length, shortLength } = _initData;
      if (prePathData) {
        // 首次渲染
        x = prePathData.endX - offsetDistance;
        y = prePathData.endY;
      }
      const endX = x - (length - shortLength);
      const endY = y + diameter;
      const leftCircleLine = {
        x,
        y,
        endX,
        endY,
        length,
        shortLength,
        type: sharpType,
        diameter: diameter,
        width,
        border,
        idx: _idx,
      };
      prePathData = leftCircleLine;
      return leftCircleLine;
    }

    // 右侧灯
    if (sharpType === TLineType.rightCircleLine) {
      let { x, y } = _initData;
      const { length, shortLength } = _initData;
      if (prePathData) {
        // 首次渲染
        x = prePathData.endX + offsetDistance;
        y = prePathData.endY;
      }
      const endX = x + (length - shortLength);
      const endY = y + diameter;
      const rightCircleLine = {
        x,
        y,
        endX,
        endY,
        length,
        shortLength,
        type: sharpType,
        diameter: diameter,
        width,
        border,
        idx: _idx,
      };
      prePathData = rightCircleLine;
      return rightCircleLine;
    }
    // 最后一个灯
    let { x, y } = _initData;
    const { length, shortLength } = _initData;
    if (prePathData) {
      // 首次渲染
      x = prePathData.endX + offsetDistance;
      y = prePathData.endY;
    }
    const endX = x - (length - shortLength);
    const endY = y + diameter;
    const lastData = {
      x,
      y,
      endX,
      endY,
      length,
      shortLength,
      type: sharpType,
      diameter,
      width,
      border,
      idx: _idx,
    };
    return lastData;
  });
  return pathData;
};

// 获取灯带每个灯珠颜色数据
export const getSharpPathColorData = (_pathPosData: TPathData[], _initData, isGradient = false) => {
  // ！！注意如果 color 为空 则认为是灯珠是关闭
  const { lightColorMaps, checkedSet, power } = _initData;
  if (isGradient) {
    return _pathPosData.map((i, idx) => {
      const preColor = lightColorMaps[idx - 1];
      const color = lightColorMaps[idx];
      const nextColor = lightColorMaps[idx + 1];
      return {
        ...i,
        // 允许添加string或number
        checked: checkedSet.has(`${idx}`) || checkedSet.has(+idx),
        color,
        onOff: color ? power : false,
        preColor: color ? preColor : '',
        nextColor: color ? nextColor : '',
      };
    });
  }
  return _pathPosData.map((i, idx) => {
    const color = lightColorMaps[idx];
    return {
      ...i,
      // 允许添加string或number
      checked: checkedSet.has(`${idx}`) || checkedSet.has(+idx),
      color,
      onOff: color ? power : false,
    };
  });
};

// 获取灯珠具体位置和颜色数据
export const getSharpPathData = (lightNum: number, _initData?: TInitData) => {
  const __initData = {
    ...defaultProps,
    ..._initData,
  };
  const { x = 24, y = 68, isGradient = false } = __initData;
  const isSame =
    preData.lightNum === lightNum && preData.initData.x === x && preData.initData.y === y;
  // 如果初始位置和灯珠数有变化，更新位置列表数据
  if (!pathPosData || !isSame) {
    pathPosData = getSharpPathPosData(lightNum, __initData);
    preData.lightNum = lightNum;
    preData.initData = __initData;
  }
  const pathColorData = getSharpPathColorData(pathPosData, __initData, isGradient);
  return pathColorData;
};

const limit = (number, min, max) => Math.min(max, Math.max(min, number));
const hsv2rgb = (h: number, s: number, v: number, a: number) => {
  const hsb = [h, s, v].map((bit, i) => {
    let _bit = bit;
    if (_bit) _bit = parseFloat(_bit.toString());
    if (i === 0) {
      _bit %= 360;
      const res = _bit < 0 ? _bit + 360 : _bit;
      return res;
    }
    return limit(Math.round(bit), 0, 100);
  });
  const br = Math.round((hsb[2] / 100) * 255);
  if (hsb[1] === 0) return [br, br, br];
  const hue = hsb[0];
  const f = hue % 60;
  const p = Math.round(((hsb[2] * (100 - hsb[1])) / 10000) * 255);
  const q = Math.round(((hsb[2] * (6000 - hsb[1] * f)) / 600000) * 255);
  const t = Math.round(((hsb[2] * (6000 - hsb[1] * (60 - f))) / 600000) * 255);
  let rgb;
  switch (Math.floor(hue / 60)) {
    case 0:
      rgb = [br, t, p];
      break;
    case 1:
      rgb = [q, br, p];
      break;
    case 2:
      rgb = [p, br, t];
      break;
    case 3:
      rgb = [p, q, br];
      break;
    case 4:
      rgb = [t, p, br];
      break;
    default:
      rgb = [br, p, q];
      break;
  }
  if (a !== undefined) {
    rgb.push(limit(Number(a), 0, 1));
  }
  return rgb;
};

const toRgbString = (originRgb, a): string => {
  const len = originRgb.length;
  let alpha;
  if (len === 4) {
    alpha = originRgb.pop();
  }
  const rgb = originRgb.map(item => Math.round(item));
  if (len === 4) {
    rgb.push(alpha);
    return 'rgba('.concat(rgb.join(', '), ')');
  }
  if (a !== undefined && rgb.length === 3) {
    rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
    return 'rgba('.concat(rgb.join(', '), ')');
  }
  return 'rgb('.concat(rgb.join(', '), ')');
};

export const hsv2rgbString = (h: number, s: number, v: number, a?: number): string => {
  const rgb = hsv2rgb(h, s, v, a ?? 1);
  return toRgbString(rgb, a);
};

let _systemInfo = null;
export const getSystemInfoRes = () => {
  if (_systemInfo) {
    return _systemInfo;
  }
  try {
    _systemInfo = getSystemInfoSync();
  } catch (error) {
    console.error(error);
    return {};
  }
  return _systemInfo;
};
