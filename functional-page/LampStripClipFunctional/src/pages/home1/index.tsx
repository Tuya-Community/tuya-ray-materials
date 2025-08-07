/*
 * @Author: mjh
 * @Date: 2025-02-13 16:45:55
 * @LastEditors: mjh
 * @LastEditTime: 2025-07-07 16:53:48
 * @Description: 
 */
import { Button, View, getLaunchOptionsSync } from '@ray-js/ray';
import React from 'react';
import styles from './index.less';

// 存储功能页数据Promise化
export const presetFunctionalData = (url: string, data: Record<string, any>): Promise<boolean> => {
  // @ts-ignore
  return new Promise((resolve, reject) => {
    // @ts-ignore
    ty.presetFunctionalData({
      url,
      data,
      success: () => resolve(true),
      fail: (err) => reject(err),
    });
  });
};

export default () => {
  const query = getLaunchOptionsSync()?.query;
  console.log('[query]', query);
  // TODO: 测试时写死id
  const deviceId = query?.deviceId || '6cc8852bf6a069a406kiss'

  const jumpUrl = `functional://rayStripClipFunctional/home?deviceId=${deviceId || ''}`;
  return (
    <View className={styles.abc} style={{ height: '200vh', padding: 10 }}>
      <Button
        // @ts-ignore
        onClick={async () => {
          // 添加功能页预设数据
          await presetFunctionalData(jumpUrl, {
            theme: 'light',
          });
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
