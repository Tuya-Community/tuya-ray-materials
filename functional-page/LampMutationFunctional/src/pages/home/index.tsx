/*
 * @Author: mjh
 * @Date: 2025-01-06 15:15:46
 * @LastEditors: mjh
 * @LastEditTime: 2025-02-13 15:02:55
 * @Description: 
 */
import { Button, View, getLaunchOptionsSync, navigateTo } from '@ray-js/ray';
import React from 'react';
import styles from './index.module.less';

export default () => {
  const { deviceId = 'vdevo173509156484303', groupId } = getLaunchOptionsSync().query;
  const jumpUrl = `functional://LampMutationFunctional/home?deviceId=${deviceId || ''}&groupId=${groupId || ''}`;
  return (
    <View className={styles.container}>
      <Button
        onClick={() => {
          navigateTo({ url: jumpUrl, fail: err => console.warn(err) });
        }}
        type="primary"
      >
        Enter the feature page
      </Button>
    </View>
  );
};
