import React, { FC, useMemo, CSSProperties } from 'react';
import classNames from 'clsx';
import { View } from '@ray-js/ray';
import styles from './index.module.less';

interface Props {
  loading?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: CSSProperties;
  className?: string;
  size?: number | string;
  strokeWidth?: number | string;
}

const sizeMap = {
  small: 40,
  large: 72,
};

const Loading: FC<Props> = ({ loading, color, backgroundColor, style, size, strokeWidth, className }) => {
  const loadingStyle: CSSProperties = useMemo(() => {
    const sizeValue = typeof sizeMap[size] !== 'undefined' ? sizeMap[size] : size;
    return {
      width: sizeValue,
      height: sizeValue,
      border: `${strokeWidth}rpx solid ${backgroundColor}`,
      borderTopColor: color,
    };
  }, [color, size, style, strokeWidth, backgroundColor]);

  if (!loading) {
    return <View />;
  }
  return <View style={loadingStyle} className={classNames(styles.animate, { [className]: !!className })} />;
};
Loading.defaultProps = {
  loading: false,
  color: '#fff',
  backgroundColor: 'rgba(0,0,0,.1)',
  style: {},
  size: 28,
  strokeWidth: 4,
};

export default Loading;
