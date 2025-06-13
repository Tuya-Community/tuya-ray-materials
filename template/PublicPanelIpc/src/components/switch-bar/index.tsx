import React from 'react';
import { Text, View, ScrollView } from '@ray-js/ray';
import clsx from 'clsx';
import { IconFont } from '../icon-font';
import Styles from './index.module.less';

interface IProps {
  title?: string;
  icon?: string;
}

export const SwitchBar: React.FC<IProps> = (props: IProps) => {
  const { title, icon = 'switch' } = props;
  return (
    <View className={clsx(Styles.comContainer)}>
      <View className={clsx(Styles.rightContainer)}>
        {icon && <IconFont icon={icon} otherClassName={clsx(Styles.featureIcon)} />}
      </View>
    </View>
  );
};
