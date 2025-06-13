import { PopupTitle } from '@/components/popup-title';
import { View } from '@ray-js/ray';
import React from 'react';
import clsx from 'clsx';
import Styles from './index.module.less';

interface IProps {
  title: string;
}

export const Todo = (props: IProps) => {
  const { title } = props;
  return (
    <View className={clsx(Styles.comContainer)}>
      <PopupTitle title={title} />
      <View className={Styles.contentWrapper}>功能待实现，敬请期待!</View>
    </View>
  );
};
