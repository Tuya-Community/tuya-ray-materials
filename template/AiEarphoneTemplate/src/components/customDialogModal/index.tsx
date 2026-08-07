import React from 'react';
import { View } from '@ray-js/components';
import Res from '@/res';
import Strings from '@/i18n';
import ThemedImage from '@/components/ThemedImage';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  visible: boolean;
  type: 'proOffline' | 'btOffline'; // 'pro' for Pro version, 'ble' for Bluetooth
  onClose: () => void;
  onHelp?: () => void;
}

const CustomDialogModal: React.FC<Props> = ({ visible, onClose, onHelp, type = 'proOffline' }) => {
  if (!visible) return null;
  return (
    <View className={styles.dialogMask}>
      <View className={styles.dialogBox}>
        <View className={styles.dialogTitle}>
          {type === 'proOffline'
            ? Strings.getLang('pro_offline_title')
            : Strings.getLang('need_connect_ble')}
        </View>
        <View className={styles.dialogIconWrap}>
          <View className={styles.dialogIconBg}>
            {type === 'proOffline' ? (
              <View className={styles.content}>
                <ThemedImage imageName="proBlueIcon" src={Res.proBlueIcon} className={styles.proBlueIcon} />
                <View className={styles.descTitle}>
                  {Strings.getLang('mode_title_call_recording')}
                </View>
                <View className={styles.desc}>{Strings.getLang('pro_support_call')}</View>
              </View>
            ) : (
              <ThemedImage imageName="bleOfflineIcon" src={Res.bleOfflineIcon} className={styles.bleOfflineIcon} />
            )}
          </View>
        </View>
        {type === 'proOffline' ? (
          <View className={styles.dialogHelpRed}>{Strings.getLang('pro_dev_offline')}</View>
        ) : (
          <View className={styles.dialogHelp} onClick={onHelp}>
            {Strings.getLang('how_to_connect')}
          </View>
        )}
      </View>
      <View className={styles.dialogClose} onClick={onClose}>
        <ThemedImage imageName="closeModalIcon" src={Res.closeModalIcon} className={styles.close} />
      </View>
    </View>
  );
};

export default CustomDialogModal;
