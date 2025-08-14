import React, { CSSProperties, useEffect } from 'react';
import { View, Text } from '@ray-js/ray';
import Color from 'color';

import Strings from '../../i18n';
import './index.less';

const prefixClass = 'countdown-opened';

type Props = {
  circleBgColor: string;
  isDarkTheme: boolean;
  fontColor: string;
  themeColor: string;
  maxSecond: number;
  currentSecond: number;
  onClose: () => void;
  onResetting: () => void;
};

const CountdownCircle = (props: Props) => {
  const {
    circleBgColor,
    currentSecond,
    maxSecond,
    fontColor,
    themeColor,
    isDarkTheme = true,
    onClose,
    onResetting,
  } = props;
  const countdown = currentSecond;

  useEffect(() => {
    if (currentSecond <= 0) {
      onResetting && onResetting();
    }
  }, [currentSecond]);

  const handleClose = () => {
    onClose && onClose();
  };

  const resetTipsFontColor = Color(circleBgColor).alpha(0.5)?.lighten(0.5)?.rgb()?.string();

  const passColor = themeColor;
  const notPassColor = isDarkTheme ? 'rgba(255, 255, 255, .2)' : 'rgba(0, 0, 0, .2)';

  const renderCircles = () => {
    const circleNum = 120;
    const diff = maxSecond - countdown;
    const passedNum = maxSecond > 0 ? Math.floor((diff / maxSecond) * circleNum) : 0;

    const circleList = new Array(circleNum).fill(0).map((_, idx) => {
      const styles: CSSProperties = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%)',
      };
      const radius = 128;
      const deg = idx * (360 / circleNum);
      const paddingX = Math.sin((deg / 180) * Math.PI) * radius;
      const paddingY = -Math.cos((deg / 180) * Math.PI) * radius;
      let colorStyle = notPassColor;
      if (passedNum > idx) {
        colorStyle = passColor;
      }
      return (
        <View key={idx} style={styles}>
          <View
            style={{
              position: 'relative',
              top: '-2.5px',
              transform: `translateX(${paddingX}px) translateY(${paddingY}px) rotate(${deg}deg)`,
              backgroundColor: `${colorStyle}`,
              height: '5px',
              width: '1px',
            }}
          />
        </View>
      );
    });
    return circleList;
  };

  const getTipText = (secondRes: number) => {
    const SECOND = 60;

    const hour = Math.floor(secondRes / 3600);
    const minute = Math.floor((secondRes % 3600) / SECOND);
    const second = secondRes % SECOND;
    const numTextColor = Color(circleBgColor).alpha(1)?.lighten(1)?.rgb()?.string();
    const numTextStyle = {
      color: fontColor ? fontColor : numTextColor,
    };
    
    return (
      <>
        {(
          <Text className={`${prefixClass}_num-text`} style={numTextStyle}>
            {hour < 10 ? `0${hour}` : hour}:{minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}
          </Text>
        )}
      </>
    );
  };

  if (typeof props.maxSecond !== 'number' || props.maxSecond <= 0) {
    return null;
  }
  const handleResetting = () => {
    onResetting && onResetting();
  };
  const countdownOpenedCircleStyle = {
    background: circleBgColor,
  };

  const countdownOpenedCircleTextStyle = {
    color: resetTipsFontColor,
  };

  const buttonBgColor =  Color(circleBgColor).alpha(isDarkTheme ? 0.1 : 0.05)?.lighten(0.1)?.rgb()?.string();
  const countdownOpenedTextButtonStyle = {
    background: buttonBgColor,
  };

  return (
    <View className={`${prefixClass}_wrapper`}>
      <View className={`${prefixClass}_circle`} style={countdownOpenedCircleStyle}>
        {renderCircles()}
        <View className={`${prefixClass}_circle-tip`}>{getTipText(countdown)}</View>
        <View className={`${prefixClass}_circle-button`} onClick={handleResetting}>
          <Text className={`${prefixClass}_circle-text`} style={countdownOpenedCircleTextStyle}>
            {Strings.getLang('lp_ct_resetting')}
          </Text>
        </View>
      </View>
      {/* 关闭倒计时 */}
      <View className={`${prefixClass}_text-button-wrapper`}>
        <View
          className={`${prefixClass}_text-button`}
          style={countdownOpenedTextButtonStyle}
          onClick={handleClose}
        >
          {Strings.getLang('lp_ct_closeCountdown')}
        </View>
      </View>
    </View>
  );
};

export default CountdownCircle;
