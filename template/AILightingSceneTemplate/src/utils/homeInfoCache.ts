import { home } from '@ray-js/ray';

const { getCurrentHomeInfo } = home;

type HomeInfoType = NonNullable<Parameters<typeof getCurrentHomeInfo>[0]>['success'] extends (
  params: infer P
) => void
  ? P
  : never;

class HomeInfoCache {
  private promise: Promise<HomeInfoType> | null = null;

  getHomeInfo(): Promise<HomeInfoType> {
    if (this.promise) {
      return this.promise;
    }

    this.promise = new Promise((resolve, reject) => {
      try {
        ty.home.getCurrentHomeInfo({
          success: res => {
            console.log('获取家庭信息成功:', res);
            resolve(res);
          },
          fail: error => {
            console.log('获取家庭信息失败:', error);
            this.clearCache();
            reject(error);
          },
        });
      } catch (err) {
        console.log('获取家庭信息失败--:', err);
        resolve({
          homeName: '相亲相爱一家人',
          homeId: '157697080',
          longitude: '116.397128',
          latitude: '39.907417',
          address: '北京市海淀区',
          admin: true,
        });
      }
    });

    return this.promise;
  }

  clearCache() {
    this.promise = null;
  }

  refreshCache(): Promise<HomeInfoType> {
    this.clearCache();
    return this.getHomeInfo();
  }
}

export const homeInfoCache = new HomeInfoCache();

// 便捷方法
export const getHomeInfo = () => homeInfoCache.getHomeInfo();
export const refreshHomeInfo = () => homeInfoCache.refreshCache();
export const clearHomeInfoCache = () => homeInfoCache.clearCache();
