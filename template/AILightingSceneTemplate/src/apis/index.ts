let __homeInfo = null;

export function getHomeInfo(): Promise<any> {
  return new Promise(resolve => {
    ty.home.getCurrentHomeInfo({
      success: info => {
        __homeInfo = info;
        resolve(info);
      },
      fail: error => {
        console.error('Error fetching home info:', error);
        resolve(null);
      },
    });
  });
}

export function getHomeId() {
  return __homeInfo?.homeId;
}

const request = (api, method, params): Promise<any> => {
  return new Promise((resolve, reject) => {
    console.log('request api:', api);
    console.log('request params', params);
    ty.apiRequestByHighway({
      api,
      data: params,
      method,
      success: response => {
        console.log('%c request success', 'color: green', api, response);
        resolve(response);
      },
      fail: error => {
        reject(error);
        console.warn('%c request fail', 'color: yellow', api, error);
      },
    });
  });
};

export default request;

// 获取云端场景数据列表
export const getSceneDataList = (homeId, roomId, sceneType) => {
  // const url = 'm.light.app.ai.rule.names';
  const url = '/v1.0/cloud/light/app/ai/rule/names';
  return request(url, 'POST', { ownerId: homeId, roomId, sceneType });
};

// 预览灯光场景
export const previewScene = params => {
  // const url = 'tuya.m.light.rule.preview';
  const url = '/v1.0/cloud/light/rule/preview';
  return request(url, 'POST', params);
};

// 保存灯光场景
export const saveScene = params => {
  // const url = 'tuya.m.light.rule.save';
  const url = '/v1.0/cloud/light/rule/save';
  return request(url, 'POST', params);
};
