import { home } from '@ray-js/ray';
import { apiRequestByAtop } from '@ray-js/ray';
import { JsonUtil } from '@/utils/index';
const { getCurrentHomeInfo } = home;

export const api = <T>(url, postData, v = '1.0') => {
  return new Promise<T>((resolve, reject) => {
    const params = {
      api: url,
      postData: postData,
      version: v,
    };

    apiRequestByAtop({
      ...params,
      success: d => {
        const data = typeof d === 'string' ? JsonUtil.parseJSON(d) : d;

        console.log(
          `%c API调用成功: ${url}`,
          'color: white; background-color: green; padding: 2px;',
          params,
          data
        );

        resolve(data);
      },
      fail: err => {
        const e = typeof err === 'string' ? JsonUtil.parseJSON(err) : err;

        console.log(
          `%c API调用失败: ${url}`,
          'color: white; background-color: red; padding: 2px;',
          params,
          e
        );
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(e?.innerError?.errorMsg);
      },
    });
  });
};

// 获取家庭信息
export const fetchHomeInfoApi = () => {
  return new Promise<HomeInfo>((resolve, reject) => {
    getCurrentHomeInfo({
      success: resolve,
      fail: reject,
    });
  });
};
