import { LOCAL_TIMER_CMD_ROBOT_31, LOCAL_TIMER_CMD_APP_30 } from '@/constant/cmd';
import {
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
  convertDataArrayToDataStr,
} from '@/utils/command';
import moment from 'moment';
import { TimerData } from '../../typings';
import { completionTimeZone, subStrToInt, from16To2 } from '@/utils';

export const encodeDeviceTimer0x30 = (params: {
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
  const dataArr = [timeZone, number];
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
    } = list[i];
    const weekList = [...week];

    dataArr.push(
      effectiveness,
      parseInt(weekList.reverse().join(''), 2),
      time.hour,
      time.minute,
      roomNum,
      ...roomIds,
      cleanMode,
      fanLevel,
      waterLevel,
      sweepCount
    );
  }

  return encodeStandardFeatureCommand(
    LOCAL_TIMER_CMD_APP_30,
    convertDataArrayToDataStr(dataArr),
    version
  );
};

/**
 * *设备定时时间设置0x40/0x41
 *
 * 从指令中解析获取本地定时数据(0x31) | Robot ➜ App
 * @param params 参数
 * @returns 勿扰时间数据
 */

export const decodeDeviceTimer0x31: (params: { command: string; version?: '0' | '1' }) => {
  number: number;
  timeZone: number;
  list: TimerData[];
} = params => {
  const { command, version = '1' } = params;
  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    LOCAL_TIMER_CMD_ROBOT_31,
    version
  );

  if (!valid) {
    return null;
  }
  const list: TimerData[] = [];

  // TODO 手机系统时区（补码）
  const timeZone = subStrToInt(dataStr, 0);
  // 定时条数
  const number = subStrToInt(dataStr, 2);
  // 内容区域的游标开始位置
  let pos = 4;
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
    });
  }

  return { number, timeZone, list };
};
