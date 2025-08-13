import type { DataArray } from '@/typings';
import { DO_NOT_DISTURB_CMD_APP_V2, DO_NOT_DISTURB_CMD_ROBOT_V2 } from '@/constant/cmd';
import { completionTimeZone } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *勿扰时间设置0x40/0x41
 *
 * 设置勿扰时间的指令(0x40) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeDoNotDisturb0x40 = (params: {
  enable: boolean;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  timeZone?: number;
  version?: '0' | '1';
}): string => {
  const {
    enable,
    startHour,
    startMinute,
    endHour,
    endMinute,
    timeZone = Math.round(new Date().getTimezoneOffset() / -60),
    version = '1',
  } = params;

  const dataArray: DataArray = [];

  // Protocol version | Switch | Time zone | start time | day | end time | day
  dataArray.push(
    1,
    enable ? 1 : 0,
    timeZone < 0 ? completionTimeZone(timeZone) : timeZone,
    startHour,
    startMinute,
    0,
    endHour,
    endMinute,
    startHour * 60 + startMinute > endHour * 60 + endMinute ? 1 : 0
  );

  return encodeStandardFeatureCommand(
    DO_NOT_DISTURB_CMD_APP_V2,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodeDoNotDisturb0x40
 */
export const encodeDoNotDisturbV2 = encodeDoNotDisturb0x40;
/**
 * *勿扰时间设置0x40/0x41
 *
 * 从指令中解析获取勿扰时间数据(0x41) | Robot ➜ App
 * @param params 参数
 * @returns 勿扰时间数据
 */
export const decodeDoNotDisturb0x41 = (params: {
  command: string;
  version?: '0' | '1';
}): {
  enable: boolean;
  timeZone: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
} | null => {
  const { command, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    DO_NOT_DISTURB_CMD_ROBOT_V2,
    version
  );

  if (!valid) {
    return null;
  }

  const enable = parseInt(dataStr.slice(2, 4), 16) === 1;
  const timeZoneNum = parseInt(dataStr.slice(4, 6), 16);
  const timeZone = timeZoneNum > 200 ? timeZoneNum - 256 : timeZoneNum;

  const startHour = parseInt(dataStr.slice(6, 8), 16);
  const startMinute = parseInt(dataStr.slice(8, 10), 16);
  const endHour = parseInt(dataStr.slice(12, 14), 16);
  const endMinute = parseInt(dataStr.slice(14, 16), 16);

  return {
    enable,
    timeZone,
    startHour,
    startMinute,
    endHour,
    endMinute,
  };
};

/**
 * @deprecated 请使用 decodeDoNotDisturb0x41
 */
export const decodeDoNotDisturbV2 = decodeDoNotDisturb0x41;
