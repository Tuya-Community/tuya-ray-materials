import { memo, ReactNode, useState } from 'react';
import { View } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';

import Strings from '@/i18n';
import { getThemeColor } from '@/utils';
import Text from '../Text';
import TouchableOpacity from '../TouchableOpacity';
import styles from './index.module.less';

interface Props {
  show: boolean;
  title?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmTextColor?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Modal = ({
  show,
  title,
  children,
  confirmText = Strings.getLang('dsc_confirm'),
  cancelText = Strings.getLang('dsc_cancel'),
  confirmTextColor = getThemeColor(),
  onConfirm,
  onCancel,
}: Props) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <Popup
      round
      position="bottom"
      show={show}
      onBeforeEnter={() => setIsReady(true)}
      onClose={onCancel}
    >
      {isReady && (
        <View className={styles.wrapStyle}>
          {title && (
            <View className={styles.titleWrapStyle}>
              <Text className={styles.titleTextStyle}>{title}</Text>
            </View>
          )}
          <View className={styles.contentWrapStyle}>{children}</View>
          <View className={styles.footWrapStyle}>
            <TouchableOpacity className={styles.buttonWrapStyle} onClick={onCancel}>
              <Text className={styles.cancelTextStyle}>{cancelText}</Text>
            </TouchableOpacity>
            <View className={styles.line} />
            <TouchableOpacity className={styles.buttonWrapStyle} onClick={onConfirm}>
              <Text className={styles.confirmTextStyle} color={confirmTextColor}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Popup>
  );
};

export default memo(Modal);
