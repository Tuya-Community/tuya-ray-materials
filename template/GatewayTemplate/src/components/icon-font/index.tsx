import React, { CSSProperties, FC } from 'react';
import clsx from 'clsx';
import { Text } from '@ray-js/ray';

type Props = {
  icon: string;
  style?: CSSProperties;
};

export const IconFont: FC<Props> = ({ icon, style }) => {
  const cls = clsx('icon-panel', `icon-panel-${icon}`);
  return <Text className={cls} style={style} />;
};
