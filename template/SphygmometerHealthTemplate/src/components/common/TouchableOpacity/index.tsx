import { memo } from 'react';
import { View } from '@ray-js/components';
import { ViewProps } from '@ray-js/components/lib/View';
import clsx from 'clsx';

import styles from './index.module.less';

type Props = ViewProps & {
  onClick?: (event: any) => void;
  disabled?: boolean;
  activeOpacity?: number;
};

const TouchableOpacity = ({
  children,
  activeOpacity = 0.4,
  disabled = false,
  className,
  onClick,
  ...props
}: Props) => {
  return (
    <View
      className={clsx(styles.container, className)}
      hoverClassName={clsx(`hover-class__button-press-${activeOpacity * 10}`)}
      hoverStayTime={disabled ? 0 : 120}
      onClick={disabled ? null : onClick}
      {...props}
    >
      {children}
    </View>
  );
};

export default memo(TouchableOpacity);
