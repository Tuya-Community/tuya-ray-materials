import { View } from '@ray-js/ray';
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './index.module.less';
import { Icon, IconType } from '../icon';
import Content from './content/index';

interface Props {
  title: string;
  icon: IconType;
  open?: boolean;
  // 当值变化时，并且当前为打开状态，则会引起高度的计算
  needUpdateHeight?: number;
  onChange?: (status: boolean) => void;
  children: ReactNode;
  className?: string;
}

const Collapse: FC<Props> = ({ title, icon, open, needUpdateHeight, className, onChange, children }) => {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    if (typeof open === 'boolean') {
      setStatus(open);
    }
  }, [open]);
  const handleClick = useCallback(() => {
    setStatus((v) => {
      onChange && onChange(!v);
      return !v;
    });
  }, [onChange]);

  return (
    <View className={clsx(styles.box, className)}>
      <View className={clsx(styles.title, status && styles.opened)} onClick={handleClick}>
        <Icon type={icon} size={72} className={styles.icon} fill="#fff" />
        <View className={styles.txt}>{title}</View>
      </View>
      <Content status={status} update={needUpdateHeight}>
        {children}
      </Content>
    </View>
  );
};

export default Collapse;
