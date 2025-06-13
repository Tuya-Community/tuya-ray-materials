import React from 'react';
import { Text, View } from '@ray-js/ray';
import clsx from 'clsx';
import { IconFont } from '../icon-font';
import Styles from './index.module.less';

interface IProps {
  title?: string;
  icon?: string;
}

export const SectionTitle: React.FC<IProps> = (props: IProps) => {
  const { title, icon = 'left-arrow' } = props;
  return (
    <View className={clsx(Styles.comContainer)}>
      <View className={clsx(Styles.leftContainer)}>
        {title && <Text className={clsx(Styles.titleName)}>{title}</Text>}
      </View>
      <View className={clsx(Styles.rightContainer)}>
        {icon && <IconFont icon={icon} otherClassName={clsx(Styles.featureIcon)} />}
      </View>
    </View>
  );
};
