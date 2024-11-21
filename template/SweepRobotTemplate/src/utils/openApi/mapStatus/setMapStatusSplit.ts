import { EMapSplitStateEnum, ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';

/**
 * @description 设置地图进入分割状态
 */
export default async function setMapStatusSplit(mapId: string) {
  IndoorMapApi.setLaserMapSplitType(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: EMapSplitStateEnum.split,
  });

  await IndoorMapApi.setLaserMapStateAndEdit(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: ENativeMapStatusEnum.mapSplit,
    edit: true,
  });
}
