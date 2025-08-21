import React, { useCallback } from 'react';
import { View, Image } from '@ray-js/ray';
import Res from '../../res';

import './index.less';

const defaultSize = 26;
interface switchProps {
  theme?: any;
  style?: any;
  size?: number;
  value?: boolean;
  onChange?: (value: boolean) => void;
}
const Radio = (props: switchProps) => {
  const { size, value, style, theme, onChange } = props;

  const handleChange = useCallback(() => {
    onChange(!value);
  }, [value]);
  const isDefault = size === defaultSize;
  const isDark = theme?.theme === 'dark';
  const borderColor = isDark
    ? '1px solid rgba(229, 229, 229, 0.4)'
    : '1px solid rgba(25, 97, 206, 0.1)';
  const bgColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(25, 97, 206, 0.08)';
  const radioStyle = isDefault
    ? {
        border: borderColor,
        background: bgColor,
        ...style,
      }
    : {
        width: `${size * 2}rpx`,
        height: `${size * 2}rpx`,
        border: borderColor,
        background: bgColor,
        ...style,
      };
  const circleBg = theme?.brandColor || '#0D84FF';
  const circleStyle = isDefault
    ? {
        background: circleBg,
      }
    : {
        width: `${size * 2}rpx`,
        height: `${size * 2 - 2}rpx`,
        background: circleBg,
      };
  return (
    <View className="schedule-radio" style={radioStyle} onClick={handleChange}>
      {!!value && (
        <View className="schedule-circle" style={circleStyle}>
          <Image
            className="schedule-icon"
            style={{
              width: `${circleStyle.width}`,
              height: `${circleStyle.height}`,
            }}
            mode="scaleToFill"
            src={isDark ? Res.iconCheckmarkDark : Res.iconRadioCheckmarkLight}
          />
        </View>
      )}
    </View>
  );
};

Radio.defaultProps = {
  theme: 'light',
  style: {},
  size: defaultSize,
  value: false,
  onChange: () => null,
};

export default Radio;
