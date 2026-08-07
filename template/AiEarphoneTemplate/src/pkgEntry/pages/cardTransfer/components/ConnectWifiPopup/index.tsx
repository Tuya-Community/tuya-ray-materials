/*
 * @Author: hkc
 * @Date: 2026-01-25 19:55:08
 * @Description: 连接wifi弹窗
 * @LastEditTime: 2026-01-25 21:21:09
 * @LastEditors: hkc
 */
import React from 'react';
import { View, Image, openSystemSettingPage } from '@ray-js/ray';
import { BottomSheet, Button, Icon } from '@ray-js/smart-ui';
import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import Res from '@/res';
import Strings from '@/i18n';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  /** 点击去 wifi 设置页时回调，用于标记「去了 wifi 设置页」 */
  onOpenWifiSettings?: () => void;
}

const Index: React.FC<IProps> = ({ show, onClose, onOpenWifiSettings }) => {
  return (
    <BottomSheet show={show} customClass={styles.container}>
      <View className={styles.banner}>
        <View className={styles.phone}>
          <View className={styles.title}>
            {Strings.getLang('cardTransfer.connectWifi_setting')}
          </View>
          <View className={styles.wifi}>
            <View className={styles.left}>
              <Image src={Res.connectWifiIcon} className={styles.icon} />
              <View className={styles.name}>WLAN</View>
            </View>
            <Image src={Res.connectWifiSwitchIcon} className={styles.switchIcon} />
          </View>
          {Array.from({ length: 2 }).map(() => (
            <View className={styles.wifiItem} />
          ))}
        </View>
      </View>
      <View className={styles.content}>
        <View className={styles.title}>{Strings.getLang('cardTransfer.connectWifi_title')}</View>
        <View className={styles.tip}>{Strings.getLang('cardTransfer.connectWifi_tip1')}</View>
        <View className={styles.tip}>{Strings.getLang('cardTransfer.connectWifi_tip2')}</View>
        <View className={styles.tip}>{Strings.getLang('cardTransfer.connectWifi_tip3')}</View>
        <View className={styles.buttonWrapper}>
          <Button customClass={styles.cancel} onClick={onClose}>
            {Strings.getLang('cardTransfer.cancel')}
          </Button>
          <Button
            customClass={styles.open}
            onClick={() => {
              onOpenWifiSettings?.();
              openSystemSettingPage({
                scope: 'Settings-WiFi',
                success: () => {
                  onClose();
                },
              });
            }}
          >
            {Strings.getLang('cardTransfer.open')}
          </Button>
        </View>
      </View>
      <Icon
        name={closeIcon}
        size={24}
        color="var(--color-text-white-7)"
        customClass={styles.close}
        onClick={onClose}
      />
    </BottomSheet>
  );
};

export default Index;
