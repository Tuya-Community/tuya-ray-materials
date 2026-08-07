import React from 'react';
import { View } from '@ray-js/components';

// @ts-ignore
import styles from './index.module.less';

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  width?: string | number;
  clickDom?: any; // 可能是一个 DOM 元素或 React 组件
  contentSty: string;
}

const Dialog: React.FC<DialogProps> = ({ visible, onClose, children, clickDom, contentSty }) => {

  return (
    <>
      <View className={contentSty}>
        <View className={styles.box}>
          {
            <View className={styles.dialogBox} style={{
              display: visible ? 'block' : 'none',
            }} onClick={e => e.origin.stopPropagation()}>
              {children}
            </View>
          }
          {clickDom}
        </View>

      </View>
      {<View style={{
        display: visible ? 'block' : 'none',
      }} className={styles.dialogMask} onClick={onClose} />}
    </>
  );
};

export default Dialog;
