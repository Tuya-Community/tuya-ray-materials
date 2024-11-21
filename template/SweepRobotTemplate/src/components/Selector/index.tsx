import React from 'react';
import { Text, View } from '@ray-js/ray';
import { usePropsValue } from '@/hooks';

import { SelectorProps, SelectorValue, SelectorItemProps } from './props';
import styles from './index.module.less';

const Selector = <V extends SelectorValue>(props: SelectorProps<V>) => {
  const { options = [] } = props;
  const [value, setValue] = usePropsValue<V>({
    value: props.activeKey,
    defaultValue: props.defaultActiveKey,
    onChange: (val: V) => {
      props.onChange?.(val);
    },
  });

  const items = options?.map(option => {
    const { disabled, title } = option;
    const active = Object.is(value, option.value);

    return (
      <View
        className={active ? styles.activeSelectorItem : styles.selectorItem}
        key={option.value}
        onClick={() => {
          if (disabled) {
            return;
          }
          if (active) return;
          setValue(option.value);
        }}
      >
        <Text>{title}</Text>
      </View>
    );
  });

  return (
    <View className={styles.selector} style={props.style}>
      {items}
    </View>
  );
};

export default Selector;

export const SelectorItem = ({ name, ...rest }: SelectorItemProps) => {
  return (
    <View className={styles.lineBox}>
      <Text className={styles.itemText}>{name}</Text>
      <Selector {...rest} />
    </View>
  );
};
