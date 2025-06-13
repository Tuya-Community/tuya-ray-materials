import React, { CSSProperties, FC } from 'react';
import { Text } from '@ray-js/ray';
import clsx from 'clsx';

type Props = {
  icon: string;
  style?: CSSProperties;
  otherClassName?: string;
};

export const IconFont: FC<Props> = ({ icon, style, otherClassName }) => {
  const cls = clsx('icon-panel', `icon-panel-${icon}`, otherClassName);
  return <Text className={cls} style={style} />;
};
