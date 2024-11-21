import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
import { EMapSplitStateEnum, ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
/**
 * @description 设置地图进入合并状态
 */
export default async function setMapStatusMerge(mapId: string): Promise<void> {
  IndoorMapApi.setLaserMapSplitType(IndoorMapUtils.getMapInstance(mapId), {
    state: EMapSplitStateEnum.merge,
    mapId,
  });
  await IndoorMapApi.setLaserMapStateAndEdit(IndoorMapUtils.getMapInstance(mapId), {
    state: ENativeMapStatusEnum.mapSplit,
    mapId,
    edit: true,
  });
}
