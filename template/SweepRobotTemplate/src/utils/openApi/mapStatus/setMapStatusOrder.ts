import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
/**
 * @description 设置地图进入房间排序状态
 */

export default async function setMapStatusOrder(mapId: string) {
  await IndoorMapApi.setLaserMapStateAndEdit(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: ENativeMapStatusEnum.mapSelect,
    edit: true, // 这里需要设置edit为false
  });
}
