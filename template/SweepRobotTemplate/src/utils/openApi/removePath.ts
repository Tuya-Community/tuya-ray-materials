import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
/**
 * @description 从场景中，把地图路径移除掉
 */
export default function removePath(mapId: string) {
  IndoorMapApi.removePathFromScene(IndoorMapUtils.getMapInstance(mapId));
}
