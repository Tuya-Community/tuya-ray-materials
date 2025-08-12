/* eslint-disable react/require-default-props */
import React, { ComponentProps, FC } from 'react';
import { View } from '@ray-js/ray';
import clsx from 'clsx';

import './index.less';

type ViewProps = ComponentProps<typeof View>;

export interface TouchableOpacityProps extends ViewProps {
  onClick?: (event: any) => void;
  disabled?: boolean;
  activeOpacity?: number;
  isShowHover?: boolean;
}

const classPrefix = 'rayui-music-bar';

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
      className={clsx(`${classPrefix}btnContainer`, className)}
      hoverClassName={clsx(
        isShowHover && !disabled
          ? `${classPrefix}hover-class__button-press-${activeOpacity * 10}`
          : ''
      )}
      hoverStayTime={disabled ? 0 : 120}
      onClick={e => {
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
