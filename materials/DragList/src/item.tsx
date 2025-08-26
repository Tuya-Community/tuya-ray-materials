/*
 * @Author: mjh
 * @Date: 2025-06-12 17:05:10
 * @LastEditors: mjh
 * @LastEditTime: 2025-08-19 17:35:57
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
  const { id, item, children, dragIconNode, onClick, onDragNodeClick } = props;

  return (
    <DragItemMini
      id={id}
      instanceId={id}
      item={item}
      bindclick={onClick}
      binddragNodeClick={onDragNodeClick}
    >
      {children}
      {dragIconNode && <View slot="drag">{dragIconNode}</View>}
    </DragItemMini>
  );
};

DragItem.defaultProps = {
  onClick: () => {},
  onDragNodeClick: () => {},
};
