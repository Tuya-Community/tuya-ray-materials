import React, { FC, useState } from 'react';
import { View, Button, Text } from '@ray-js/components';
import { TransferType } from '@/redux/modules/audioFileSlice';
import CustomPopup from '@/components/CustomPopup';
import Strings from '@/i18n';
import clsx from 'clsx';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  initValue: TransferType,
  show: boolean;
  onClickOverlay: () => void;
  onBottomBtnClick: (transferType: TransferType) => void;
}

const ChooseTransferType: FC<Props> = ({ initValue, show, onClickOverlay, onBottomBtnClick }) => {
  const [transferType, setTransferType] = useState<TransferType>(initValue);

  return (
    <CustomPopup
      title={Strings.getLang('recording_choose_mode_title')}
      bottomBtnText={Strings.getLang('confirm')}
      show={show}
      onClickOverlay={onClickOverlay}
      onBottomBtnClick={() => onBottomBtnClick(transferType)}
    >
      <View className={styles.btnGroupContainer}>
        {[TransferType.FILE, TransferType.REALTIME].map(item => {
          const isActive = item === transferType;
          return (
            <Button
              key={item}
              className={isActive ? clsx(styles.btnItem, styles.btnItemActive) : styles.btnItem}
              onClick={() => {
                setTransferType(item);
              }}
            >
              <Text className={isActive ? styles.btnItemTextActive : styles.btnItemText}>
                {Strings.getLang(`recording_choose_trans_type_${item}`)}
              </Text>
            </Button>
          );
        })}
      </View>
    </CustomPopup>
  );
};

export default React.memo(ChooseTransferType);
