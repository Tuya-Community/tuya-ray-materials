import { JsonUtil } from '@/utils/index';
import {
  apiRequestByAtop,
  getActivityInfo,
  getLatestLocation,
  getOutdoorDeviceIcon,
  getVehicleDetail,
  GetVehicleImgUrl,
} from '@ray-js/ray';

const errStyle = 'background: red; color: #fff;';
const successStyle1 = 'background: pink; color: #000;';
const successStyle2 = 'background: palegoldenrod; color: #000;';
const successStyle3 = 'background: powderblue; color: #000;';

export const api = (a, postData, v = '1.0') => {
  return new Promise((resolve, reject) => {
    const params = {
      api: a,
      postData: postData,
      version: v,
    };
    apiRequestByAtop({
      ...params,
      success: d => {
        const data = typeof d === 'object' ? JsonUtil.parseJSON(d) : d;
        console.log(
          `%c request success: %c api:${a} %c data: ${JSON.stringify(postData)}%o`,
          successStyle3,
          successStyle1,
          successStyle2,
          data
        );
        resolve(data);
      },
      fail: err => {
        console.log('err :>> ', err, typeof err);
        const e = typeof err === 'string' ? JsonUtil.parseJSON(err) : err;
        console.log(`API Failed: %c${a}%o`, errStyle, e.message || e.errorMsg || e);
        reject();
      },
    });
  });
};

// 获取banner图
export const getBanner = (): Promise<any> =>
  getActivityInfo({ activityTypes: '1,2,3', time: Date.now() });

// 获取设备最新位置
export const getCarLatestLocation = (deviceId: string): Promise<any> =>
  getLatestLocation({ deviceId, proSource: '' });

// 获取设备图标
export const getDeviceIcon = (deviceId: string): Promise<any> =>
  getOutdoorDeviceIcon({ deviceIds: [deviceId] });

export const getRowData = (key: string): Promise<boolean> => {
  if (typeof ty.getNgRawData !== 'function') return Promise.resolve(false);
  return new Promise<boolean>((resolve, reject) => {
    ty.getNgRawData({
      rawKey: key,
      success: res => {
        console.log(`${key} 获取对应NG元数据 >> `, res);
        resolve(res?.rawData === 'true');
      },
      fail: fail => {
        console.log(`${key} 获取对应NG元数据失败 >> `, fail);
        resolve(false);
      },
    });
  });
};

export const isBLEXDeviceTTT = (devId): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    ty.outdoor.isBLEXDevice({
      deviceID: devId,
      success: res => {
        console.log('是否是ble+x设备 :>> ', res);
        resolve(res);
      },
      fail: fail => {
        console.log('是否是ble+x设备获取失败 >> ', fail);
        resolve(false);
      },
    });
  });
};

export const isBLEXDeviceActive = (devId): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    ty.outdoor.isBLEXDeviceActived({
      deviceID: devId,
      success: activeRes => {
        resolve(activeRes);
        console.log('蜂窝是否激活 :>> ', activeRes);
      },
      fail: fail => {
        console.log('蜂窝是否激活判断失败 >> ', fail);
        resolve(false);
      },
    });
  });
};

// 获取 扩展模组关联事件配置
export const getExtendedModuleExtConfig = (devId: string): Promise<IAbility> => {
  return new Promise((resolve, reject) => {
    ty.outdoor.getExtendedModuleExtConfig({
      deviceID: devId,
      success: extConfigRes => {
        resolve(extConfigRes);
        console.log('扩展模组数据 :>> ', extConfigRes);
      },
      fail: fail => {
        console.log('扩展模组数据获取失败 >> ', fail);
        reject();
      },
    });
  });
};

// 获取设备增值服务能力
export const getCServicesAbility = (devId: string): Promise<IAbility> => {
  return new Promise((resolve, reject) => {
    ty.outdoor.getValueAddedServicesAbility({
      deviceID: devId,
      success: res => {
        const { result } = res;
        if (result && result?.abilityMap) {
          const { outdoor_data_cloud_store: serviceResult } = result.abilityMap;
          console.log('serviceResult :>> ', serviceResult);
          resolve(serviceResult);
        }
        console.log('获取设备增值服务能力 :>> ', result);
      },
      fail: fail => {
        console.log('获取设备增值服务能力失败 >> ', fail);
        reject();
      },
    });
  });
};

// 设置弹窗状态
export const setCServicesPop = (devId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    ty.outdoor.setValueAddedServicesPop({
      deviceID: devId,
      hadPopup: true,
      success: result => {
        resolve(true);
        console.log('setCServicesPop :>> ', result);
      },
      fail: fail => {
        console.log('setCServicesPop fail >> ', fail);
        reject();
      },
    });
  });
};

// 获取车辆详情
export const getCarInfo = (deviceId: string): any => getVehicleDetail({ deviceId });

// 获取车辆详情图片地址
export const getCarImgUrl = (bizKey: string) => GetVehicleImgUrl({ bizKey });

export const getNgData = (rawKey: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    ty.getNgRawData({
      rawKey,
      success: res => {
        console.log(`获取对应NG元数据 ${rawKey} >> `, res);
        if (res?.rawData === 'true') {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: fail => {
        console.log('fail >> ', fail);
        reject(fail);
      },
    });
  });
};
