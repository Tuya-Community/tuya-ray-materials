import { devices } from '@/devices';
import {
  SPOT_CLEAN_CMD_ROBOT_V1,
  SPOT_CLEAN_CMD_ROBOT_V2,
  VIRTUAL_AREA_CMD_ROBOT_V2,
  VIRTUAL_WALL_CMD_ROBOT_V1,
  ZONE_CLEAN_CMD_ROBOT_V2,
  decodeSpotClean0x17,
  decodeSpotClean0x3f,
  decodeVirtualArea0x39,
  decodeVirtualWall0x13,
  decodeZoneClean0x3b,
  getCmdStrFromStandardFeatureCommand,
  getFeatureProtocolVersion,
} from '@ray-js/robot-protocol';
import mitt from 'mitt';
import moment from 'moment';
import { APP_MULTIPLE_MAP_CACHE_DIR } from '@/constant';

import log4js from '@ray-js/log4js';
import { SpotParam, VirtualWallParam, ZoneParam } from '@ray-js/robot-map';
import { nanoid } from '@reduxjs/toolkit';

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
 * 根据dpCode获取dpId
 */
export const getDpIdByCode = (dpCode: string) => devices.common.getDevInfo().codeIds[dpCode];

/**
 * 根据dpId获取dpCode
 */
export const getDpCodeById = (dpId: number | string) => {
  return devices.common.getDevInfo().idCodes[dpId];
};

/**
 * 获取dp值
 */
export const getDpStateByCode = (dpCode: string) => {
  return devices.common.model.props[dpCode];
};

/**
 * 根据清扫记录字符串解析数据
 * @param inputString 清扫记录字符串
 * @returns 解析后的数据
 */
export const parseDataFromString = (inputString: string) => {
  // 使用正则表达式提取所需的部分
  const regex = /^(\d{5})_(\d{8}_\d{6})_(\d{3})_(\d{3})_(\d{5})_(\d{5})_(\d{5})(?:_(\d{2})_(\d{2})_(\d{2})_(\d{2}))?$/;
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
  const cleanMode = match[8] ? parseInt(match[8], 10) : undefined;
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
export const decodeAreas = (
  command: string
): {
  virtualWalls?: VirtualWallParam[];
  forbiddenSweepZones?: ZoneParam[];
  forbiddenMopZones?: ZoneParam[];
  spots?: SpotParam[];
  cleanZones?: ZoneParam[];
} => {
  const version = getFeatureProtocolVersion(command);
  const cmd = getCmdStrFromStandardFeatureCommand(command, version);

  // 虚拟墙
  if (cmd === VIRTUAL_WALL_CMD_ROBOT_V1) {
    const data = decodeVirtualWall0x13({ command, version });
    return {
      virtualWalls: data.map(points => {
        return {
          id: nanoid(),
          points,
        };
      }),
    };
  }

  // 禁区
  if (cmd === VIRTUAL_AREA_CMD_ROBOT_V2) {
    const data = decodeVirtualArea0x39({ command, version });

    return data.virtualAreas.reduce(
      (area, cur) => {
        if (cur.mode === 2) {
          area.forbiddenMopZones.push({
            id: nanoid(),
            points: cur.points,
          });
        } else {
          area.forbiddenSweepZones.push({
            id: nanoid(),
            points: cur.points,
          });
        }

        return area;
      },
      { forbiddenSweepZones: [], forbiddenMopZones: [] }
    );
  }

  // 定点
  if (cmd === SPOT_CLEAN_CMD_ROBOT_V1) {
    const data = decodeSpotClean0x17({ command, version });

    return {
      spots: [
        {
          id: '0',
          point: data.point,
        },
      ],
    };
  }

  if (cmd === SPOT_CLEAN_CMD_ROBOT_V2) {
    const data = decodeSpotClean0x3f({ command, version });

    return {
      spots: data.points.map(point => {
        return {
          id: nanoid(),
          point,
        };
      }),
    };
  }

  // 划区
  if (cmd === ZONE_CLEAN_CMD_ROBOT_V2) {
    const data = decodeZoneClean0x3b({ command, version });

    return {
      cleanZones: data.zones.map(zone => {
        return {
          id: nanoid(),
          points: zone.points,
        };
      }),
    };
  }
};

/**
 * 下载OSS地图文件
 * @param url url
 * @param rest 其他参数
 * @returns
 */
export const fetchMapFile = async (url, file, ...rest) => {
  return new Promise<{ data: string; status: number }>((resolve, reject) => {
    const fileName = file.split('/').pop();
    const realFilePath = APP_MULTIPLE_MAP_CACHE_DIR + fileName;
    log4js.info('fetchMapFile url, file, realFilePath', url, file, realFilePath);

    ty.downloadFile({
      url,
      filePath: realFilePath,
      ...rest,
      success: res => {
        const { filePath } = res;
        ty.getFileSystemManager().readFile({
          filePath,
          encoding: 'base64',
          position: 0,
          success: ({ data }) => {
            resolve({
              status: 200,
              data,
            });
          },
          fail: params => {
            console.log('readFile fail', params);
            reject();
          },
        });
      },
      fail: params => {
        console.log('downloadFile failure', params);
      },
    });
  });
};
