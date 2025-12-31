import { getHomeInfo } from './homeInfoCache';

export const getAppHomeId = async (): Promise<string> => {
  try {
    const homeInfo = await getHomeInfo();
    return homeInfo.homeId;
  } catch (err) {
    console.error('获取家庭ID失败:', err);
    return '';
  }
};

export const getAppHomeInfo = async (): Promise<any> => {
  try {
    const homeInfo = await getHomeInfo();
    return homeInfo;
  } catch (err) {
    console.error('获取家庭ID失败:', err);
    return '';
  }
};
