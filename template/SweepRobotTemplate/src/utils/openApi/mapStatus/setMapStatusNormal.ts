import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
import { EMapSplitStateEnum, ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';

/**
 * @description 设置地图进入正常非编辑状态
 */
export default async function setMapStatusNormal(mapId: string) {
  await IndoorMapApi.setLaserMapStateAndEdit(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: ENativeMapStatusEnum.normal,
    edit: false,
  });
  IndoorMapApi.setLaserMapSplitType(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: EMapSplitStateEnum.normal,
  });
}
