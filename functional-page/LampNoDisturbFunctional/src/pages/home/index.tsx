/*
 * @Author: mjh
 * @Date: 2025-02-12 14:37:01
 * @LastEditors: mjh
 * @LastEditTime: 2025-07-10 11:03:32
 * @Description:
 */
import { Button, View, getLaunchOptionsSync } from '@ray-js/ray';
import React from 'react';
import styles from './index.module.less';

// 存储功能页数据Promise化
export const presetFunctionalData = (url: string, data: Record<string, any>): Promise<boolean> => {
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
  const { deviceId, groupId } = getLaunchOptionsSync().query;
  const jumpUrl = `functional://LampNoDisturbFunctional/home?deviceId=${deviceId || ''}&groupId=${
    groupId || ''
  }&boxImgUrl=https://images.tuyacn.com/smart/ui/ty8zptgcyzjrsnxtho/remoteSwitch.png`;
  console.log('🚀 ~ jumpUrl:', jumpUrl);
  return (
    <View className={styles.container}>
      <Button
        onClick={async () => {
          const fontColor = 'rgba(0,0,0, 1)'
          // 添加功能页预设数据
          await presetFunctionalData(jumpUrl, {
            activeColor: 'red',
            bgStyle: {
              background: 'rgba(255,255,255, 1)'
            },
            decsStyle: {
              color: fontColor,
            },
            smartUIThemeVars: {
              navBarBackgroundColor: 'transparent',
              navBarTitleTextColor: fontColor,
              navBarArrowColor: fontColor,
              switchBackgroundColor: 'rgba(229, 229, 229, 1)',
            },
            cardStyle: {
              borderRadius: '32rpx',
              border: '0px',
              background: 'rgba(0,0,0, 0.05)',
            },
            cardTitleStyle: {
              color: fontColor,
            },
            cardDescStyle: {
              color: 'rgba(0,0,0, 0.5)',
            },
            imgBoxStyle: {
              background: 'rgba(0,0,0, 0.05)',
            },
            boxImgUrl: 'https://images.tuyacn.com/smart/ui/ty8zptgcyzjrsnxtho/remoteSwitch.png',
          });
          ty.navigateTo({
            url: jumpUrl,
            success: (data) => {
              console.log('🚀 ~ navigateTo success data1:', data);
            },
            fail: (data) => {
              console.log('🚀 ~ navigateTo fail :', data);
            },
          });
        }}
        type="primary"
      >
        Enter the feature page
      </Button>
    </View>
  );
};
