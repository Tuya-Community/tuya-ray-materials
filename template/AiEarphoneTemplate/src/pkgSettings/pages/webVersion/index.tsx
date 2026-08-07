/*
 * @Author: shuwei
 * @Date: 2025-12-16 10:00:00
 * @LastEditors: shuwei
 * @LastEditTime: 2025-12-16 10:00:00
 * @Description: 网页版页面
 */
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from '@ray-js/ray';
import CloudSyncCard from '@/components/CloudSyncCard';
import { TopBar } from '@/components';
import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { CloudSyncStatus } from '@/constant/enums';
import { tttSetClipboardData } from '@/api/ttt';
import { useSelector } from '@/redux';
import { atopGetUrlFromApollo } from '@/api/common';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';

// @ts-ignore
import styles from './index.module.less';

const Index = () => {
  useAppFloatCtrl(true);
  const [shareUrl, setShareUrl] = useState('');
  const { cloudSyncStatus } = useSelector(state => state.uiState);
  // 二维码点击扫码
  const handleCodeClick = () => {
    const url = 'thingsmart://scan';

    ty.canIUseRouter({
      url,
      success: ({ result }) => {
        if (result) {
          // 退出激活页进入扫码页
          // router.back();
          ty.router({
            url,
            fail: e => {
              console.error('router fail:', e);
            },
          });
        }
      },
      fail: e => {
        console.error('canIUseRouter fail:', e);
      },
    });
  };

  // 复制链接
  const handleCopyUrl = async () => {
    if (!shareUrl) return;

    try {
      await tttSetClipboardData(shareUrl);
      ty.showToast({
        title: Strings.getLang('share_modal_copy_success_toast'),
        icon: 'success',
      });
    } catch (error) {
      console.error('复制失败', error);
    }
  };

  const getShareUrl = async () => {
    try {
      const response = await atopGetUrlFromApollo({ key: 'HEY_TUYA_WEB_ADDR' });
      setShareUrl(response);
    } catch (error) {
      console.error('获取分享链接失败', error);
    }
  };

  useEffect(() => {
    getShareUrl();
  }, []);

  return (
    <View className={styles.container} >
      <TopBar title={Strings.getLang('aiNote_web_version')} />
      {cloudSyncStatus.status === CloudSyncStatus.Disabled && (
        <View className={styles.cloudSyncCardBox}>
          <CloudSyncCard />
        </View>
      )}

      <ThemedImage imageName="webDemoPng" src={Res.webDemoPng} className={styles.webDemoImg} />
      <View className={styles.titleBox1}>
        <View className={styles.title}>{Strings.getLang('web_version_title')}</View>
        <View className={styles.desc}>{Strings.getLang('web_version_desc')}</View>
      </View>
      <View className={styles.titleBox2}>
        <View className={styles.title}>{Strings.getLang('web_version_feature_1_title')}</View>
        <View className={styles.desc}>{Strings.getLang('web_version_feature_1_desc')}</View>
      </View>
      <View className={styles.titleBox2}>
        <View className={styles.title}>{Strings.getLang('web_version_feature_2_title')}</View>
        <View className={styles.desc}>{Strings.getLang('web_version_feature_2_desc')}</View>
      </View>
      <View className={styles.copyUrlBox}>
        <Text>{shareUrl}</Text>
        <Button type="primary" onClick={handleCopyUrl}>
          {Strings.getLang('web_version_copy_btn')}
        </Button>
      </View>
      <View className={styles.qrCode} onClick={handleCodeClick}>
        <ThemedImage imageName="qrCodeBlackPng" className={styles.img} src={Res.qrCodeBlackPng} />
      </View>
    </View>
  );
};

export default Index;
