// iframe 之上的弹窗，请用该组件包裹
import React from 'react';
import { CoverView } from '@ray-js/ray';

// @ts-ignore
import styles from './index.module.less';

interface IProps {
  children: React.ReactNode;
  needCover?: boolean; // 是否需要 coverView
  zIndex?: number; // z-index
  onTouchMove?: (e: any) => void;
}

const Index = ({ children, needCover = true, zIndex = 100, onTouchMove }: IProps) => {
  return needCover ? (
    <CoverView className={styles.coverView} style={{ zIndex }} onTouchMove={onTouchMove}>
      {children}
    </CoverView>
  ) : (
    <>{children}</>
  );
};

export default Index;
