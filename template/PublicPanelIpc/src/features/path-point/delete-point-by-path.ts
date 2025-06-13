import { showToast } from '@ray-js/ray';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { path_dp_code } from './constant';
import { PathOptions, PathType } from './type';
import { formatJSONStringDpToObject } from './utils';

export function deletePointByPath() {
  let id;
  const cancelListen = () => {
    if (id !== undefined) {
      devices.common.offDpDataChange(id);
    }
  };
  return {
    start(pathId: number, mpId: number): Promise<boolean> {
      return new Promise(resolve => {
        const triggerRet = ret => {
          resolve(ret);
          cancelListen();
        };
        const handDpDataChange = data => {
          if (data.dpState?.[path_dp_code] !== undefined) {
            const dpData = formatJSONStringDpToObject<PathOptions>(data.dpState?.[path_dp_code]);
            if (
              dpData.type === PathType.DELETE_POINT &&
              dpData.data?.pathId === pathId &&
              dpData?.data?.error > 0
            ) {
              showToast({
                icon: 'error',
                title: Strings.getLang('deletePointErrorToastTitle'),
              });
              triggerRet(false);
              return;
            }
            if (
              dpData.type === PathType.DELETE_POINT_SUC &&
              dpData.data?.pathId === pathId &&
              !dpData?.data?.error
            ) {
              triggerRet(true);
            }
          }
        };
        id = devices.common.onDpDataChange(handDpDataChange);
        // 发送删除路径中的节点dp指令
        devices.common.publishDps({
          [path_dp_code]: JSON.stringify({
            type: PathType.DELETE_POINT,
            data: {
              pathId,
              id: mpId,
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
