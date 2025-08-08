import { FuncType } from './constant';

/**
 * 普通定时数据（云定时）
 */
export interface NormalTimerData {
  /**
   * 初始化状态
   */
  status: boolean;
  /**
   * 在0000000基础上，把所选择日期对应位置的 0 改成 1，第一位表示周日。
   */
  loops: Array<1 | 0>;
  /**
   * 定时时间。
   */
  time: string;
  /**
   * 定时任务主键。
   */
  id: number;
  /**
   * 是否发送执行通知。
   */
  isAppPush: boolean;
  /**
   * DP 值。
   */
  dps: Record<string, any>;
  /**
   * 分组定时排序。
   */
  groupOrder: number;
  /**
   * 分组定时 ID。
   */
  groupId: string;
  /**
   * 分组定时定时备注。
   */
  aliasName: string;

  // 前端加入的处理内容
  hours: number;
  minutes: number;
}

/**
 * 循环定时数据
 */
export interface CycleData {
  id: number;
  startTime: number;
  endTime: number;
  onHoldTime: number;
  offHoldTime: number;
  status: boolean;
  channels: number[];
  loops: Array<1 | 0>;
}

/**
 * 随机定时数据
 */

export interface RandomData {
  id: number;
  startTime: number;
  endTime: number;
  status: boolean;
  channels: number[];
  loops: Array<1 | 0>;
}

/**
 * 倒计时数据
 */
export interface CountdownData {
  time: number;
  // 对应的开关 dp id
  id: number | string;
  // 对应的开关 dp code
  dpCode: string;

  // 倒计时 dp id
  countDownId: number | string;
  // 倒计时 dp code
  countDownCode: string;
}

/**
 * 用于检测是否冲突的数据条目
 */
export interface ConflictCheckItem {
  weeks: Array<1 | 0>;
  startTime: number;
  endTime: number;
  type: FuncType;
  origin: NormalTimerData | CycleData | RandomData | CountdownData | InchingData
}

/**
 * 冲突的数据
 */
export interface ConflictItem {
  type: FuncType;
  code?: string; // 在冲突结果中显存在
  data: NormalTimerData | CycleData | RandomData | CountdownData | AstronomicalData | InchingData;
}

export interface AstronomicalData {
  /**
   * 0 为日出
   * 1 为日落
   */
  astronomicalType: 0 | 1;
  bizId: string;
  bizType: number;
  dps: Record<string, boolean>;
  id: string;
  lat: number;
  lon: number;
  loops: string;
  nextSunRise: string;
  /**
   * -1 为日出（落）前
   * 0 为日出（落）时
   * 1 为日出（落）后
   */
  offsetType: -1 | 0 | 1;
  status: 0 | 1;
  time: string;
  timezone: string;
}

/**
 * @description: 编辑添加天文定时的数据结构
 * @param {*}
 * @return {*}
 */
export interface AstronomicalParams {
  bizId: string; // 群组id或设备id
  bizType: 1 | 0; // 表示群组、0表示为设备
  loops: string;
  dps: Record<string, boolean>;
  astronomicalType: 0 | 1;
  time: string;
  offsetType: -1 | 0 | 1;
  lon: number;
  lat: number;
  timezone: string;
}

export interface InchingData {
  id: number;
  time: number;
  status: boolean;
  channels: number[];
}
