import React, { useState, useEffect } from 'react';
import { View, Text, showToast } from '@ray-js/ray';
import { useConfig } from '@ray-js/components-ty-config-provider';

import { useSafeArea } from '../hooks';
import CountdownPicker from './CountdownPicker';
import Strings from '../i18n';
import { LampApi } from '../utils/LampApi';
import { useScheduleContext } from '../context';
import { EnumShowType } from '../types';

import './index.less';

type Props = {
  countdown?: number; // 倒数计剩余时间
  type: number; // 3 展示倒计时与定时
  showMenuButton?: boolean; // 是否展示菜单按钮
  showHeader?: boolean; // 是否展示头部
  opened?: boolean; // 倒计时是否正在运行
  onCancel?: () => void; // 取消按钮点击事件
  onOpenToggle?: (opened: boolean) => void; // 倒计时运行状态切换函数
};

const COUNTDOWN_VALUE = 'COUNTDOWN_VALUE';

const CountDownView = (props: Props) => {
  const { type, opened, countdown, showMenuButton, showHeader, onOpenToggle, onCancel } = props;
  const { props: _props } = useScheduleContext();
  const isOnlyOne = +type === EnumShowType.countdown; // 只有倒计时
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    LampApi.getAllCloudConfig &&
      LampApi.getAllCloudConfig().then(res => {
        if (Object.keys(res).length) {
          if (res[COUNTDOWN_VALUE] !== undefined) {
            setSeconds(res[COUNTDOWN_VALUE].data);
          }
        }
      });
  }, []);
  const handleChange = (e: number[]) => {
    const [hours, mins] = e || [];
    const secondsRes = hours * 3600 + mins * 60;
    setSeconds(secondsRes);
  };

  const handleResetting = () => {
    onOpenToggle && onOpenToggle(false);
  };

  const isSupportTiming = _props.supportCloudTimer || _props.supportRctTimer;
  const handleClose = () => {
    onOpenToggle && onOpenToggle(false);
    if (isSupportTiming) {
      onCancel && onCancel();
    }
    // 下发倒计时dp
    _props.onCountdownToggle && _props.onCountdownToggle(0);
  };
  const handleOpen = () => {
    // 大于24小时时间
    if (seconds > 86400) {
      showToast({
        title: Strings.getLang('countdownMaxHourTip'),
        mask: true,
      });
      return;
    }
    if (isSupportTiming) {
      onCancel && onCancel();
    } else {
      onOpenToggle && onOpenToggle(true);
    }
    LampApi.saveCloudConfig && LampApi.saveCloudConfig(COUNTDOWN_VALUE, seconds);
    // 下发倒计时dp
    _props.onCountdownToggle && _props.onCountdownToggle(seconds);
  };

  const theme = useConfig();
  const isDark = theme?.theme === 'dark';
  const safeArea = useSafeArea();
  const bgColor =
    theme?.backgroundColor ||
    theme?.background ||
    (isDark ? 'rgba(20, 20, 20, 1)' : 'rgba(245, 245, 245, 1)');

  const onlyOneStyle: any = {
    backgroundColor: bgColor,
  };

  if (isOnlyOne) {
    onlyOneStyle.margin = '0 40rpx';
    onlyOneStyle.display = 'flex';
    onlyOneStyle.justifyContent = 'space-between';
    onlyOneStyle.height = '100vh';
  }
  const handleCancelCountDown = () => {
    if (isOnlyOne) {
      return;
    }
    onCancel && onCancel();
  };

  const backStyle = {
    color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.9)',
  };
  const tipTitleStyle = {
    color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
  };
  const tipTextStyle = {
    color: isDark ? 'rgba(153, 153, 153, 1)' : 'rgba(153, 153, 153, 1)',
  };

  return (
    <View className={`countdown-view-wrapper ${isDark ? 'dark' : 'light'}`} style={onlyOneStyle}>
      <view>
        {(!showHeader || !isOnlyOne) && (
          <View
            style={{
              height: `${safeArea}px`,
            }}
          />
        )}
        <View
          style={{
            position: 'relative',
            height: '110rpx',
          }}
        >
          {!isOnlyOne && (
            <Text className="countdown-view-back" style={backStyle} onClick={handleCancelCountDown}>
              {Strings.getLang('cancel')}
            </Text>
          )}
          <View className="countdown-view-tips">
            <Text className="countdown-view-tips-title" style={tipTitleStyle}>
              {Strings.getLang('countdownTitle')}
            </Text>
            <Text className="countdown-view-tips-text" style={tipTextStyle}>
              {Strings.getLang('countdownTips')}
            </Text>
          </View>
        </View>
      </view>
      <CountdownPicker
        isOnlyOne={isOnlyOne}
        countdown={Number(countdown)}
        opened={opened}
        showMenuButton={showMenuButton}
        seconds={seconds}
        onOpen={handleOpen}
        onClose={handleClose}
        onResetting={handleResetting}
        onChange={handleChange}
      />
      <View style={{ height: '80rpx' }} />
    </View>
  );
};

CountDownView.defaultProps = {
  countdown: 0,
  opened: false,
  showMenuButton: true,
  showHeader: true,
  onCancel: () => null,
  onOpenToggle: () => null,
};

export default CountDownView;
