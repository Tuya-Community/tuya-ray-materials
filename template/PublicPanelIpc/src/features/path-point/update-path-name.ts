import { devices } from '@/devices';
import { showToast } from '@ray-js/ray';
import Strings from '@/i18n';
import { path_dp_code } from './constant';
import { PathOptions, PathType } from './type';
import { formatJSONStringDpToObject } from './utils';

export function updatePathName() {
  let id;
  const cancelListen = () => {
    if (id !== undefined) {
      devices.common.offDpDataChange(id);
    }
  };
  return {
    start(pathId: number, pathName: string): Promise<boolean> {
      return new Promise(resolve => {
        const triggerRet = ret => {
          resolve(ret);
          cancelListen();
        };
        const handDpDataChange = data => {
          if (data.dpState?.[path_dp_code] !== undefined) {
            const dpData = formatJSONStringDpToObject<PathOptions>(data.dpState?.[path_dp_code]);
            if (dpData.type === PathType.UPDATE_PATH_NAME && !dpData?.data?.error) {
              triggerRet(true);
            }
            if (dpData.type === PathType.UPDATE_PATH_NAME && dpData?.data?.error > 0) {
              triggerRet(false);
              showToast({
                title: Strings.getLang('updatePathNameError'),
                icon: 'error',
              });
            }
          }
        };
        id = devices.common.onDpDataChange(handDpDataChange);
        devices.common.publishDps({
          [path_dp_code]: JSON.stringify({
            type: PathType.UPDATE_PATH_NAME,
            data: {
              pathId,
              pathName,
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
