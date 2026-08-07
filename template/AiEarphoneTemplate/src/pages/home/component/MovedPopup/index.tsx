/*
 * @Author: hkc
 * @Date: 2025-09-28 17:14:28
 * @LastEditors: hkc
 * @LastEditTime: 2025-11-03 11:11:45
 * @Description: 迁移弹窗
 */
import React from 'react';
import { BottomSheet, Button } from '@ray-js/smart-ui';
import { View, navigateToMiniProgram, setStorageSync } from '@ray-js/ray';
import Res from '@/res';
import Strings from '@/i18n';
import ThemedImage from '@/components/ThemedImage';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
}

const Index: React.FC<IProps> = ({ show, onClose }) => {
  const handleToUse = () => {
    onClose();
    setStorageSync({
      key: 'ftf_moved_use',
      data: 'true',
    });
    navigateToMiniProgram({
      appId: 'ty0u9m1s5ea1k71m2h',
      path: '/pages/index?from=note',
    });
  };

  return (
    <BottomSheet show={show} onClose={onClose} customClass={styles.container}>
      <View className={styles.inner}>
        <ThemedImage imageName="movedImg" src={Res.movedImg} className={styles.movedImg} />
        <View className={styles.content}>
          <View className={styles.title}>{Strings.getLang('moved_title')}</View>
          <View className={styles.desc}>{Strings.getLang('moved_desc')}</View>
          <Button customClass={styles.button} onClick={handleToUse}>
            {Strings.getLang('moved_to_use')}
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
};

export default Index;
