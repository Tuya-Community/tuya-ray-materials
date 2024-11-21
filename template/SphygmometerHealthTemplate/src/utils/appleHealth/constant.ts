/* 指标类型 */
export type syncAppleHealthCode = 'avgSys' | 'avgDia';

/* 同步配置, 注意这里的单位，类型是aplle规定的，参考文档 */
export const syncAppleHealthCodeConfig = {
  // 收缩压
  avgSys: {
    quanlityType: '204',
    unitType: 'mmHg',
  },
  // 舒张压
  avgDia: {
    quanlityType: '205',
    unitType: 'mmHg',
  },
};

/**
 * @param healthCodes syncAppleHealthCodeConfig 要授权的指标的 key
 * @returns 要授权的指标对应的 quanlityType 数组
 */
export const getTYQuanlityTypeByCodes = (healthCodes?: string[]) => {
  const syncAppleHealthCodes = Object.keys(syncAppleHealthCodeConfig);
  const codes =
    healthCodes instanceof Array && healthCodes.length ? healthCodes : syncAppleHealthCodes;
  return codes.map(key => syncAppleHealthCodeConfig[key]?.quanlityType).filter(item => item);
};
