import { getGroupDeviceList, getSystemInfoSync, navigateToMiniProgram } from 'ray';
import { getArray } from './kit';
import { dpCodes } from '@/constant/dpCodes';
import { queryDevDps } from './queryDevDps';
import { getGroupDeviceListFromDevInfo } from './getGroupDeviceListFromDevInfo';

type Params = DevInfo & { i18nTime: string; pv: string; codeIds: any };

export const isHarmony = getSystemInfoSync()?.platform === 'harmony';

enum PanelType {
  schedule = 'schedule', // 定时
  disturb = 'disturb', // 停电勿扰
  defaultLight = 'defaultLight', // 默认灯光
}

// 跳转到 RN 定时模块（包含定时 倒计时 灯光助眠 灯光唤醒）
export const navToSchedule = (devInfo: Params) => {
  const { i18nTime, pv: productVersion, devId, productId, groupId, codeIds } = devInfo;

  const jumpPanel = (targetDevId: string, targetGroupId = '') => {
    try {
      const countdownDpId = codeIds?.[dpCodes.countdown];
      if (countdownDpId && targetDevId) {
        queryDevDps(devInfo, {
          deviceId: targetDevId,
          dpIds: [countdownDpId],
          success(params) {
            console.log('query countdown dp success', params);
          },
          fail(params) {
            console.log('query countdown dp fail', params);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }

    if (isHarmony) {
      navigateToMiniProgram({
        appId: 'tylda4rtqafaagjiut', // MARK : input your miniapp id here
        path: `pages/home/index?deviceId=${targetDevId || ''}&groupId=${targetGroupId || ''}`,
        extraData: {
          rhythmsType: 1,
          cloudTimerCategory: 'category_timer',
        },
      });
    } else {
      ty.openPanel({
        deviceId: targetDevId || targetGroupId,
        extraInfo: {
          productId,
          i18nTime,
          bizClientId: '000001oq0f',
          uiType: 'RN',
          uiPhase: 'release',
          productVersion,
        },
        initialProps: {
          isGroup: !!targetGroupId,
          groupId: targetGroupId || '',
          pageType: PanelType.schedule,
        },
        success(params) {
          console.log('ty.openPanel success', params);
        },
        fail(error) {
          console.log('ty.openPanel fail', error);
        },
      });
    }
  };

  // 如果是群组设备，先获取群组中的第一个设备
  if (groupId) {
    getGroupDeviceListFromDevInfo({
      groupId,
      success(params) {
        const firstDev = getArray(params.deviceList)[0];
        if (firstDev?.devId) {
          jumpPanel(firstDev.devId, groupId);
        }
      },
      fail(error) {
        console.log('get group device list fail', error);
      },
    });
    return;
  }

  // 单个设备直接跳转
  jumpPanel(devId, groupId);
};

export default navToSchedule;
