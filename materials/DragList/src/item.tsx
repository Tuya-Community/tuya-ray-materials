/*
 * @Author: mjh
 * @Date: 2025-06-12 17:05:10
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-20 13:46:23
 * @Description:
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
import React from 'react';
import { View } from '@ray-js/ray';
// @ts-ignore
import DragItemMini from './components/drag-item/index';
import { DragItemProps } from './props';

export const DragItem = (props: DragItemProps) => {
  const { id, item, children, dragIconNode } = props;

  return (
    <DragItemMini id={id} instanceId={id} item={item}>
      {children}
      {dragIconNode && <View slot="drag">{dragIconNode}</View>}
    </DragItemMini>
  );
};
