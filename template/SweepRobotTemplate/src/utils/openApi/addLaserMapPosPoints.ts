import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
import { addLaserMapPosPointsParams } from '@ray-js/robot-sdk-types';
/**
 * @description 向地图中添加一个定点清扫Layer
 */
export default function addLaserMapPosPoints(mapId: string, posPoints: addLaserMapPosPointsParams) {
  return IndoorMapApi.addLaserMapPosPoints(IndoorMapUtils.getMapInstance(mapId), posPoints);
}
