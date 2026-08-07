/*
 * @Author: hkc
 * @Date: 2025-08-28 18:40:56
 * @LastEditors: hkc
 * @LastEditTime: 2025-10-09 13:54:04
 * @Description: 多行省略
 */
import React from 'react';
import { Text } from '@ray-js/ray';
import clsx from 'clsx';

import styles from './index.module.less';

interface IProps {
  text: any;
  className?: string;
  numberOfLines?: number;
}
const Index: React.FC<IProps> = props => {
  const { text, className, numberOfLines = 1 } = props;
  return (
    <Text
      className={clsx(styles.text, className)}
      style={{
        WebkitLineClamp: numberOfLines || 'unset',
      }}
    >
      {text}
    </Text>
  );
};

export default Index;
