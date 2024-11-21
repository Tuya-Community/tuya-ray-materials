import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
/**
 * @description 获取地图分割和的数据信息
 */
export default function getLaserMapSplitPoint(mapId: string) {
  return IndoorMapApi.getLaserMapSplitPoint(IndoorMapUtils.getMapInstance(mapId), { mapId });
}
