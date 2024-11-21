import { THEME_COLOR } from '@/constant';
import { Text, View } from '@ray-js/ray';
import { SmartEvent, Switch } from '@ray-js/smart-ui';
import React from 'react';
import styles from './index.module.less';

interface Props {
  title: string;
  label: string;
  enable: boolean;
  onSwitchChange: (value: SmartEvent<boolean>) => void;
}

const SwitchBox = (props: Props) => {
  const { onSwitchChange, title, label } = props;

  return (
    <View className={styles.switchBox}>
      <View className={styles.head}>
        <View className={styles.timeBox}>
          <Text className={styles.headTitle}>{title}</Text>
        </View>
        <Switch
          checked={props.enable}
          onChange={onSwitchChange}
          activeColor={THEME_COLOR}
          size="middle"
          stopClickPropagation
        />
      </View>
      <View className={styles.itemBottom}>
        <Text className={styles.text}>{label}</Text>
      </View>
    </View>
  );
};

export default SwitchBox;
