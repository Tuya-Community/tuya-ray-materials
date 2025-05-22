/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Text, View } from '@ray-js/ray';
import Input from '@ray-js/components-ty-input';
import { TouchableOpacity, Modal, IconFont } from '@/components';
import Strings from '@/i18n';

import styles from './index.module.less';

type Props = {
  visible: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClose?: () => void;
  title?: string;
  maxLength?: number;
  placeholder?: string;
  tipText?: string;
};

const DialogInput: FC<Props> = ({
  visible,
  defaultValue,
  onChange,
  onClose,
  title,
  maxLength,
  placeholder,
  tipText,
}) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleCancel = () => {
    setValue(defaultValue);
    onClose();
  };

  const handleConfirm = () => {
    onChange(value);
    onClose();
  };

  const handleClear = () => {
    setValue('');
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
          <Text className={styles.title}>{title || Strings.getLang('dsc_remark')}</Text>
        </View>
        <View className={styles.content}>
          <View className={styles.field}>

            {visible && (
              <>
                <Input
                  // @ts-ignore
                  focus
                  wrapStyle={{ flex: 1 }}
                  placeholder={placeholder || Strings.getLang('dsc_less_than_4')}
                  placeholderStyle={{ fontSize: '32rpx', color: 'rgba(0, 0, 0, 0.3)' }}
                  maxLength={maxLength}
                  value={value}
                  // @ts-ignore
                  onInput={e => { setValue(e.value) }}
                />
                <TouchableOpacity
                  onClick={handleClear}
                // style={{ display: value.length > 0 ? 'flex' : 'none' }}
                >
                  <IconFont icon="closeFill" />
                </TouchableOpacity>
              </>
            )}

          </View>
          <View className={styles.tipText}>
            {
              // value.length === maxLength && (
              (
                tipText && (
                  <Text>{tipText}</Text>
                )
              )
            }
          </View>


        </View>
        <View className={styles.footer}>
          <TouchableOpacity className={styles.footerBtn} onClick={handleCancel}>
            <Text className={styles.footerBtnText}>{Strings.getLang('dsc_cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity className={styles.footerBtn} onClick={handleConfirm}>
            <Text className={clsx(styles.footerBtnText, 'active')}>
              {Strings.getLang('dsc_confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DialogInput;
