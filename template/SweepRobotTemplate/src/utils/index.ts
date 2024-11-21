import { devices } from '@/devices';
import Strings from '@/i18n';
import { DpSchema } from '@ray-js/panel-sdk';
import { getDevInfo } from '@ray-js/ray';
import {
  SPOT_CLEAN_CMD_ROBOT_V1,
  SPOT_CLEAN_CMD_ROBOT_V2,
  VIRTUAL_AREA_CMD_ROBOT_V2,
  VIRTUAL_WALL_CMD_ROBOT_V1,
  ZONE_CLEAN_CMD_ROBOT_V2,
  circleIntersectRect,
  decodeSpotClean0x17,
  decodeSpotClean0x3f,
  decodeVirtualArea0x39,
  decodeVirtualWall0x13,
  decodeZoneClean0x3b,
  getCmdStrFromStandardFeatureCommand,
  getFeatureProtocolVersion,
} from '@ray-js/robot-protocol';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import { isNaN, isNumber, isUndefined } from 'lodash-es';
import mitt from 'mitt';
import moment from 'moment';
import { getLaserMapPoints, getMapPointsInfo } from './openApi';

export const emitter = mitt();

export const JsonUtil = {
  parseJSON(str) {
    let rst;
    if (str && {}.toString.call(str) === '[object String]') {
      try {
        rst = JSON.parse(str);
      } catch (e) {
        try {
          // eslint-disable-next-line
          rst = eval(`(${str})`);
        } catch (e2) {
          rst = str;
        }
      }
    } else {
      rst = typeof str === 'undefined' ? {} : str;
    }

    return rst;
  },
};

/**
 * 获取DP信息
 * @param dpcode DP Code
 * @returns
 */
export const getDpSchema = (dpCode: string) => {
  return (getDevInfo().schema[dpCode] ?? {}) as DpSchema;
};

/**
 * 检测DP是否存在
 * @param dpCode DP Code
 * @returns
 */
export const checkDpExist = (dpCode: string) => {
  return dpCode in getDevInfo().schema;
};

/**
 * 根据dpCode获取dpId
 */
export const getDpIdByCode = (dpCode: string) => getDevInfo().codeIds[dpCode];

/**
 * 根据dpId获取dpCode
 */
export const getDpCodeById = (dpId: number | string) => {
  return getDevInfo().idCodes[dpId];
};

/**
 * 获取dp值
 */
export const getDpStateByCode = (dpCode: string) => {
  return devices.common.model.props[dpCode];
};

/**
 * 检查地图中的划区清扫框、虚拟墙、禁区框数量
 * @param num
 * @param extendZoneLength
 * @param mapId
 * @returns
 */
export async function checkMapPointNumber(num: number, extendZoneLength = 0, mapId: string) {
  try {
    const { data = [] } = await getLaserMapPoints(mapId);
    const zoneNum = data.length + extendZoneLength + 1;
    if (zoneNum > num) {
      ty.showToast({
        title: Strings.getLang('dsc_Area_num_limit'),
        icon: 'error',
      });
      return Promise.reject();
    }
    return true;
  } catch (error) {
    console.warn(error);
    return Promise.reject(error);
  }
}

/**
 * 获取数组的一个是数字的元素
 * @param arr
 * @returns
 */
export const getFirNum = (arr: any[]) => {
  for (let i = 0; i < arr.length; i++) {
    if (!isNaN(arr[i]) && isNumber(arr[i])) {
      return arr[i];
    }
  }
  return 0;
};

/**
  获取坐标点数据（兼容老接口数据结构）
 */
async function getMapPointsCompatibleWiltV1(opts = { mapId: '' }) {
  const { mapId } = opts;
  const { data = [] } = await getMapPointsInfo(mapId);

  if (mapId) {
    const points = data.map(item => item.points);
    return {
      origin: data,
      compatible: points,
    };
  }
  return {
    origin: data,
    compatible: data,
  };
}
/**
 *  检查区域是否在点内
 */
export function checkForbidInPos(opts) {
  const {
    posX,
    posY,
    originX,
    originY,
    resolution,
    ringRadiusRealMeter = 1,
    curAreaData = [],
  } = opts;
  // 如果有充电桩的时候才检查是否和充电桩重叠
  if (isUndefined(posX) || isUndefined(posY) || isUndefined(originX) || isUndefined(originY))
    return false;

  return curAreaData.some(item => {
    return circleIntersectRect(
      {
        x: posX + originX,
        y: posY + originY,
        radius: ringRadiusRealMeter / resolution, // 半径=真实米数/比例尺
      },
      item
    );
  });
}

/**
 * 禁区框移动时，检测是否覆盖当前点
 */
export async function isForbiddenZonePointsInCurPos(
  pointData: { areaType: number },
  opts = { resolution: 0.05, curPos: { x: 0, y: 0 }, origin: { x: 0, y: 0 }, mapId: '' }
) {
  const {
    curPos: { x: px, y: py },
    resolution,
    origin: { x: ox, y: oy },
  } = opts;
  if (
    px === undefined ||
    py === undefined ||
    !pointData ||
    !(
      pointData.areaType === ENativeMapStatusEnum.virtualArea ||
      pointData.areaType === ENativeMapStatusEnum.virtualWall
    )
  ) {
    return false;
  }
  const { compatible: data = [], origin: originData = [] } = await getMapPointsCompatibleWiltV1({
    mapId: opts.mapId,
  });
  return checkForbidInPos({
    posX: px,
    posY: py,
    originX: ox,
    originY: oy,
    resolution,
    ringRadiusRealMeter: 0.1,
    // ringRadiusRealMeter: 1,
    curAreaData: data,
  });
}

/**
 * 禁区框移动时的回调, 检测禁区框是否在充电桩2米内
 * @param {*} pointData
 * @param {*} [opts={ resolution: 1, pilePosition, mapId }]
 * @returns {boolean}
 */
export async function isForbiddenZonePointsInPile(
  pointData: { areaType: number },
  opts = { resolution: 1, pilePosition: { x: 0, y: 0 }, mapId: '', origin: { x: 0, y: 0 } }
) {
  if (!pointData || !(pointData.areaType === ENativeMapStatusEnum.virtualArea)) return false;
  const { compatible: data = [], origin: originData = [] } = await getMapPointsCompatibleWiltV1({
    mapId: opts.mapId,
  });
  const {
    pilePosition,
    resolution,
    origin: { x: ox, y: oy },
  } = opts;

  return checkForbidInPos({
    posX: pilePosition.x,
    posY: pilePosition.y,
    originX: ox,
    originY: oy,
    resolution,
    ringRadiusRealMeter: 1,
    curAreaData: data,
  });
}

/**
 * 根据清扫记录字符串解析数据
 * @param inputString 清扫记录字符串
 * @returns 解析后的数据
 */
export const parseDataFromString = (inputString: string) => {
  // 使用正则表达式提取所需的部分
  const regex = /^(\d{5})_(\d{8}_\d{6})_(\d{3})_(\d{3})_(\d{5})_(\d{5})_(\d{5})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/;
  const match = inputString.match(regex);

  if (!match) {
    throw new Error('Input string format is incorrect');
  }

  const recordId = parseInt(match[1], 10);
  const dateTimeString = match[2];
  const totalTimeMinutes = parseInt(match[3], 10);
  const totalAreaSquareMeters = parseInt(match[4], 10);
  const mapLength = parseInt(match[5], 10);
  const pathLength = parseInt(match[6], 10);
  const virtualLength = parseInt(match[7], 10);
  const cleanMode = parseInt(match[8], 10);
  const workMode = match[9];
  const cleaningResult = match[10];
  const startMethod = match[11];

  // 使用 moment.js 解析日期时间
  const dateTimeFormat = 'YYYYMMDD_HHmmss';
  const momentDate = moment(dateTimeString, dateTimeFormat);

  if (!momentDate.isValid()) {
    throw new Error('Invalid date format');
  }

  const timeStamp = momentDate.valueOf(); // 获取时间戳

  return {
    recordId,
    timeStamp: timeStamp,
    time: totalTimeMinutes,
    area: totalAreaSquareMeters,
    mapLength,
    pathLength,
    virtualLength,
    cleanMode,
    workMode,
    cleaningResult,
    startMethod,
  };
};

/**
 * 解析区域信息
 * @param command 指令
 * @returns 区域信息
 */
export const decodeAreas = (command: string) => {
  const version = getFeatureProtocolVersion(command);
  const cmd = getCmdStrFromStandardFeatureCommand(command);

  // 虚拟墙
  if (cmd === VIRTUAL_WALL_CMD_ROBOT_V1) {
    const virtualWallData = decodeVirtualWall0x13({ command, version });
    return { virtualWallData };
  }

  // 禁区
  if (cmd === VIRTUAL_AREA_CMD_ROBOT_V2) {
    const { virtualAreas } = decodeVirtualArea0x39({ command, version });

    return virtualAreas.reduce(
      (area, cur) => {
        if (cur.mode === 2) {
          area.virtualMopAreaData.push(cur);
        } else {
          area.virtualAreaData.push(cur);
        }

        return area;
      },
      { virtualAreaData: [], virtualMopAreaData: [] }
    );
  }

  // 定点
  if (cmd === SPOT_CLEAN_CMD_ROBOT_V1) {
    const appointData = decodeSpotClean0x17({ command, version });

    return { appointData: appointData.point };
  }

  if (cmd === SPOT_CLEAN_CMD_ROBOT_V2) {
    const appointData = decodeSpotClean0x3f({ command, version });

    return { appointData: appointData.points };
  }

  // 划区
  if (cmd === ZONE_CLEAN_CMD_ROBOT_V2) {
    const sweepRegionData = decodeZoneClean0x3b({ command, version });

    return { sweepRegionData: sweepRegionData.zones };
  }
};

/**
 * 虚拟信息可创建最大数量
 * @param data
 * @param num
 * @param tip
 * @returns
 */
export const createLimitByNum = (data: Array<any>, num = 5, tip: string) => {
  if (data.length === num) {
    ty.showToast({
      title: Strings.formatValue(tip as any, String(num)),
      icon: 'error',
    });
    return true;
  }
  return false;
};
