/*
 * @Author: hkc
 * @Date: 2026-02-28 17:53:54
 * @Description: 卡片状态提示弹窗
 * @LastEditTime: 2026-02-28 19:15:52
 * @LastEditors: hkc
 */
import React, { useMemo } from 'react';
import { View, Image } from '@ray-js/ray';
import { Icon, Transition } from '@ray-js/smart-ui';
import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import Res from '@/res';

import Strings from '@/i18n';
import styles from './index.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  type: 'signal' | 'battery';
}

const Index: React.FC<IProps> = ({ show, onClose, type }) => {
  // 左侧图标（卡片传输场景使用专用图标）
  const showIcon = useMemo(() => {
    switch (type) {
      case 'signal':
        return Res.cardSignalWarn;
      case 'battery':
        return Res.cardBatteryWarn;
      default:
        return '';
    }
  }, [type]);

  // 提示文案
  const showTip = useMemo(() => {
    switch (type) {
      case 'signal':
        return Strings.getLang('cardTransfer.signal_warn');
      case 'battery':
        return Strings.getLang('cardTransfer.battery_warn');
      default:
        return '';
    }
  }, [type]);

  return (
    <Transition name="fade-up" show={show} customClass={styles.container}>
      <View className={styles.inner}>
        <Image className={styles.icon} src={showIcon} />
        <View className={styles.tip}>{showTip}</View>
        <Icon
          name={closeIcon}
          size={18}
          customClass={styles.close}
          color="var(--color-arrow)"
          onClick={onClose}
        />
      </View>
    </Transition>
  );
};

export default Index;
