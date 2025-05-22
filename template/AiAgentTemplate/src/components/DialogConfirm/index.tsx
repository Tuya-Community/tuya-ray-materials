/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { Text, View, Image } from '@ray-js/ray';
import { TouchableOpacity, Modal } from '@/components';
import Strings from '@/i18n';

import { imgCheckedIcon, imgUncheckedIcon } from '@/res';
import styles from './index.module.less';

type Props = {
  visible: boolean;
  title?: string;
  subTitle?: string;
  isShowTips?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  handleTipsChecked?: () => void;
};

const DialogConfirm: FC<Props> = ({
  visible,
  title = '',
  subTitle,
  isShowTips = false,
  onConfirm,
  onClose,
  handleTipsChecked,
}) => {
  const [switchValue, setSwitchValue] = useState(false);

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    isShowTips && handleTipsChecked && handleTipsChecked();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      position="center"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      onClickOverlay={onClose}
    >
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>{title}</Text>
          {subTitle && <Text className={styles.subTitle}>{subTitle}</Text>}
        </View>
        {isShowTips && (
          <TouchableOpacity
            onClick={() => setSwitchValue(!switchValue)}
            className={styles.checkBtn}
          >
            <Image
              src={switchValue ? imgCheckedIcon : imgUncheckedIcon}
              className={styles.checkIcon}
            />
            <Text className={styles.tipsText}>{Strings.getLang('dsc_dialog_tips')}</Text>
          </TouchableOpacity>
        )}
        <View className={styles.footer}>
          <TouchableOpacity className={styles.footerBtn} onClick={handleCancel}>
            <Text className={clsx(styles.footerBtnText, styles.cancel)}>
              {Strings.getLang('dsc_cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className={styles.footerBtn} onClick={handleConfirm}>
            <Text className={clsx(styles.footerBtnText, styles.confirm)}>
              {Strings.getLang('dsc_confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DialogConfirm;
