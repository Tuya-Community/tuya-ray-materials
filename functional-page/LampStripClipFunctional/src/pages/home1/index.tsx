import { Button, View, getLaunchOptionsSync } from '@ray-js/ray';
import React from 'react';
import styles from './index.less';

export default () => {
  const query = getLaunchOptionsSync()?.query;
  console.log('[query]', query);
  // TODO: 测试时写死id
  const deviceId = query?.deviceId || '6cc8852bf6a069a406kiss'

  const jumpUrl = `functional://rayStripClipFunctional/home?deviceId=${deviceId || ''}`;
  return (
    <View className={styles.abc} style={{ height: '200vh', padding: 10 }}>
      <Button
        onClick={() => {
          ty.navigateTo({
            url: jumpUrl,
          });
        }}
        type="primary"
      >
        Enter the feature page
      </Button>
      <View style={{ height: '150vh' }}></View>
    </View>
  );
};
