import { showToast } from '@ray-js/ray';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { path_dp_code } from './constant';
import { PathOptions, PathType, PlayState } from './type';
import { formatJSONStringDpToObject } from './utils';

export function playPath() {
  let id;
  let stopListenId;
  const cancelListen = () => {
    if (id !== undefined) {
      devices.common.offDpDataChange(id);
    }
    if (stopListenId !== undefined) {
      devices.common.offDpDataChange(stopListenId);
    }
  };
  return {
    // 开始路径循环
    start(pathId: number): Promise<boolean> {
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
          if (data.dpState?.[path_dp_code] !== undefined) {
            const dpData = formatJSONStringDpToObject<PathOptions>(data.dpState?.[path_dp_code]);
            // 执行运动轨迹失败，可能被其他打断啥的
            if (
              dpData.type === PathType.PLAY_PATH &&
              dpData.data?.pathId === pathId &&
              (dpData?.data?.error > 0 || dpData?.data?.state === PlayState.ERROR)
            ) {
              triggerRet(false);
              return;
            }
            if (dpData.type === PathType.PLAY_PATH && dpData.data?.pathId === pathId) {
              triggerRet(true);
            }
          }
        };
        id = devices.common.onDpDataChange(handDpDataChange);
        // 发送指令，执行运动轨迹
        devices.common.publishDps({
          [path_dp_code]: JSON.stringify({
            type: PathType.PLAY_PATH,
            data: {
              pathId,
            },
          }),
        });
      });
    },
    // 主动结束路径循环
    stop(pathId: number): Promise<boolean> {
      return new Promise(resolve => {
        const triggerRet = ret => {
          resolve(ret);
          cancelListen();
        };
        const handDpDataChange = data => {
          if (data.dpState?.[path_dp_code] !== undefined) {
            const dpData = formatJSONStringDpToObject<PathOptions>(data.dpState?.[path_dp_code]);
            if (dpData?.type === PathType.END_PLAY_PATH && dpData?.data?.error > 0) {
              triggerRet(false);
              return;
            }
            if (dpData.type === PathType.END_PLAY_PATH && dpData.data?.pathId === pathId) {
              triggerRet(true);
            }
          }
        };
        stopListenId = devices.common.onDpDataChange(handDpDataChange);
        // 发送指令，在节点在运动的时候，结束运动
        devices.common.publishDps({
          [path_dp_code]: JSON.stringify({
            type: PathType.END_PLAY_PATH,
            data: {
              pathId,
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
