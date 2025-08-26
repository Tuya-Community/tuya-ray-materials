import { DevInfo } from "@ray-js/panel-sdk";

export const getDpIdByCode = (dpCode: string, devInfo: any) => {
  const { schema = {} } = devInfo;
  if (typeof dpCode === 'string') {
    if (!schema[dpCode]) {
      return null;
    }
    return schema[dpCode].id;
  }
  return null;
};


// dp下发原始方法
export const putDpData = (dps: { [dp: string]: any }, devInfo: DevInfo) => {
  const dpIds = {};
  dps &&
    Object.keys(dps).forEach(i => {
      const code = getDpIdByCode(i, devInfo);
      code && (dpIds[code] = dps[i]);
    });
  if (!ty.device) {
    console.warn("TTT方法不存在");
    return;
  }
  console.log('%c下发dps => ', 'color:#ffb900', dpIds);
  ty.device.publishDps({
    deviceId: devInfo.devId,
    dps: dpIds,
    mode: 2,
    pipelines: [],
    options: {},
  });
};
