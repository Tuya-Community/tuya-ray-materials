import React, { FC, useState } from 'react';
import { View, Button, Text } from '@ray-js/components';
import { RecordType } from '@/redux/modules/audioFileSlice';
import CustomPopup from '@/components/CustomPopup';
import Strings from '@/i18n';
import clsx from 'clsx';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  initValue: RecordType;
  show: boolean;
  onClickOverlay: () => void;
  onBottomBtnClick: (recordType: RecordType) => void;
}

const ChooseRecordType: FC<Props> = ({ initValue, show, onClickOverlay, onBottomBtnClick }) => {
  const [recordType, setRecordType] = useState<RecordType>(initValue);

  return (
    <CustomPopup
      title={Strings.getLang('recording_choose_mode_title')}
      bottomBtnText={Strings.getLang('confirm')}
      show={show}
      onClickOverlay={onClickOverlay}
      onBottomBtnClick={() => onBottomBtnClick(recordType)}
    >
      <View className={styles.btnGroupContainer}>
        {[RecordType.CALL, RecordType.MEETING].map(item => {
          const isActive = item === recordType;
          return (
            <Button
              key={item}
              className={isActive ? clsx(styles.btnItem, styles.btnItemActive) : styles.btnItem}
              onClick={() => {
                setRecordType(item);
              }}
            >
              <Text className={isActive ? styles.btnItemTextActive : styles.btnItemText}>
                {Strings.getLang(`recording_choose_record_type_${item}`)}
              </Text>
            </Button>
          );
        })}
      </View>
    </CustomPopup>
  );
};

export default React.memo(ChooseRecordType);
