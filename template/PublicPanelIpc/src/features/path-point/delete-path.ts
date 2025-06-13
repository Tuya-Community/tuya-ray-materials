import { devices } from '@/devices';
import { showToast } from '@ray-js/ray';
import Strings from '@/i18n';
import { path_dp_code } from './constant';
import { PathOptions, PathType } from './type';
import { formatJSONStringDpToObject } from './utils';

export function deletePath() {
  let id;
  const cancelListen = () => {
    if (id !== undefined) {
      devices.common.offDpDataChange(id);
    }
  };
  return {
    start(pathId: number): Promise<boolean> {
      return new Promise(resolve => {
        const triggerRet = ret => {
          resolve(ret);
          cancelListen();
        };
        const handDpDataChange = data => {
          if (data.dpState?.[path_dp_code] !== undefined) {
            const dpData = formatJSONStringDpToObject<PathOptions>(data.dpState?.[path_dp_code]);
            const { type, data: pathData } = dpData || {};
            if (type === PathType.DELETE_PATH && !pathData?.error) {
              triggerRet(true);
              return;
            }
            if (type === PathType.DELETE_PATH && pathData?.error > 0) {
              triggerRet(false);
              showToast({
                title: Strings.getLang('deletePathError'),
                icon: 'error',
              });
            }
          }
        };
        id = devices.common.onDpDataChange(handDpDataChange);
        // 发送删除路径的 DP 指令
        devices.common.publishDps({
          [path_dp_code]: JSON.stringify({
            type: PathType.DELETE_PATH,
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
