import {
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
  convertDataArrayToDataStr,
} from '@/utils/command';
import moment from 'moment';
import { DataArray, TimerData } from '../../typings';
import { completionTimeZone, subStrToInt, from16To2 } from '@/utils';
import { LOCAL_TIMER_CMD_APP_44, LOCAL_TIMER_CMD_ROBOT_45 } from '@/constant/cmd';

/**
 * *设备定时时间设置0x44/0x45
 *
 * 设置定时的指令(0x44) | App ➜ Robot
 * @param params 参数
 */

export const encodeDeviceTimer0x44 = (params: {
  list: TimerData[];
  number: number;
  version?: '0' | '1';
}): string => {
  const { list, number, version = '1' } = params;
  const zone = moment().format('Z') ?? '+08:00';
  const [zoneStr] = zone.match(/([+-])\d(\d)/) || ['+08', '+', '8'];
  let timeZone = Number(zoneStr);

  if (timeZone < 0) {
    timeZone = completionTimeZone(timeZone);
  }

  const dataArray: DataArray = [1, timeZone, number];

  for (let i = 0; i < number; i++) {
    const {
      effectiveness,
      week,
      time,
      roomIds,
      cleanMode,
      fanLevel,
      waterLevel,
      sweepCount,
      roomNum,
      zoneIds = [],
      mapId = 0,
    } = list[i];
    const weekList = [...week];

    dataArray.push(
      effectiveness,
      parseInt(weekList.reverse().join(''), 2),
      time.hour,
      time.minute,
      {
        value: mapId,
        byte: 2,
      },
      roomNum,
      ...roomIds,
      zoneIds.length,
      ...zoneIds.map(zoneId => ({
        value: zoneId,
        byte: 4,
      })),
      cleanMode,
      fanLevel,
      waterLevel,
      sweepCount
    );
  }

  return encodeStandardFeatureCommand(
    LOCAL_TIMER_CMD_APP_44,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * *设备定时时间设置0x44/0x45
 *
 * 从指令中解析获取本地定时数据(0x31) | Robot ➜ App
 * @param params 参数
 * @returns 勿扰时间数据
 */

export const decodeDeviceTimer0x45: (params: { command: string; version?: '0' | '1' }) => {
  number: number;
  timeZone: number;
  list: TimerData[];
} = params => {
  const { command, version = '1' } = params;
  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    LOCAL_TIMER_CMD_ROBOT_45,
    version
  );

  if (!valid) {
    return null;
  }
  const list: TimerData[] = [];

  // TODO 手机系统时区（补码）
  const timeZone = subStrToInt(dataStr, 2);
  // 定时条数
  const number = subStrToInt(dataStr, 4);

  // 内容区域的游标开始位置
  let pos = 6;
  for (let i = 0; i < number; i++) {
    // 定时是否开启
    const effectiveness = subStrToInt(dataStr, pos);
    pos += 2;
    const week = from16To2(dataStr.slice(pos, pos + 2))
      .split('')
      .reverse()
      .map(v => parseInt(v, 10));
    pos += 2;
    const startHour = subStrToInt(dataStr, pos);
    pos += 2;
    const startMinute = subStrToInt(dataStr, pos);
    pos += 2;
    const mapId = subStrToInt(dataStr, pos, 4);
    pos += 4;
    const roomNum = subStrToInt(dataStr, pos);
    const roomLen = roomNum * 2;
    pos += 2;
    // 房间标识，占一个字节，全屋清扫时无该参数
    const roomStr = dataStr.slice(pos, pos + roomLen);
    const roomIds = [];
    for (let j = 0; j < roomStr.length; j += 2) {
      roomIds.push(subStrToInt(roomStr, j));
    }
    pos += roomLen;

    const zoneNum = subStrToInt(dataStr, pos);

    const zoneLen = zoneNum * 8;
    pos += 2;

    // 房间标识，占一个字节，全屋清扫时无该参数
    const zoneStr = dataStr.slice(pos, pos + zoneLen);

    const zoneIds = [];
    for (let j = 0; j < zoneStr.length; j += 8) {
      zoneIds.push(subStrToInt(zoneStr, j));
    }

    pos += zoneLen;
    const cleanMode = subStrToInt(dataStr, pos);
    pos += 2;
    const fanLevel = subStrToInt(dataStr, pos);
    pos += 2;
    const waterLevel = subStrToInt(dataStr, pos);
    pos += 2;
    const sweepCount = subStrToInt(dataStr, pos);
    pos += 2;
    list.push({
      effectiveness,
      week,
      time: { hour: startHour, minute: startMinute },
      roomNum,
      roomIds,
      cleanMode,
      fanLevel,
      waterLevel,
      sweepCount,
      mapId,
      zoneIds,
    });
  }

  return { number, timeZone, list };
};
