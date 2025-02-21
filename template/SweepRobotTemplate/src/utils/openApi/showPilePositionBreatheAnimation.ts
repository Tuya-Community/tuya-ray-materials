import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
/**
 * @description 设置充电桩的呼吸动画
 */
export default function showPilePositionBreatheAnimation(mapId: number, showMode: boolean) {
  return mapId
    ? IndoorMapApi.showPilePositionBreatheAnimation(
        IndoorMapUtils.getMapInstance(mapId),
        showMode,
        undefined
      )
    : Promise.resolve();
}
