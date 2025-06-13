import { showToast } from '@ray-js/ray';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { path_dp_code } from './constant';
import { PathOptions, PathType } from './type';
import { formatJSONStringDpToObject } from './utils';

export function createPath() {
  let id;
  const cancelListen = () => {
    if (id !== undefined) {
      devices.common.offDpDataChange(id);
    }
  };
  return {
    start(pathName: string): Promise<number> {
      return new Promise(resolve => {
        const triggerRet = ret => {
          resolve(ret);
          cancelListen();
        };
        const handDpDataChange = data => {
          if (data.dpState?.[path_dp_code] !== undefined) {
            const dpData = formatJSONStringDpToObject<PathOptions>(data.dpState?.[path_dp_code]);
            // 当前正在创建 path 中
            if (dpData.type === PathType.ADD_PATH && dpData.data?.error === 101) {
              showToast({
                title: Strings.getLang('canNotCreatePathTip_creating'),
                icon: 'none',
              });
              triggerRet(-1);
            }
            // 说明 path 创建成功，设备会上报 pathId
            if (dpData.type === PathType.ADD_PATH && !dpData.data.error && dpData.data.pathId) {
              triggerRet(dpData.data.pathId);
            }
          }
        };
        id = devices.common.onDpDataChange(handDpDataChange);
        const dpState = devices.common.getDpState();
        if (dpState.wireless_powermode !== '1') {
          showToast({
            title: Strings.getLang('canNotCreatePathTip_no_in_origin'),
            icon: 'none',
          });
          triggerRet(-1);
          return;
        }
        // 发送指令，创建 path
        devices.common.publishDps({
          [path_dp_code]: JSON.stringify({
            type: PathType.ADD_PATH,
            data: {
              pathName: pathName,
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
