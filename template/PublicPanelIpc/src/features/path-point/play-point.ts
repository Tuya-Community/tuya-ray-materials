import { showToast } from '@ray-js/ray';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { point_dp_code } from './constant';
import { PointOptions, PointType, PlayState } from './type';
import { formatJSONStringDpToObject } from './utils';

export function playPoint() {
  let startListenId;
  let stopListenId;
  const cancelListen = () => {
    if (startListenId !== undefined) {
      devices.common.offDpDataChange(startListenId);
    }
    if (stopListenId) {
      devices.common.offDpDataChange(stopListenId);
    }
  };
  return {
    // 开始移动到节点
    start(pathId: number, id: number): Promise<boolean> {
      return new Promise(resolve => {
        const triggerRet = ret => {
          resolve(ret);
          cancelListen();
        };
        const dpState = devices.common.getDpState();
        if (dpState.wireless_powermode !== '1') {
          showToast({
            title: Strings.getLang('canNotCreatePathTip_no_in_origin'),
            icon: 'none',
          });
          triggerRet(-1);
          return;
        }
        const handDpDataChange = data => {
          if (data.dpState?.[point_dp_code] !== undefined) {
            const dpData = formatJSONStringDpToObject<PointOptions>(data.dpState?.[point_dp_code]);
            const { type, data: pointData } = dpData || {};
            // 执行运动轨迹失败，可能被其他打断啥的
            if (
              type === PointType.PLAY_POINT &&
              pointData?.id === id &&
              pointData?.pathId === pathId &&
              (pointData?.error > 0 || pointData?.state === PlayState.ERROR)
            ) {
              triggerRet(false);
              return;
            }
            if (
              type === PointType.PLAY_POINT &&
              pointData?.pathId === pathId &&
              pointData?.id === id
            ) {
              triggerRet(true);
            }
          }
        };
        startListenId = devices.common.onDpDataChange(handDpDataChange);
        // 发送指令，执行运动到点位
        devices.common.publishDps({
          [point_dp_code]: JSON.stringify({
            type: PointType.PLAY_POINT,
            data: {
              pathId,
              id,
            },
          }),
        });
      });
    },
    // 主动结束路径循环
    stop(pathId: number, id: number): Promise<boolean> {
      return new Promise(resolve => {
        const triggerRet = ret => {
          resolve(ret);
          cancelListen();
        };

        const handDpDataChange = data => {
          if (data.dpState?.[point_dp_code] !== undefined) {
            const dpData = formatJSONStringDpToObject<PointOptions>(data.dpState?.[point_dp_code]);
            const { type, data: pointData } = dpData || {};
            if (
              type === PointType.END_PLAY_POINT &&
              pointData?.pathId === pathId &&
              pointData?.id === id &&
              dpData?.data?.error > 0
            ) {
              triggerRet(false);
              return;
            }
            if (
              type === PointType.END_PLAY_POINT &&
              pointData?.pathId === pathId &&
              pointData?.id === id
            ) {
              triggerRet(true);
            }
          }
        };
        stopListenId = devices.common.onDpDataChange(handDpDataChange);
        // 发送指令，在节点在运动的时候，结束运动
        devices.common.publishDps({
          [point_dp_code]: JSON.stringify({
            type: PointType.END_PLAY_POINT,
            data: {
              pathId,
              id,
            },
          }),
        });
      });
    },
    end() {
      cancelListen();
    },
  };
}
