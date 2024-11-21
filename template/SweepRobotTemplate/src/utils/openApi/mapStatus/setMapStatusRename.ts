import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
import { EMapSplitStateEnum, ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
/**
 * @description 设置地图进入重命名状态
 */
export default async function setMapStatusRename(mapId: string) {
  IndoorMapApi.setLaserMapSplitType(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: EMapSplitStateEnum.click,
  });
  await IndoorMapApi.setLaserMapStateAndEdit(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: ENativeMapStatusEnum.mapSplit,
    edit: false, // 这里需要设置edit为false
  });
}
