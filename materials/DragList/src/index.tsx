/*
 * @Author: mjh
 * @Date: 2025-06-12 17:05:10
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-20 11:26:47
 * @Description:
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
import React from 'react';
// @ts-ignore
import DragMini from './components/drag/index';
import { DragProps } from './props';
import { styleTools } from './components/drag-item/utils';

export { DragItem } from './item';

export const Drag = (props: DragProps) => {
  const { style, children, handleSortEnd = () => {}, touchStart = () => {}, ...rest } = props;
  const currStyle = styleTools(style);
  return (
    <DragMini
      customStyle={currStyle}
      bindhandleSortEnd={handleSortEnd}
      bindtouchStart={touchStart}
      {...rest}
    >
      {children}
    </DragMini>
  );
};
