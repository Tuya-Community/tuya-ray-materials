/*
 * @Author: hkc
 * @Date: 2025-09-09 20:01:04
 * @LastEditors: hkc
 * @LastEditTime: 2025-09-16 16:14:55
 * @Description: 修改说话人对话框
 */
import React, { useEffect, useState } from 'react';
import { Input, View } from '@ray-js/ray';
import { Checkbox, Dialog } from '@ray-js/smart-ui';

import Strings from '@/i18n';

import styles from './index.module.less';

interface IProps {
  open: boolean;
  onClose: () => void;
  defaultValue?: string;
  onConfirm: (value: string, isCheckAll: boolean) => void;
}

const Index: React.FC<IProps> = props => {
  const { open, onClose, defaultValue, onConfirm } = props;
  const [isCheckAll, setIsCheckAll] = useState(true);
  const [value, setValue] = useState(defaultValue);

  // 输入框输入
  const handleInput = event => {
    setValue(event.value);
  };

  // 保存
  const handleConfirm = () => {
    onConfirm(value, isCheckAll);
  };

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setIsCheckAll(true);
    }
  }, [defaultValue, open]);

  return (
    <Dialog
      customClass={styles.dialogBox}
      show={open}
      onClose={onClose}
      title={Strings.getLang('modify_speaker_title')}
      confirmButtonText={Strings.getLang('save')}
      cancelButtonText={Strings.getLang('cancel')}
      showCancelButton
      onConfirm={handleConfirm}
      useSlot
    >
      <View className={styles.content}>
        <Input value={value} onInput={handleInput} className={styles.input} />
        <View className={styles.checkAll}>
          <Checkbox
            iconSize="16px"
            value={isCheckAll}
            shape="square"
            onChange={e => setIsCheckAll(e.detail)}
          />
          <View className={styles.desc}>
            {Strings.getLang('modify_all')} {`"${defaultValue}"`}
          </View>
        </View>
      </View>
    </Dialog>
  );
};

export default Index;
