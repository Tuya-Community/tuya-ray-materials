import React, { CSSProperties, FC } from 'react';
import { Text } from '@ray-js/ray';
import clsx from 'clsx';

type Props = {
  icon: string;
  style?: CSSProperties;
};

export const IconFont: FC<Props> = ({ icon, style }) => {
  const cls = clsx('iconfont', `iconfont-${icon}`);
  return <Text className={cls} style={style} />;
};
