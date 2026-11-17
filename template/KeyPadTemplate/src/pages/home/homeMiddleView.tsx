import React, { useState } from 'react';
import { View, Text, Image, getCdnUrl, showToast } from '@ray-js/ray';
import { Image as SmartImage } from '@ray-js/smart-ui';
import { connectDevice } from '@ray-js/lock-sdk';
import { useDispatch } from 'react-redux';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import { selectBleOnline, setBleOnline } from '@/redux/modules/lockHomeSlice';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/** 蓝牙未连接时图标/文案颜色 */
const OFFLINE_COLOR = '#7d7d7d';

/** 蓝牙在线展示配件图；离线时点击重连，连接状态由 SDK 订阅更新。 */
export function HomeMiddleView() {
  const dispatch = useDispatch();
  const bleOnline = useSelectorWithEquality(selectBleOnline);
  const { themeColor, themeImage } = templateConfig;

  const [isConnecting, setIsConnecting] = useState(false);

  // 连接超时由 SDK 判定，连接失败时显示提示。
  const reConnectBle = async () => {
    if (bleOnline || isConnecting) return;
    setIsConnecting(true);
    try {
      await connectDevice({ timeout: 10 * 1000 });
      dispatch(setBleOnline(true));
    } catch (err) {
      console.log('=== connectDevice error', err);
      showToast({ title: Strings.getLang('bleConnectFailed'), icon: 'none' });
    } finally {
      setIsConnecting(false);
    }
  };

  const noneText = isConnecting
    ? Strings.getLang('bleConnecting')
    : Strings.getLang('blueNotConnect');
  const noneIcon = isConnecting
    ? getCdnUrl('connecting.png', cdnImage)
    : getCdnUrl('blueNone.png', cdnImage);
  const noneColor = isConnecting ? themeColor : OFFLINE_COLOR;

  return (
    <View className={styles.content}>
      {bleOnline ? (
        <Image src={themeImage} className={styles.onlineImg} />
      ) : (
        <View className={styles.offline} onClick={reConnectBle}>
          <View className={styles.offlineBg}>
            <Image src={getCdnUrl('blueNoneBg.png', cdnImage)} className={styles.offlineBgImg} />
            <SmartImage
              src={noneIcon}
              className={styles.noneIcon}
              width="140rpx"
              height="140rpx"
              tintColor={noneColor}
            />
          </View>
          <Text className={styles.noneText} style={{ color: noneColor }}>
            {noneText}
          </Text>
        </View>
      )}
    </View>
  );
}

export default HomeMiddleView;
