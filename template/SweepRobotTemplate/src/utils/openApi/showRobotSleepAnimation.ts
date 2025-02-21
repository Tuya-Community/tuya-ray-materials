import { IndoorMapApi, IndoorMapUtils } from '@ray-js/robot-map-component';
/**
 * @description 设置机器人的呼吸动画
 */
export default function showRobotSleepAnimation(mapId: number, showMode: boolean) {
  return mapId
    ? IndoorMapApi.showRobotBreatheAnimation(
        IndoorMapUtils.getMapInstance(mapId),
        showMode,
        undefined
      )
    : Promise.resolve();
}
