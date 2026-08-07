/*
 * @Author: hkc
 * @Date: 2025-12-24 14:07:09
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-30 14:38:57
 * @Description: 录音过程中bt断开提示弹窗
 */
import React from 'react';
import { Dialog } from '@ray-js/smart-ui';
import { View, Button } from '@ray-js/ray';
import ThemedImage from '@/components/ThemedImage';

import Res from '@/res';
import Strings from '@/i18n';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  onConfirm: () => void;
  title?: string;
  desc?: string;
}

const Index: React.FC<IProps> = ({ show, onConfirm, title, desc }) => {
  return (
    <Dialog
      useSlot
      closeOnClickOverlay={false}
      show={show}
      customClass={styles.dialog}
      showConfirmButton={false}
    >
      <ThemedImage imageName="bleOfflineIcon" src={Res.bleOfflineIcon} className={styles.icon} />
      <View className={styles.title}>{title || Strings.getLang('ftf_bt_offline_title')}</View>
      <View className={styles.desc}>{desc || Strings.getLang('ftf_bt_offline_desc')}</View>
      <Button onClick={onConfirm} className={styles.button}>
        {Strings.getLang('confirm')}
      </Button>
    </Dialog>
  );
};

export default Index;
