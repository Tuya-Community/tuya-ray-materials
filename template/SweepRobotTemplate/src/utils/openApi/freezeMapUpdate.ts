import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
/**
 * @description 冻结地图的更新
 */
export default function freezeMapUpdate(mapId: string, freeze: boolean) {
  IndoorMapApi.freezeMapUpdate(IndoorMapUtils.getMapInstance(mapId), freeze);
}
