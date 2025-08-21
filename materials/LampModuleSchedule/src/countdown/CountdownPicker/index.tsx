import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, hideMenuButton, showMenuButton } from '@ray-js/ray';
import TyPicker from '@ray-js/components-ty-picker';

import Strings from '../../i18n';
import CountdownOpened from './countdownOpened';

import './index.less';

type Props = {
  isOnlyOne?: boolean; // 是否只支持倒计时
  countdown: number; // 倒计时剩余时间
  seconds: number; // 设置倒计时的时间
  opened?: boolean;
  showMenuButton?: boolean; // 是否展示菜单按钮
  onOpen?: () => void; // 开启倒计时
  onClose?: () => void; // 关闭倒计时
  onResetting?: () => void; // 重置倒计时
  onChange: (v: number[]) => void; // 日期组件数值时触发
};

const CountdownPicker = (props: Props) => {
  const {
    isOnlyOne,
    opened,
    seconds,
    countdown,
    showMenuButton: showMenu,
    onChange,
    onOpen,
    onClose,
    onResetting,
  } = props;
  const [disabled, setDisabled] = useState(false);
  const [secondList, setSecondList] = useState([]);
  useEffect(() => {
    hideMenuButton();
    return () => {
      if (showMenu) {
        showMenuButton();
      }
    };
  }, [showMenu]);

  useEffect(() => {
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds % 3600) / 60);
    if (hour === 0 && minute === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setSecondList([hour, minute]);
  }, [seconds]);

  const hours = useMemo(() => {
    return new Array<number>(25).fill(0).map((_, idx) => `${idx}`);
  }, []);
  const minutes = useMemo(() => {
    return new Array<number>(60).fill(0).map((_, idx) => `${idx}`);
  }, []);

  const [sourceList, setSourceList] = useState([hours, minutes]);

  const resetSourceList = () => {
    setSourceList([hours, minutes]);
  };

  const handleChange = (e: any) => {
    const [hour, minute] = e.value || [];
    if (hour === 0 && minute === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    // 取值范围在1min - 24h之间
    if (hour === 24) {
      setSourceList([hours, ['0']]);
      onChange && onChange([hour, 0]);
    } else {
      resetSourceList();
      onChange && onChange(e.value);
    }
  };

  // 倒计时设置时的展示模块
  const renderSetCountdown = () => {
    if (opened) {
      return null;
    }

    let buttonStyle = {};
    if (disabled) {
      buttonStyle = {
        backgroundColor: '#e5e5e5',
        color: '#969696',
      };
    }

    const countdownPickerHeight = 65;
    return (
      <View>
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingBottom: '180px',
          }}
        >
          <View
            style={{
              position: 'relative',
              height: '400rpx',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TyPicker
              wrapStyle={{
                height: '322px',
              }}
              indicatorStyle={{
                height: `${countdownPickerHeight}px`,
              }}
              columnWrapStyle={{
                height: `${countdownPickerHeight}px`,
                lineHeight: `${countdownPickerHeight}px`,
              }}
              fontSize={80}
              dataSource={sourceList}
              bgColor="transparent"
              value={secondList}
              onChange={handleChange}
              renderOverlay={() => {
                return (
                  <>
                    <Text className="countdown-picker-hour">{Strings.getLang('hour')}</Text>
                    <Text className="countdown-picker-minute">{Strings.getLang('minute')}</Text>
                  </>
                );
              }}
            />
          </View>
        </View>
        <View className="countdown-text-button-wrapper">
          <Button
            disabled={disabled}
            onClick={onOpen}
            className="countdown-text-button"
            style={buttonStyle}
          >
            {Strings.getLang('confirm')}
          </Button>
        </View>
      </View>
    );
  };

  // 倒计时开启后的展示模块
  const renderCountdownOpened = () => {
    if (!opened) {
      return null;
    }
    const handleResetting = () => {
      onResetting && onResetting();
    };
    return (
      <CountdownOpened
        countdown={countdown}
        seconds={seconds}
        onClose={onClose}
        onResetting={handleResetting}
      />
    );
  };
  let countdownWrapperStyle = {};
  if (isOnlyOne && opened) {
    countdownWrapperStyle = {
      marginTop: 0,
    };
  }
  return (
    <View className="countdown-picker-wrapper" style={countdownWrapperStyle}>
      {renderSetCountdown()}
      {renderCountdownOpened()}
    </View>
  );
};

CountdownPicker.defaultProps = {
  opened: true,
  isOnlyOne: false,
  showMenuButton: true,
  onOpen: () => null,
  onClose: () => null,
  onResetting: () => null,
};

export default CountdownPicker;
