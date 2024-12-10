import React from 'react';
import clsx from 'clsx';
import { View } from '@ray-js/components';
import styles from './index.module.less';

const prefix = 'rotation-view';

interface RotationViewProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  duration?: number;
}

const RotationView: React.FC<RotationViewProps> = ({ className, children, style, duration }) => {
  return (
    <View
      className={clsx(styles[`${prefix}`], className)}
      style={{ ...style, animationDuration: `${duration / 1000}s` }}
    >
      {children}
    </View>
  );
};

RotationView.defaultProps = {
  className: '',
  children: null,
  duration: 5000,
  style: {},
};

export default RotationView;
