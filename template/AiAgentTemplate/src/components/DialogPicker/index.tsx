/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from '@ray-js/ray';
import clsx from 'clsx';
import { Modal, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import { imgCheckedIcon, imgUncheckedIcon } from '@/res';
import styles from './index.module.less';
import { getTheme } from '@/utils';

interface RangeListItem {
  key: string;
  dataString: string;
}

type Props = {
  visible: boolean;
  defaultValue?: string;
  title: string;
  rangeList: Array<RangeListItem>;
  onClose?: () => void;
  onConfirm?: (date: string) => void;
  isDataStringName?: boolean;
  isKeyValue?: boolean;
};

const DialogPicker: FC<Props> = ({
  visible,
  defaultValue,
  title,
  rangeList,
  onClose,
  onConfirm,
  isDataStringName = false,
  isKeyValue = false,
}) => {
  const [themeColor, setThemeColor] = useState(getTheme());
  const [value, setValue] = useState(defaultValue);
  // 当 defaultValue 变化时，更新 value 状态
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onCheckItem = (rangeKey: string) => {
    setValue(rangeKey);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = (value: string) => {
    onConfirm && onConfirm(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      position="bottom"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      onClickOverlay={onClose}
    >
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>{title}</Text>
        </View>
        <ScrollView scrollY style={{ height: '400rpx' }}>
          <View className={styles.content}>
            {rangeList.map(item => {
              return (
                <TouchableOpacity
                  key={item.key}
                  className={styles.singleContent}
                  onClick={() => onCheckItem(isKeyValue ? item.key : item.dataString)}
                >
                  {/* @ts-ignore */}
                  <Text className={styles.singleText}>
                    {isDataStringName ? item.dataString : Strings.getLang(item.key)}
                  </Text>
                  <Image
                    src={
                      value == (isKeyValue ? item.key : item.dataString)
                        ? imgCheckedIcon
                        : imgUncheckedIcon
                    }
                    className={styles.singleIcon}
                  />
                  <View className={styles.line} />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <View className={styles.footer}>
          <TouchableOpacity className={styles.footerBtn} onClick={handleCancel}>
            <Text className={styles.footerBtnText}>{Strings.getLang('dsc_cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity className={styles.footerBtn} onClick={() => handleConfirm(value)}>
            <Text className={clsx(styles.footerBtnText, 'active')} style={{
              color: themeColor,
            }}>
              {Strings.getLang('dsc_confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DialogPicker;
