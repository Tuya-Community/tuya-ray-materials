import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, showToast, hideMenuButton } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui/es/nav-bar';
import { ConfigProvider } from '@ray-js/smart-ui/es/config-provider';
import { Button } from '@ray-js/smart-ui/es/button';
import { Picker } from '@ray-js/smart-ui/es/picker';
import Color from 'color';
import XIcon from '@tuya-miniapp/icons/dist/svg/Xmark';

import { IProps } from './props';
import CountdownCircle from './components/CountdownCircle';
import './index.less';
import Strings from './i18n';
import { Icon } from '@ray-js/smart-ui';

const prefixClass = 'countdown';

const CountDown = (props: IProps) => {
  const {
    isDarkTheme = true,
    style = {},
    className = '',
    countdownDp,
    power = false,
    restCountdown,
    onConfirm,
    onCancel,
    onClose,
    type = 'hourMinute',
    bgColor: _bgColor,
    bgImg: _bgImg = '',
    themeColor: _themeColor,
    fontColor: _fontColor,
    circleBgColor: _circleBgColor,
    confirmTextColor: _confirmTextColor
  } = props;

  let themeConfig = {
    bgColor: _bgColor,
    bgImg: _bgImg,
    themeColor: _themeColor,
    fontColor: _fontColor,
    circleBgColor: _circleBgColor,
    confirmTextColor: _confirmTextColor
  };
  const _themeConfig = Object.keys(themeConfig).reduce((pre, key) => {
    if (themeConfig[key]) {
      pre[key] = themeConfig[key];
    }
    return pre;
  }, {});

  if (isDarkTheme) {
    themeConfig = {
      bgColor: '#1a1a1a',
      bgImg: '',
      themeColor: '#3b82f7',
      fontColor: '#fff',
      circleBgColor: 'rgba(255, 255, 255, 0.1)',
      confirmTextColor: '#ffffff',
      ..._themeConfig
    }
  } else { 
    themeConfig = {
      bgColor: '#ffffff',
      bgImg: '',
      themeColor: '#3b82f7',
      fontColor: 'rgba(0, 0, 0, 0.9)',
      circleBgColor: 'rgba(0, 0, 0, 0.05)',
      confirmTextColor: '#ffffff',
      ..._themeConfig
    }
  }
  const { fontColor, bgColor, bgImg, themeColor, confirmTextColor, circleBgColor } = themeConfig;
  const isMinuteSecond = type === 'minuteSecond';
  const unitColor = Color(fontColor)?.alpha(0.5)?.lighten(0.5)?.rgb()?.string();

  const onResetting = () => {
    setShowCircle(false);
  };

  const defaultHour = 0; // 默认0小时
  const defaultMin = 1; // 默认1分钟
  const defaultSec = 0; // 默认0秒

  const [showCircle, setShowCircle] = useState(false);

  useEffect(() => {
    setShowCircle(+countdownDp !== 0);
  }, [countdownDp]);

  const countdownTimeList = useMemo(() => {
    if (!countdownDp) {
      return [defaultHour, defaultMin, defaultSec];
    }
    const _hour = Math.floor(+restCountdown / 3600);
    const _min = Math.floor((+restCountdown % 3600) / 60);
    const _sec = +restCountdown % 60;
    return [_hour, _min, _sec];
  }, [countdownDp, restCountdown]);

  const [hours, setHour] = useState(countdownTimeList[0]);
  const [minutes, setMinutes] = useState(countdownTimeList[1]);
  const [seconds, setSeconds] = useState(countdownTimeList[2]);

  // 生成时间数据
  const hoursList = Array.from({ length: 24 }, (_, i) => i); // 24 hours
  const minutesList = Array.from({ length: 60 }, (_, i) => i);
  const secondsList = Array.from({ length: 60 }, (_, i) => i);

  const columns = useMemo(() => {
    if (isMinuteSecond) {
      return [
        {
          activeIndex: 0,
          values: minutesList,
          className: `${prefixClass}_column`,
          unit: Strings.getLang('lp_ct_minute'),
          defaultIndex: minutes,
          disabled: false,
        },
        {
          activeIndex: 0,
          values: secondsList,
          className: `${prefixClass}_column`,
          unit: Strings.getLang('lp_ct_second'),
          defaultIndex: seconds,
          disabled: false,
        },
      ];
    }
    return [
      {
        values: hoursList,
        className: `${prefixClass}_column`,
        unit: Strings.getLang('lp_ct_hour'),
        defaultIndex: hours,
        disabled: false,
      },
      {
        activeIndex: 0,
        values: minutesList,
        className: `${prefixClass}_column`,
        unit: Strings.getLang('lp_ct_minute'),
        defaultIndex: minutes,
        disabled: false,
      },
    ];
  }, [isMinuteSecond, minutes, hours, seconds]);

  const handleChange = useCallback(
    event => {
      const { value } = event.detail;
      if (isMinuteSecond) {
        setMinutes(value[0]);
        setSeconds(value[1]);
      } else {
        setHour(value[0]);
        setMinutes(value[1]);
      }
    },
    [isMinuteSecond]
  );

  const handleConfirm = () => {
    const _countdownValue = +hours * 3600 + +minutes * 60 + +seconds;
    if (+_countdownValue === 0) {
      showToast({
        title: Strings.getLang('lp_ct_countdown_less_than_zero'),
        icon: 'error',
      });
      return;
    }
    if (isMinuteSecond) {
      onConfirm(minutes * 60 + seconds);
      return;
    }
    onConfirm(hours * 3600 + minutes * 60 + seconds);
  };

  const onOffText = !power ? Strings.getLang('lp_ct_on') : Strings.getLang('lp_ct_off');

  const handleClose = () => {
    onClose && onClose();
  };

  useEffect(() => {
    hideMenuButton();
  }, []);

  const handleResetting = () => {
    onResetting && onResetting();
    setHour(defaultHour);
    setMinutes(defaultMin);
    setSeconds(defaultSec);
  };

  const tipTextColor = Color(fontColor)?.alpha(0.7)?.lighten(0.7)?.rgb()?.string();
  const renderCountdown = () => {
    const countdownOpenedCircleStyle = {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    } as React.CSSProperties;
    bgImg && (countdownOpenedCircleStyle.backgroundImage = `url(${bgImg})`);
    bgColor && (countdownOpenedCircleStyle.backgroundColor = bgColor);
    return (
      <View style={countdownOpenedCircleStyle} className={`${prefixClass}-content-container`}>
        <NavBar
          safeAreaInsetTop
          title={Strings.formatValue('lp_ct_countdownTitle', onOffText)}
          border={false}
          slot={{
            left: (
              <View
                className={`${prefixClass}_close-button`}
                onClick={onCancel}
              >
                <Icon name={XIcon} size={24} color={fontColor}  />
              </View>
            )
          }}
        />
        <ScrollView refresherTriggered={false} scrollY className={`${prefixClass}_scrollView`}>
          <View
            className={`${prefixClass}_tip`}
            style={{
              color: tipTextColor,
            }}
          >
            {Strings.formatValue('lp_ct_countdownTips1', onOffText)}
          </View>
          <View className={`${prefixClass}_picker-wrapper`}>
            <Picker
              columns={columns}
              animationTime={300}
              changeAnimation={false}
              onChange={handleChange}
              showToolbar={false}
              itemHeight={70}
              className={`${prefixClass}_picker`}
            />
          </View>
          <View className={`${prefixClass}_confirm-button-wrapper`}>
            <View
              className={`${prefixClass}_confirm-button`}
                style={{
                  backgroundColor: themeColor,
                  color: confirmTextColor,
                }}
                onClick={handleConfirm}
            >
                {Strings.getLang('lp_ct_confirm')}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ConfigProvider
      themeVars={{
        navBarTextColor: fontColor,
        navBarTitleTextColor: fontColor,
        navBarBackgroundColor: bgColor,
        pickerOptionSelectedTextColor: fontColor,
        pickerOptionUnitTextColor: unitColor,
        pickerOptionUnitFontSize: '14px',
      }}
    >
      <View
        className={`${prefixClass}_container ${className}`}
        style={{
          height: `100vh`,
        }}
      >
        {!showCircle ? (
          renderCountdown()
        ) : (
          /* 倒计时 弹窗 */
          <View
            style={{
              backgroundColor: bgColor,
              backgroundImage: `url(${bgImg})`,
            }}
            className={`${prefixClass}_normal-container`}
          >
            <NavBar
              safeAreaInsetTop
              title={Strings.formatValue('lp_ct_countdownTitle', onOffText)}
              slot={{
                left: (
                  <View 
                    className={`${prefixClass}_close-button`}
                    onClick={onCancel}
                  >
                    <Icon name={XIcon} size={24} color={fontColor}  />
                  </View>
                )
              }}
            />

            <ScrollView refresherTriggered={false} scrollY className={`${prefixClass}_scrollView`}>
              <View
                className={`${prefixClass}_tip`}
                style={{
                  color: tipTextColor,
                }}
              >
                {Strings.formatValue('lp_ct_countdownOpenedTip', onOffText)}
              </View>
              <CountdownCircle
                circleBgColor={circleBgColor}
                isDarkTheme={isDarkTheme}
                fontColor={fontColor}
                themeColor={themeColor}
                maxSecond={+countdownDp}
                currentSecond={+restCountdown}
                onClose={handleClose}
                onResetting={handleResetting}
              />
            </ScrollView>
          </View>
        )}
      </View>
    </ConfigProvider>
  );
};

export default CountDown;
