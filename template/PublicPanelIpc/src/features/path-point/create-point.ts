import { showToast } from '@ray-js/ray';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { path_dp_code } from './constant';
import { PathOptions, PathType } from './type';
import { formatJSONStringDpToObject } from './utils';

export function createPoint(pathId: number) {
  let id;
  const cancelListen = () => {
    if (id !== undefined) {
      devices.common.offDpDataChange(id);
    }
  };
  return {
    start(): Promise<number> {
      return new Promise(async resolve => {
        const triggerRet = ret => {
          resolve(ret);
          cancelListen();
        };
        let mpId;
        const handDpDataChange = data => {
          if (data.dpState?.[path_dp_code] !== undefined) {
            const pathState = formatJSONStringDpToObject<PathOptions>(data.dpState?.[path_dp_code]);
            // 当前无法给路径创建节点
            if (pathState.type === PathType.ADD_POINT && pathState?.data?.error > 0) {
              showToast({
                title: Strings.getLang('canNotCreatePathTip_creating'),
                icon: 'none',
              });
              triggerRet(-1);
              return;
            }

            // 点位添加成功
            if (pathState?.type === PathType.ADD_POINT_SUC && pathState?.data.id) {
              mpId = pathState.data.id;
            }

            // 点位成功添加到路径中
            if (
              pathState.type === PathType.ADD_POINT_PATH_SUC &&
              pathState.data.pathId === pathId
            ) {
              triggerRet(mpId);
            }
            // 兜底处理错误
            if (pathState.data.error > 0) {
              showToast({
                title: Strings.getLang('createPathPointErrorTitle'),
                icon: 'none',
              });
              triggerRet(-1);
            }
          }
        };
        id = devices.common.onDpDataChange(handDpDataChange);
        devices.common.publishDps({
          [path_dp_code]: JSON.stringify({
            type: PathType.ADD_POINT,
            data: {
              pathId,
              pointName: `${pathId}-${Math.floor(new Date().getTime() / 1000)}`,
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
