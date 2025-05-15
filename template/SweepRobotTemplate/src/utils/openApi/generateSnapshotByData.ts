import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
/**
 * @description 使用openApi 进行地图截图
 */
export default function generateSnapshotByData(
  mapId: string,
  mapData: {
    originMap: any;
    areaInfoList: string;
  },
  opts?: {
    height: number;
    width: number;
  }
) {
  return IndoorMapApi.generateSnapshotByData(IndoorMapUtils.getMapInstance(mapId), mapData, opts);
}
