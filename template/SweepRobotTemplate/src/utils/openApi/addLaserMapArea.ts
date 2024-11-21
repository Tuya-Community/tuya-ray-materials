import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
import { CreateOneForbidAreaParams, CreateOneVirtualWallParams } from '@ray-js/robot-sdk-types';

/**
 * @description 增加一个禁区/划区/虚拟墙
 */
export default function addLaserMapArea(
  mapId: string,
  area: Pick<CreateOneForbidAreaParams, 'area'> | Pick<CreateOneVirtualWallParams, 'area'>
) {
  return IndoorMapApi.addLaserMapArea(IndoorMapUtils.getMapInstance(mapId), { mapId, area });
}
