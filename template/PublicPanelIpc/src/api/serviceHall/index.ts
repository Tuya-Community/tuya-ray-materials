import { getVasServiceConfigList } from '@ray-js/ray';
import { GetServiceHallSettingParams, GetServiceHallSettingRes } from './interface';

export function getServiceHallSetting(params: GetServiceHallSettingParams) {
  return getVasServiceConfigList(params);
}
