import { View } from '@ray-js/ray';
import clsx from 'clsx';
import React from 'react';
import { ViewProps } from '@ray-js/components/lib/View/props';
import Styles from './index.module.less';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card(props: CardProps) {
  return (
    <View {...props} className={clsx(Styles.wrapper, props.className)}>
      {props.children}
    </View>
  );
}
