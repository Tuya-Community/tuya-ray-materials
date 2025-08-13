import type { DataArray } from '@/typings';
import { DO_NOT_DISTURB_CMD_APP_V1, DO_NOT_DISTURB_CMD_ROBOT_V1 } from '@/constant/cmd';
import { completionTimeZone } from '@/utils';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *勿扰时间设置0x32/0x33
 *
 * 设置勿扰时间的指令(0x32) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeDoNotDisturb0x32 = (params: {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  timeZone?: number;
  version?: '0' | '1';
}): string => {
  const {
    startHour,
    startMinute,
    endHour,
    endMinute,
    timeZone = Math.round(new Date().getTimezoneOffset() / -60),
    version = '1',
  } = params;

  const dataArray: DataArray = [];

  // Protocol Time zone | start time | day | end time | day
  dataArray.push(
    timeZone < 0 ? completionTimeZone(timeZone) : timeZone,
    startHour,
    startMinute,
    0,
    endHour,
    endMinute,
    startHour * 60 + startMinute > endHour * 60 + endMinute ? 1 : 0
  );

  return encodeStandardFeatureCommand(
    DO_NOT_DISTURB_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * *勿扰时间设置0x32/0x33
 *
 * 从指令中解析获取勿扰时间数据(0x33) | Robot ➜ App
 * @param params 参数
 * @returns 勿扰时间数据
 */
export const decodeDoNotDisturb0x33 = (params: {
  command: string;
  version?: '0' | '1';
}): {
  timeZone: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
} | null => {
  const { command, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    DO_NOT_DISTURB_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const timeZoneNum = parseInt(dataStr.slice(0, 2), 16);
  const timeZone = timeZoneNum > 200 ? timeZoneNum - 256 : timeZoneNum;

  const startHour = parseInt(dataStr.slice(2, 4), 16);
  const startMinute = parseInt(dataStr.slice(4, 6), 16);
  const endHour = parseInt(dataStr.slice(8, 10), 16);
  const endMinute = parseInt(dataStr.slice(10, 12), 16);

  return {
    timeZone,
    startHour,
    startMinute,
    endHour,
    endMinute,
  };
};
