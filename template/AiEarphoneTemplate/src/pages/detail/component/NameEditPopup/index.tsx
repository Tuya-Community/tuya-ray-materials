/*
 * @Author: hkc
 * @Date: 2025-07-17 18:08:29
 * @LastEditors: hkc
 * @LastEditTime: 2025-10-30 19:29:30
 * @Description: 文件名编辑
 */
import React, { useEffect } from 'react';
import { BottomSheet, Button } from '@ray-js/smart-ui';
import { Textarea } from '@ray-js/ray';

import Strings from '@/i18n';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  fileName: string;
  onClose: () => void;
  onSave: (fileName: string) => void;
}
const Index: React.FC<IProps> = props => {
  const { show, onClose, fileName, onSave } = props;
  const [value, setValue] = React.useState(fileName);

  useEffect(() => {
    setValue(fileName);
  }, [fileName]);

  const handleSave = async () => {
    onSave(value);
  };

  return (
    <BottomSheet
      customClass={styles.bottomSheet}
      show={show}
      contentHeight="400rpx"
      onClose={onClose}
      title={Strings.getLang('file_name_edit')}
    >
      <Textarea
        value={fileName}
        className={styles.textarea}
        onInput={event => {
          const value = event.value || fileName;
          setValue(value);
        }}
      />
      <Button customClass={styles.save} onClick={handleSave}>
        {Strings.getLang('save')}
      </Button>
    </BottomSheet>
  );
};

export default Index;
