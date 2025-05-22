import React, { ComponentProps, FC } from 'react';
import { View } from '@ray-js/ray';
import clsx from 'clsx';

import styles from './index.module.less';

type ViewProps = ComponentProps<typeof View>;

export interface TouchableOpacityProps extends ViewProps {
  onClick?: (event: any) => void;
  disabled?: boolean;
  activeOpacity?: number;
  isShowHover?: boolean;
}

const TouchableOpacity: FC<TouchableOpacityProps> = ({
  children,
  activeOpacity = 0.4,
  disabled = false,
  className,
  onClick,
  isShowHover = true,
  ...otherProps
}) => {
  return (
    <View
      className={clsx(styles.container, className)}
      hoverClassName={clsx(
        isShowHover && !disabled ? `hover-class__button-press-${activeOpacity * 10}` : ''
      )}
      hoverStayTime={disabled ? 0 : 120}
      onClick={e => {
        console.log('TouchableOpacity::click');
        e.origin.stopPropagation();
        !disabled && onClick(e);
      }}
      {...otherProps}
    >
      {children}
    </View>
  );
};

export default TouchableOpacity;
