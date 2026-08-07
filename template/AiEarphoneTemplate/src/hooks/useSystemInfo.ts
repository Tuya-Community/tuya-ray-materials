import { useEffect } from 'react';
import { getSystemInfoSync } from '@ray-js/ray';
import store from '@/redux';
import { updateSystemInfo } from '@/redux/modules/systemInfoSlice';
import { pageReadyBus } from '@/utils/pageReadyBus';
import { tttReadyToSetupNativeChannel } from '@/api/ttt';

/**
 * 初始化系统信息的 hook
 */
export const useSystemInfo = () => {
  // 建立小程序和客户端通道(仅ios)
  const readyToSetupNativeChannel = async () => {
    try {
      await tttReadyToSetupNativeChannel();
    } catch {
    }
  };

  // 初始化系统信息
  const initializeSystemInfo = async () => {
    const systemInfo = getSystemInfoSync();
    const {
      statusBarHeight,
      screenHeight,
      safeArea: { bottom },
      platform,
      // @ts-ignore
      useableWindowHeight,
    } = systemInfo;
    const topBarHeight = statusBarHeight + 44;
    const safeBottomHeight = screenHeight - bottom;

    store.dispatch(
      updateSystemInfo({
        ...systemInfo,
        topBarHeight,
        safeBottomHeight,
        platform: platform.toLowerCase(),
        useWindowHeight: useableWindowHeight || screenHeight,
      })
    );

    if (/ios/gi.test(platform)) {
      readyToSetupNativeChannel();
    }
  };

  useEffect(() => {
    initializeSystemInfo();

    pageReadyBus.on('page-ready', initializeSystemInfo);
    return () => {
      pageReadyBus.off('page-ready', initializeSystemInfo);
    };
  }, []);
};
