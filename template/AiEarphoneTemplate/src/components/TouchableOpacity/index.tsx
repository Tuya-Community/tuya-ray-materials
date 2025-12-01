import React, { FC } from 'react';
import clsx from 'clsx';
import { View } from '@ray-js/components';
import { ViewProps } from '@ray-js/components/lib/View';

type Props = ViewProps & {
  onClick?: (event: any) => void;
  disabled?: boolean;
  activeOpacity?: number;
};

const TouchableOpacity: FC<Props> = ({
  children,
  activeOpacity = 0.4,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <View
      hoverClassName={clsx(`hover-class__button-press-${activeOpacity * 10}`)}
      hoverStayTime={disabled ? 0 : 120}
      onClick={disabled ? () => { } : onClick}
      {...props}
    >
      {children}
    </View>
  );
};

export default TouchableOpacity;
