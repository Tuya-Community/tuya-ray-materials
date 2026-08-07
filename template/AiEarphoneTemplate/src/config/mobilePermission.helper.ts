import Strings from '@/i18n';
import { authorize, getSystemInfo } from '@ray-js/ray';

export enum MobilePermission {
  UserLocation = 'userLocation',
  Bluetooth = 'bluetooth',
  WritePhotosAlbum = 'writePhotosAlbum',
  Camera = 'camera',
}

const MobilePermissionErrorNotice = {
  [MobilePermission.UserLocation]: {
    title: Strings.getLang('auth_tips1'),
    content: Strings.getLang('auth_tips2'),
  },
  [MobilePermission.Bluetooth]: {
    title: Strings.getLang('auth_tips3'),
    content: Strings.getLang('auth_tips4'),
  },
};

/**
 * @description: 查询手机是否有某个权限
 * @return {*}
 */
export const authorizePermission = async (permissionType: MobilePermission): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const scope = `scope.${permissionType}`;
    authorize({
      scope,
      success: () => {
        resolve(true);
      },
      fail: async error => {
        const configError = { ...error, permissionType };
        reject(configError);
      },
    });
  });
};

export const permissionErrorHandler = async (error: any, permissionType: MobilePermission) => {
  const info: any = await getSystemInfo();
  const { platform } = info;
  if (error.errorCode === 9004) {
    ty.showModal({
      title: MobilePermissionErrorNotice[permissionType]?.title,
      content: MobilePermissionErrorNotice[permissionType]?.content,
      cancelText: Strings.getLang('cancel'),
      confirmText: Strings.getLang('setting'),
      success: async res => {
        if (res.confirm) {
          ty.openAppSystemSettingPage({
            scope: platform === 'ios' ? 'App-Settings' : 'App-Settings-Permission',
          });
        }
      },
    });
  }
};

/**
 * @description: 批量获取手机权限
 * @return {*}
 */
export const getMobilePermission = async (
  permissionTypes: MobilePermission[],
  index = 0
): Promise<boolean> => {
  if (index >= permissionTypes.length) return true;

  const permissionType = permissionTypes[index];
  const res = await authorizePermission(permissionType)
    .then(res => res)
    .catch(e => {
      permissionErrorHandler(e, e.permissionType);
      return false;
    });
  if (!res) {
    return false;
  }
  return getMobilePermission(permissionTypes, index + 1);
};

/**
 * @description: 获取手机蓝牙权限(如果是安卓手机，需要获取定位权限)
 * @return {*}
 */
export const getMobileBluetoothPermission = async (): Promise<boolean> => {
  const permissionTypes = [MobilePermission.Bluetooth];

  // 非iOS手机，需要获取定位权限
  const info: any = await getSystemInfo();
  if (info.platform !== 'ios') {
    permissionTypes.unshift(MobilePermission.UserLocation);
  }

  const res = await getMobilePermission(permissionTypes);
  return res;
};
