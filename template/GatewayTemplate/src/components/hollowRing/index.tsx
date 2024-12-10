import React from 'react';
import clsx from 'clsx';
import { View } from '@ray-js/components';
import styles from './index.module.less';

const prefix = 'hollow-ring';

interface HollowRingProps {
  linearColor: [string, string];
  className?: string;
  outSideCircleClassName?: string;
  outSideCircleStyle?: React.CSSProperties;
  innerCircleClassName?: string;
  innerCircleStyle?: React.CSSProperties;
  children?: React.ReactNode;
  size?: number | string;
  borderWidth?: number | string;
}

const HollowRing: React.FC<HollowRingProps> = ({
  linearColor,
  className,
  outSideCircleClassName,
  outSideCircleStyle,
  innerCircleClassName,
  innerCircleStyle,
  children,
  size,
  borderWidth,
}) => {
  const [startColor, endColor] = linearColor;
  const insideCircleSize = `calc(${size} - ${borderWidth} * 2)`;
  return (
    <View className={clsx(styles[`${prefix}`], className)}>
      <View
        className={clsx(styles[`${prefix}-outside-circle`], outSideCircleClassName)}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(140.77deg, ${startColor} 14.44%, ${endColor} 82.44%)`,
          ...outSideCircleStyle,
        }}
      >
        <View
          className={clsx(styles[`${prefix}-inner-circle`], innerCircleClassName)}
          style={{ width: insideCircleSize, height: insideCircleSize, ...innerCircleStyle }}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

HollowRing.defaultProps = {
  className: '',
  outSideCircleClassName: '',
  outSideCircleStyle: {},
  innerCircleClassName: '',
  innerCircleStyle: {},
  children: null,
  size: '480rpx',
  borderWidth: '12rpx',
};

export default HollowRing;
