import React from 'react';
import { View, Text } from '@ray-js/components';
import { Icon } from '@ray-js/icons';
// @ts-ignore
import styles from './index.module.less';

const Index = ({ checked, setChecked, text, onClickBk = null, size = 12, mg = 'auto' }) => {
  return (
    <View
      className={styles.check}
      onClick={() => (onClickBk ? onClickBk() : setChecked(!checked))}
      style={{ margin: mg }}
    >
      {checked ? (
        <View className={styles.checkbox} style={{ height: `${size}px`, width: `${size}px` }}>
          <Icon type="icon-checkmark" size={size} color="#fff" />
        </View>
      ) : (
        <View
          className={styles.checkboxCircle}
          style={{ height: `${size}px`, width: `${size}px` }}
        />
      )}
      {text && <Text className={styles.checkText}>{text}</Text>}
    </View>
  );
};

export default Index;
