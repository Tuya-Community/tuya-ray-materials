/*
 * @Author: hkc
 * @Date: 2025-10-20 11:34:34
 * @LastEditors: xuzhe
 * @LastEditTime: 2026-05-19 10:00:00
 * @Description: 删除文件对话框
 */
import React from 'react';
import { Button, View } from '@ray-js/ray';
import { Dialog, Loading } from '@ray-js/smart-ui';
import Strings from '@/i18n';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  count?: number;
  titleKey?: string;
  subtitleKey?: string;
  confirmKey?: string;
}

const Index: React.FC<IProps> = ({
  show,
  onClose,
  onConfirm,
  loading,
  count = 1,
  titleKey,
  subtitleKey,
  confirmKey,
}) => {
  const handleConfirm = () => {
    if (loading) return;
    onConfirm();
  };

  const title = titleKey
    ? Strings.getLang(titleKey as any)
    : count > 1
    ? Strings.formatValue('dialog_delete_title_plural', count)
    : Strings.getLang('dialog_delete_title_single');

  return (
    <Dialog useSlot show={show} customClass={styles.dialog} showConfirmButton={false}>
      <View className={styles.content}>
        <View className={styles.title}>{title}</View>
        <View className={styles.desc}>
          {Strings.getLang((subtitleKey || 'dialog_delete_subtitle') as any)}
        </View>
      </View>
      <View className={styles.buttonWrapper}>
        <Button onClick={onClose} className={styles.cancel}>
          {Strings.getLang('cancel')}
        </Button>
        <View className={styles.divider} />
        <Button onClick={handleConfirm} className={styles.confirmDelete}>
          {loading ? (
            <Loading size={20} />
          ) : (
            <View>{Strings.getLang((confirmKey || 'delete') as any)}</View>
          )}
        </Button>
      </View>
    </Dialog>
  );
};

export default Index;
