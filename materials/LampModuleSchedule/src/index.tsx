import React, { useEffect } from 'react';
import ConfigProvider from '@ray-js/components-ty-config-provider';
import { hideMenuButton, showMenuButton } from '@ray-js/api';

import { ContextProvider } from './context';
import ScheduleView from './ScheduleView';
import { IProps } from './props';
import { setSupport } from './utils/supportUtils';
import { setDevId } from './utils/devId';
import { useCountdownTime, useCountdownDpPull, useTriggerChildrenFunction } from './hooks';

export { useCountdownTime, useCountdownDpPull, useTriggerChildrenFunction } from './hooks';

const defaultThemeConfig = {
  light: {
    // 整体背景色
    background: '#f5f5f5',
    // 主题
    theme: 'light',
    // 品牌色
    brandColor: '#1961CE',
    // 字体颜色
    fontColor: {
      titlePrimary: 'rgba(0, 0, 0, 0.9)', // 主要标题文字颜色
      textPrimary: 'rgba(0, 0, 0, 0.9)', // 主要文字颜色
      textRegular: 'rgba(0, 0, 0, 0.5)', // 常规文字颜色
    },
    // radio样式
    radio: {
      uncheckBorder: 'rgba(25, 97, 206, 0.1)',
      checkedBackground: 'rgba(25, 97, 206, 1)',
    },
    // 卡片样式
    card: {
      background: '#fff',
      borderColor: 'rgba(25, 97, 206, 0.15)',
      textPrimary: 'rgba(0, 0, 0, 0.9)',
      textRegular: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '48rpx',
    },
    // 时间选择器样式
    timer: {
      background: 'rgba(255, 255, 255, 0.95)',
      timerPickerBorderColor: '#cfd0d0',
      customStyle: {
        leftArrowTheme: 'light',
        color: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(25, 97, 206, 0.15)',
        boxShadowColor: 'rgba(0, 33, 13, 0.04)',
        background: '#fff',
      },
    },
  },
  dark: {
    // 整体背景色
    background: 'rgba(14, 38, 62, 1)',
    // 主题
    theme: 'dark',
    // 品牌色
    brandColor: 'rgba(0, 190, 155, 1)',
    // 字体颜色
    fontColor: {
      titlePrimary: 'rgba(255, 255, 255, 0.9)', // 主要标题文字颜色
      textPrimary: 'rgba(255, 255, 255, 0.9)', // 主要文字颜色
      textRegular: 'rgba(255, 255, 255, 0.5)', // 常规文字颜色
    },
    // radio样式
    radio: {
      uncheckBorder: 'rgba(25, 97, 206, 0.1)',
      checkedBackground: 'rgba(0, 190, 155, 1)',
    },
    // 卡片样式
    card: {
      background: '#24354b',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textPrimary: 'rgba(255, 255, 255, 0.9)',
      textRegular: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '48rpx',
    },
    // 时间选择器样式
    timer: {
      background: 'rgba(14, 38, 62, 1)',
      timerPickerBorderColor: '#cfd0d0',
      customStyle: {
        leftArrowTheme: 'light',
        color: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        background: '#24354b',
      },
    },
  },
};

const LampModuleSchedule = (props: IProps) => {
  const {
    devId = '',
    groupId = '',
    timingConfig,
    showMenuButton: isShowMenuButton,
    themeConfig,
  } = props;
  useEffect(() => {
    if (!isShowMenuButton) {
      hideMenuButton();
    }
    return () => {
      if (isShowMenuButton) {
        showMenuButton();
      }
    };
  }, []);
  const { theme = 'light' } = themeConfig;
  const defaultStyle = theme === 'dark' ? defaultThemeConfig.dark : defaultThemeConfig.light;
  const mergedThemeStyle = { ...defaultStyle, ...themeConfig };
  useEffect(() => {
    const { background, fontColor } = mergedThemeStyle;
    ty.setNavigationBarColor({
      frontColor: fontColor.textPrimary,
      backgroundColor: background,
      animation: {
        duration: 300,
        timingFunc: 'linear',
      },
    });
  }, []);
  const { actionList } = timingConfig;
  setDevId(devId, groupId);
  setSupport({
    isSupportLocalTimer: props.supportRctTimer,
    isSupportCloudTimer: props.supportCloudTimer,
    isSupportCountdown: props.supportCountdown,
  });
  if ((!devId && !groupId) || !actionList.length) {
    return null;
  }
  // eslint-disable-next-line no-param-reassign
  props.timingConfig.actionList = actionList.map((i, idx) => {
    return {
      ...i,
      value: idx + 1,
    };
  });
  return (
    <ConfigProvider config={mergedThemeStyle}>
      <ContextProvider props={props}>
        <ScheduleView {...props} />
      </ContextProvider>
    </ConfigProvider>
  );
};

LampModuleSchedule.useCountdownTime = useCountdownTime;
LampModuleSchedule.useCountdownDpPull = useCountdownDpPull;
LampModuleSchedule.useTriggerChildrenFunction = useTriggerChildrenFunction;

export default React.memo(LampModuleSchedule);
