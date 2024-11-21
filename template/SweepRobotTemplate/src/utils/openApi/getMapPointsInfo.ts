import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';

/**
 * @description 从地图中获取虚拟信息的相关数据
 */
export default function getMapPointsInfo(mapId: string, cb?: any) {
  return IndoorMapApi.getLaserMapPointsInfo(IndoorMapUtils.getMapInstance(mapId), { mapId }, cb);
}
