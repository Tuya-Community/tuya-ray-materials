import React, { FC, useCallback } from 'react';
import { View } from '@ray-js/ray';
import styles from './index.module.less';
import { Icon, IconType } from '../icon';

interface Props {
  item: FunctionData;
  onSelect: (item: FunctionData) => void;
}

const TimerTypeItem: FC<Props> = ({ item, onSelect }) => {
  const handleSelect = useCallback(() => {
    onSelect(item);
  }, [onSelect, item]);
  return (
    <View className={styles.item} onClick={handleSelect} hoverClassName="hover">
      {!!item.icon && <Icon type={item.icon as IconType} size="72rpx" fill="#fff" className={styles.icon} />}
      <View className={styles.title}>
        <View>{item.title}</View>
        <View className={styles.subTitle}>{item.subTitle}</View>
      </View>
    </View>
  );
};

export default TimerTypeItem;
