import React, { useEffect } from 'react';
import { View, Button, Text } from '@ray-js/ray';
import { useConfig } from '@ray-js/components-ty-config-provider';

import Strings from '../../i18n';
import './index.less';

type Props = {
  countdown: number;
  seconds: number;
  onClose: () => void;
  onResetting: () => void;
};

const CountdownOpened = (props: Props) => {
  const { seconds, countdown, onClose, onResetting } = props;
  useEffect(() => {
    if (countdown <= 0) {
      onClose && onClose();
    }
  }, [countdown]);

  const isDark = useConfig()?.theme === 'dark';

  const handleClose = () => {
    onClose && onClose();
  };

  const passColor = isDark ? '#55bb9c' : '#3060c6';
  const notPassColor = isDark ? '#2b2b2b' : '#dddddd';

  const renderCircles = () => {
    const circleNum = 120;
    const diff = seconds - countdown;
    const passedNum = Math.floor((diff / seconds) * circleNum);

    const circleList = new Array(circleNum).fill(0).map((_, idx) => {
      const styles = {
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
        // eslint-disable-next-line react/no-array-index-key
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
    const hourTxt = Strings.getLang('hour');
    const minuteTxt = Strings.getLang('minute');
    const secondTxt = Strings.getLang('second');
    const SECOND = 60;

    const hour = Math.floor(secondRes / 3600);
    const minute = Math.floor((secondRes % 3600) / SECOND);
    const second = secondRes % SECOND;
    const tipTextStyle = {
      color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    };
    const numTextStyle = {
      color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
    };

    return (
      <>
        {!!hour && (
          <Text className="num-text" style={numTextStyle}>
            {hour < 10 ? `0${hour}` : hour}
          </Text>
        )}
        {!!hour && (
          <Text className="tip-text" style={tipTextStyle}>
            {hourTxt}
          </Text>
        )}
        <Text
          className="num-text"
          style={{
            marginLeft: '14rpx',
            ...numTextStyle,
          }}
        >
          {minute < 10 ? `0${minute}` : minute}
        </Text>
        <Text className="tip-text" style={tipTextStyle}>
          {minuteTxt}
        </Text>
        <Text
          className="num-text"
          style={{
            marginLeft: '14rpx',
            ...numTextStyle,
          }}
        >
          {second < 10 ? `0${second}` : second}
        </Text>
        <Text className="tip-text" style={tipTextStyle}>
          {secondTxt}
        </Text>
      </>
    );
  };

  if (typeof props.seconds !== 'number') {
    return null;
  }
  const handleResetting = () => {
    onResetting && onResetting();
  };

  const countdownOpenedCircleStyle = {
    background: isDark ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)',
  };
  const countdownOpenedCircleTextStyle = {};
  const countdownOpenedTextButtonStyle = {
    background: isDark ? 'rgba(255, 255, 255, .1)' : 'rgba(255, 255, 255, 1)',
  };

  return (
    <View className="countdown-opened-wrapper">
      <View className="countdown-opened-circle" style={countdownOpenedCircleStyle}>
        {renderCircles()}
        <View className="countdown-opened-circle-tip">{getTipText(countdown)}</View>
        <View className="countdown-opened-circle-button" onClick={handleResetting}>
          <Text className="countdown-opened-circle-text" style={countdownOpenedCircleTextStyle}>
            {Strings.getLang('resetting')}
          </Text>
        </View>
      </View>
      {/* 关闭倒计时 */}
      <View className="countdown-opened-text-button-wrapper">
        <Button
          className="countdown-opened-text-button"
          style={countdownOpenedTextButtonStyle}
          onClick={handleClose}
        >
          {Strings.getLang('closeCountdown')}
        </Button>
      </View>
    </View>
  );
};

export default CountdownOpened;
