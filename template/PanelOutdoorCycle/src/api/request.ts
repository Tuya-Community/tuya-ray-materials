import { apiRequestByAtop } from '@ray-js/ray';
import { utils } from '@ray-js/panel-sdk';

const errStyle = 'background: red; color: #fff;';

export const api = (a: string, postData: Record<string, any>, v = '1.0') => {
  return new Promise((resolve, reject) => {
    const params = {
      api: a,
      postData: postData,
      version: v,
    };
    apiRequestByAtop({
      ...params,
      success: d => {
        const data = typeof d === 'string' ? utils.parseJSON(d) : d;
        resolve(data);
      },
      fail: err => {
        const e = typeof err === 'string' ? (utils.parseJSON(err) as typeof err) : err;
        console.log(`API Failed: %c${a}%o`, errStyle, e.errorMsg || e);
        reject();
      },
    });
  });
};

/**
 * 骑行记录
 * @param param0 deviceId | 设备id
 * @returns lastId | 最后一条记录id
 * @returns lastIdStr | 最后一条记录id 字符串
 * @returns deviceId | 设备id
 * @returns segmentList | 轨迹列表
 * segmentList: [{ duration, startTime, endTime, speed, mileage, battery }] : [{ 骑行时长，开始时间，结束时间，速度，里程 }]
 * @returns areLastPage | 是否是最后一页
 */

export const getTrackSegmentList = (deviceId: string): Promise<ITrackSegment> => {
  return ty.getOutdoorsTracksSegments({
    deviceID: deviceId,
    startTime: 0,
    endTime: new Date().getTime(),
  });
};

/**
 * 获取设备增值服务能力
 * @param deviceId | 设备id
 */
export const getCServicesAbility = (devId: string): Promise<IAbility> => {
  return new Promise((resolve, reject) => {
    ty.outdoor.getValueAddedServicesAbility({
      deviceID: devId,
      success: res => {
        const { result } = res;
        if (result && result?.abilityMap) {
          //  outdoor_data_cloud_store： 出行增值服务
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

// 设置C端弹窗状态
export const setCServicesPop = (devId: string) => {
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
