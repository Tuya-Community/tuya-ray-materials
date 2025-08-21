/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useRef } from 'react';
import { useInterval } from 'ahooks';
import { getSystemInfoSync } from '@ray-js/ray';
import { useScheduleContext } from './context';

/**
 * 是否支持定时功能（包含云定时和本地定时）
 */
export const useSupportTimer = () => {
  let isSupport = false;
  useEffect(() => {
    const { props } = useScheduleContext();
    if (props?.supportRctTimer || props?.supportCloudTimer) {
      isSupport = true;
    }
  }, []);
  return isSupport;
};

let isEven = false;
let offsetTime = 1000;
export const useCountdownTime = (second: number, callback: (countdown: number) => void) => {
  const clear = useInterval(
    () => {
      // eslint-disable-next-line no-param-reassign
      second--;
      if (second >= 0) {
        callback && callback(second);
      } else {
        clear();
      }
    },
    // 防止 second 变换后，useInterval 不会重新执行
    isEven ? offsetTime++ : offsetTime--
  );
  isEven = !isEven;
  return clear;
};

// 拉取倒计时dp数据
export const useCountdownDpPull = (devId: string, countdownId: number): void => {
  useEffect(() => {
    if (!devId || !countdownId) {
      return;
    }
    ty.device.getDpDataByMesh({
      deviceId: devId,
      dpIds: [countdownId],
    });
  }, [!devId, !countdownId]);
};
let systemInfo = {};
export const useHourSystem = () => {
  const systemInfoRef = useRef(getSystemInfoSync());
  const { is24Hour } = systemInfoRef.current;
  systemInfo = systemInfoRef.current;
  return {
    is24Hour: !!is24Hour,
    is12Hour: !is24Hour,
  };
};

type TTypeString = 'timerToggle' | 'closeAllTimer';
const funWeakMap = new Map();
export const useTriggerChildrenFunction = (
  type?: TTypeString
): {
  run: (...args: any) => void;
  add: (type: TTypeString, fn: (...args: any) => void) => void;
} => {
  return {
    run(...args) {
      const typeFn = funWeakMap.get(type);
      typeFn && typeFn(...args);
    },
    add(type: TTypeString, fn: (...args: any) => void) {
      funWeakMap.set(type, fn);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSafeArea = () => {
  let info = systemInfo;
  if (!info) {
    systemInfo = getSystemInfoSync();
    info = systemInfo;
  }
  return info?.statusBarHeight || 30;
};

export const useThemeStyle = (darkStyle, lightStyle, themeType) => {
  return themeType === 'dark' ? darkStyle : lightStyle;
};

export const useSystemInfo = () => {
  let info = systemInfo;
  if (!info) {
    systemInfo = getSystemInfoSync();
    info = systemInfo;
  }
  return systemInfo || {};
};

export const useIphoneX = () => {
  let info = systemInfo;
  if (!info) {
    systemInfo = getSystemInfoSync();
    info = systemInfo;
  }
  const { model = '' } = info;
  const matched = model.match(/iPhone\s?(\d+)/);
  const matched1 = /iPhone\s?X/i.test(model);
  let isIphoneX = false;
  if (matched || matched1) {
    const version = matched1 || matched[1];
    isIphoneX = matched1 || version >= 10;
  }
  return isIphoneX;
};
