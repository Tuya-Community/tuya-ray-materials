import React, { FC, useEffect, useState } from 'react';
import { View, Text, Button, Input } from '@ray-js/components';
import Strings from '@/i18n';
import CustomPopup from '@/components/CustomPopup';
import clsx from 'clsx';
import { useThrottleFn } from 'ahooks';
// @ts-ignore
import styles from './index.module.less';

interface IProps {
  show: boolean;
  initText: string;
  onCancel: () => void;
  onConfirm: (text: string) => void;
}

const NameEditPopup: FC<IProps> = ({ show, initText, onCancel, onConfirm }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    setText(initText);
  }, [initText]);

  const { run: handleInput } = useThrottleFn(
    (event: any) => {
      setText(event.value);
    },
    { wait: 100 }
  );

  return (
    <CustomPopup
      title={Strings.getLang('edit_mode_rename')}
      bottomBtnText={Strings.getLang('confirm')}
      show={show}
      onClickOverlay={onCancel}
      hideBottomBtn
    >
      <View className={styles.nameEditContainer}>
        <Input
          className={styles.inputBox}
          placeholder={Strings.getLang('edit_mode_rename_placeholder')}
          maxLength={64}
          type="text"
          value={text}
          onInput={handleInput}
          onFocus={e => {
            console.log('onFocus', e);
          }}
          onBlur={e => {
            console.log('onBlur', e);
          }}
          onConfirm={e => {
            console.log('confirm', e);
          }}
        />
        <View className={styles.btnBox}>
          <Button className={styles.btn} onClick={onCancel}>
            <Text className={styles.btnText}>{Strings.getLang('cancel')}</Text>
          </Button>
          <View style={{ width: '12px' }} />
          <Button
            className={clsx(styles.btn, styles.confirmBtn)}
            onClick={() => {
              onConfirm(text);
            }}
          >
            <Text className={styles.btnText} style={{ color: '#fff' }}>
              {Strings.getLang('confirm')}
            </Text>
          </Button>
        </View>
      </View>
    </CustomPopup>
  );
};

export default React.memo(NameEditPopup);
