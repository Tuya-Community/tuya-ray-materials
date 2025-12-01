import React, { FC } from 'react';
import { View, Image, Text } from '@ray-js/components';
import Strings from '@/i18n';
import CustomPopup from '@/components/CustomPopup';
import res from '@/res';
// @ts-ignore
import styles from './index.module.less';

interface IProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const BluetoothTipPopup: FC<IProps> = ({ show, onCancel, onConfirm }) => {
  return (
    <CustomPopup
      title=""
      bottomBtnText={Strings.getLang('bluetooth_pair_btn')}
      show={show}
      onClickOverlay={onCancel}
      onBottomBtnClick={onConfirm}
    >
      <View className={styles.bluetoothTipPopupContainer}>
        <Image src={res.imgBluetoothTip} className={styles.img} />
        <Text className={styles.title}>{Strings.getLang('bluetooth_pair_title')}</Text>
        <Text className={styles.tip}>{Strings.getLang('bluetooth_pair_content')}</Text>
      </View>
    </CustomPopup>
  );
};

export default React.memo(BluetoothTipPopup);
