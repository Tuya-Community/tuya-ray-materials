import { getBitValue } from '@ray-js/panel-sdk/lib/utils';
import { queryDps } from '@ray-js/ray';

export const queryDevDps = (devInfo, params: Partial<Parameters<typeof queryDps>['0']>) => {
  const isBLE = getBitValue(devInfo?.capability ?? 1, 10);
  const options = {
    ...params,
    deviceId: params?.deviceId ?? devInfo?.devId ?? '',
    dpIds: params.dpIds,
    // @ts-ignore queryType 老版本 kit 不支持，可忽略。
    queryType: params?.queryType ?? (isBLE ? 0 : 1),
  };
  return queryDps(options);
};
