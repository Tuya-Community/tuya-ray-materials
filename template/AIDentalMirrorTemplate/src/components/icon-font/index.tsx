import React, { CSSProperties, FC } from 'react';
import { Text } from '@ray-js/ray';
import clsx from 'clsx';
import { useAppSelector } from '@/redux';
import { useUiConfig } from '@/hooks/useUiConfig';

type Props = {
  icon: string;
  style?: CSSProperties;
};

export const IconFont: FC<Props> = ({ icon, style }) => {
  const cls = clsx('icon-panel', `icon-panel-${icon}`);

  const themeColor = useUiConfig(theme => theme?.themeColor);
  const fontColor = useUiConfig(theme => theme?.fontColor);

  return <Text className={cls} style={style} />;
};
