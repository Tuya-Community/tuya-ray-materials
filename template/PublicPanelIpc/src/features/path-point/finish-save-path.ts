import { showToast } from '@ray-js/ray';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { path_dp_code } from './constant';
import { PathOptions, PathType } from './type';
import { formatJSONStringDpToObject } from './utils';

export function finishSavePath() {
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
            if (dpData.type === PathType.SAVE_PATH && dpData.data?.error > 0) {
              showToast({
                title: Strings.getLang('finishSavePathErrorToastTitle'),
                icon: 'none',
              });
              triggerRet(false);
            }
            if (
              dpData.type === PathType.SAVE_PATH &&
              !dpData.data.error &&
              dpData.data.pathId === pathId
            ) {
              triggerRet(true);
            }
          }
        };
        id = devices.common.onDpDataChange(handDpDataChange);
        devices.common.publishDps({
          [path_dp_code]: JSON.stringify({
            type: PathType.SAVE_PATH,
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
