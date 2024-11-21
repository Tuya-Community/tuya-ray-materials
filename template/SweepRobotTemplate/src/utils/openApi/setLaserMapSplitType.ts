import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
import { EMapSplitStateEnum } from '@ray-js/robot-sdk-types';
/**
 * @description 设置地图状态和编辑状态
 */
export default function setLaserMapSplitType(mapId: string, state: EMapSplitStateEnum) {
  if (!IndoorMapUtils.getMapInstance(mapId)) return;
  return IndoorMapApi.setLaserMapSplitType(IndoorMapUtils.getMapInstance(mapId), { mapId, state });
}
