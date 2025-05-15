import { DevInfo } from "@ray-js/panel-sdk";

export const getDpIdByCode = (dpCode: string, devInfo: any) => {
  const { schema = {} } = devInfo;
  if (typeof dpCode === 'string') {
    if (Array.isArray(schema)) {
      return schema.find(i => i.code === dpCode)?.id;
    }
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
    return;
  }
  console.log('%c下发dps => ', 'color:#ffb900', devInfo.devId, dpIds);
  ty.device.publishDps({
    deviceId: devInfo.devId,
    dps: dpIds,
    mode: 2,
    pipelines: [],
    options: {},
  });
};
