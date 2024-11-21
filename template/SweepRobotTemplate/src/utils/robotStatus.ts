/**
 * 扫地机处于全屋清扫暂停中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsAutoRunPause = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'smart' && robotStatus === 'paused';
};

/**
 * 扫地机处于指哪扫哪暂停中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsPointPause = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'pose' && robotStatus === 'paused';
};

/**
 * 扫地机处于指哪扫哪重定位中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsPointRelocation = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'pose' && robotStatus === 'relocation';
};

/**
 * 扫地机处于划区清扫暂停中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsAreaPause = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'zone' && robotStatus === 'paused';
};

/**
 * 扫地机处于划区清扫重定位
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsAreaRelocation = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'zone' && robotStatus === 'relocation';
};

/**
 * 扫地机处于选区清扫暂停中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsSelectRoomPaused = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'select_room' && robotStatus === 'paused';
};

/**
 * 扫地机处于全屋清扫中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsAutoRunning = (workMode: Mode, robotStatus: Status) => {
  return robotStatus === 'smart';
};

/**
 * 扫地机处于快速建图中/建图完成状态
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsMapping = (workMode: Mode, robotStatus: Status) => {
  return robotStatus === 'mapping' || robotStatus === 'mapping_done';
};

/**
 * 扫地机处于指哪扫哪中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsPointing = (workMode: Mode, robotStatus: Status) => {
  return (
    robotStatus === 'goto_pos' || robotStatus === 'pos_arrived' || robotStatus === 'part_clean'
  );
};

/**
 * 扫地机处于划区清扫中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsAreaing = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'zone' && robotStatus === 'zone_clean';
};

/**
 * 扫地机处于选区清扫中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsSelectRoom = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'select_room' && robotStatus === 'select_room';
};

/**
 * 扫地机处于重定位中
 * @param robotStatus
 * @returns
 */
export const robotIsRelocation = (robotStatus: Status) => {
  return robotStatus === 'relocation';
};

/**
 * 扫地机处于充电中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsCharing = (robotStatus: Status) => {
  return robotStatus === 'charging' || robotStatus === 'breakpoint_charging';
};

/**
 * 扫地机处于寻找充电座中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsToCharing = (robotStatus: Status, dpSwitchCharge: boolean) => {
  return (dpSwitchCharge && robotStatus !== 'paused') || robotStatus === 'goto_charge';
};

/**
 * 扫地机处于充电完成中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsFullCharge = (robotStatus: Status) => {
  return robotStatus === 'charge_done';
};

/**
 * 扫地机处于寻找充电座/充电/充电完成中
 * @param robotStatus
 * @returns
 */
export const robotIsCharge = (robotStatus: Status, dpSwitchCharge: boolean) => {
  return (
    dpSwitchCharge ||
    robotStatus === 'goto_charge' ||
    robotStatus === 'charging' ||
    robotStatus === 'charge_done' ||
    robotStatus === 'breakpoint_charging'
  );
};

/**
 * 扫地机处于断电续扫回充中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsBreakpointCharging = (robotStatus: Status) => {
  return robotStatus === 'breakpoint_charging';
};

/**
 * 扫地机处于待机状态
 * @param robotStatus
 * @returns
 */
export const robotIsStandby = (robotStatus: Status) => {
  return robotStatus === 'standby';
};

/**
 * 扫地机处于待机/充电中/充电完成/休眠状态
 * @param robotStatus
 * @returns
 */
export const isRobotSilence = (robotStatus: Status) => {
  const robotStatusArr: Status[] = [
    'standby',
    'charging',
    'charge_done',
    'breakpoint_charging',
    'sleep',
  ];
  return robotStatusArr.includes(robotStatus);
};

/**
 * 扫地机是否处于待机/休眠状态
 * @param robotStatus
 * @returns
 */
export const isRobotChargeDirect = (robotStatus: Status) => {
  return (['standby', 'sleep'] as Status[]).includes(robotStatus);
};

/**
 * 扫地机是否处于休眠中状态
 */
export const isRobotSleep = (robotStatus: Status) => {
  return robotStatus === 'sleep';
};

/**
 * 扫地机是否处于寻找集尘桶/集尘状态
 * @param robotStatus
 * @returns
 */
export const robotIsDust = (robotStatus: Status) => {
  return (['collecting_dust', 'seek_dust_bucket'] as Status[]).includes(robotStatus);
};

/**
 * 扫地机处于待机/充电中/已充满/暂停状态
 * @param robotStatus
 * @returns
 */
export const isRobotQuiet = (robotStatus: Status) => {
  return ([
    'standby',
    'charging',
    'breakpoint_charging',
    'charge_done',
    'sleep',
    'paused',
  ] as Status[]).includes(robotStatus);
};

/**
 * 扫地机处于手动控制中
 * @param workMode
 * @param robotStatus
 * @returns
 */
export const robotIsManual = (workMode: Mode, robotStatus: Status) => {
  return workMode === 'manual' && robotStatus === 'manual';
};

/**
 * 扫地机不处于工作状态
 * @param robotStatus
 * @returns
 */
export const robotIsNotWorking = (robotStatus: Status) => {
  return ([
    'standby',
    'charging',
    'breakpoint_charging',
    'charge_done',
    'sleep',
    'collecting_dust',
    'self_clean',
  ] as Status[]).includes(robotStatus);
};

/**
 * 扫地机处于故障状态
 * @param robotStatus
 * @returns
 */
export const robotIsFault = (robotStatus: Status) => {
  return robotStatus === 'fault';
};

export const robotIsCleaning = (workMode: Mode, robotStatus: Status) => {
  return (
    robotIsAutoRunning(workMode, robotStatus) ||
    robotIsAutoRunPause(workMode, robotStatus) ||
    robotIsAreaing(workMode, robotStatus) ||
    robotIsAreaPause(workMode, robotStatus) ||
    robotIsSelectRoom(workMode, robotStatus) ||
    robotIsSelectRoomPaused(workMode, robotStatus) ||
    robotIsPointing(workMode, robotStatus) ||
    robotIsPointPause(workMode, robotStatus) ||
    robotIsMapping(workMode, robotStatus) ||
    robotIsRelocation(robotStatus)
  );
};

export const robotIsMoving = (robotStatus: Status) => {
  return ([
    'goto_charge',
    'goto_pos',
    'select_room',
    'cleaning',
    'mapping',
    'part_clean',
    'smart',
    'zone_clean',
    'relocation',
    'seek_dust_bucket',
    'manual',
  ] as Status[]).includes(robotStatus);
};

export default {
  robotIsAutoRunPause,
  robotIsPointPause,
  robotIsPointRelocation,
  robotIsAreaPause,
  robotIsAreaRelocation,
  robotIsSelectRoomPaused,
  robotIsAutoRunning,
  robotIsPointing,
  robotIsAreaing,
  robotIsSelectRoom,
  robotIsCharing,
  robotIsToCharing,
  robotIsFullCharge,
  robotIsCharge,
  robotIsStandby,
  robotIsMapping,
  isRobotSilence,
  isRobotChargeDirect,
  isRobotSleep,
  robotIsDust,
  isRobotQuiet,
  robotIsManual,
  robotIsNotWorking,
  robotIsFault,
  robotIsCleaning,
  robotIsRelocation,
};
