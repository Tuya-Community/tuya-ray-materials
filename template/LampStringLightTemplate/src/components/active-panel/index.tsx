/*
 * @Author: mjh
 * @Date: 2024-08-05 16:31:29
 * @LastEditors: mjh
 * @LastEditTime: 2024-09-02 10:41:13
 * @Description:
 */
import React from 'react';
import { View } from '@ray-js/ray';
import { TouchEventHandler } from '@ray-js/components/lib/types';
import classnames from 'classnames';
import styles from './index.module.less';

interface IProps {
  className?: string;
  disabledClassName?: string;
  hoverClassName?: string;
  children?: React.ReactNode | string;
  style?: React.CSSProperties;
  onClick?: TouchEventHandler['onClick'];
  disabled?: boolean;
}
export const ActivePanel = (props: IProps) => {
  const { hoverClassName, className, children, style, onClick, disabled, disabledClassName } =
    props;
  const currClick: TouchEventHandler['onClick'] = e => {
    if (disabled) {
      e.origin.stopPropagation();
      return;
    }
    onClick?.(e);
  };
  return (
    <View
      className={classnames(className, {
        [disabledClassName || 'opacity-hover']: !!disabled,
      })}
      hoverClassName={!disabled ? hoverClassName || styles.hover : undefined}
      style={style}
      onClick={currClick}
    >
      {children}
    </View>
  );
};
