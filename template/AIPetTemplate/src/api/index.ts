import { home } from '@ray-js/ray';

const { getCurrentHomeInfo } = home;

// 获取家庭信息
export const fetchHomeInfoApi = () => {
  return new Promise<HomeInfo>((resolve, reject) => {
    getCurrentHomeInfo({
      success: resolve,
      fail: reject,
    });
  });
};
