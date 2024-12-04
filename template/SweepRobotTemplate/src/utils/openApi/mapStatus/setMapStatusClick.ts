import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
import { EMapSplitStateEnum, ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
/**
 * @description 设置地图进入点击状态
 */
export default async function setMapStatusClick(mapId: string): Promise<void> {
  IndoorMapApi.setLaserMapSplitType(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: EMapSplitStateEnum.click,
  });
  await IndoorMapApi.setLaserMapStateAndEdit(IndoorMapUtils.getMapInstance(mapId), {
    mapId,
    state: ENativeMapStatusEnum.mapClick,
    edit: false,
  });
}
