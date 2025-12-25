import { Image, View } from '@ray-js/ray';
import type { ViewProps } from '@ray-js/components/lib/View';
import React from 'react';
import res from '@/res';
import classnames from 'classnames';
import styles from './index.module.less';

export interface IconXProps {
  onClick: (...e: Parameters<ViewProps['onClick']>) => void;
  className?: string;
}

export const IconX: React.FC<IconXProps> = ({ onClick, className }) => {
  return (
    <View
      className={classnames(styles.contain, className)}
      onClick={onClick}
      hoverClassName="button-hover"
    >
      <Image src={res.icon_x} className={styles.icon} />
    </View>
  );
};
