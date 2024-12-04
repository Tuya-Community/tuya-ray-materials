import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';

/**
 * @description 获取地图所有区域的信息
 */
const getAllMapAreaInfo = (mapId: string, withHull = false) => {
  return IndoorMapApi.getAllMapAreaInfo(IndoorMapUtils.getMapInstance(mapId), withHull);
};

export default getAllMapAreaInfo;
