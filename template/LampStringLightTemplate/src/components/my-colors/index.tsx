import React from 'react';

import { useColorList } from '@/hooks/useColorList';
import Strings from '@/i18n';
import { isSameColor } from '@/utils/isSameColor';
import { getArray } from '@/utils/kit';

import { router } from '@ray-js/ray';
import { BaseColors } from '../base-colors';

export interface MyColorsProps {
  title?: string;
  onAdd?: VoidFunction;
  onEdit?: (item: { h: number; s: number; v: number; id: number }) => void;
  currentSelect?: { h: number; s: number; v: number; id: number }[];
  onClick?: (hs: { h: number; s: number; v: number }, id: number) => void;
  className?: string;
  style?: React.CSSProperties;
  isRead?: boolean;
  selectable?: boolean;
  isSelected?: (item: { h: number; s: number; v: number }, id: number) => boolean;
  hasTitle?: boolean;
}

export const MyColors: React.FC<MyColorsProps> = ({
  title = Strings.getLang('myColor'),
  currentSelect,
  onAdd,
  onEdit,
  onClick,
  className,
  style,
  isRead,
  selectable,
  isSelected,
  hasTitle,
}) => {
  const { list, storage } = useColorList();

  return (
    <BaseColors
      hasTitle={hasTitle}
      selectable={selectable}
      isSelected={isSelected}
      title={title}
      onAdd={onAdd}
      className={className}
      style={style}
      onEdit={onEdit}
      onClick={onClick}
      data={list}
      isRead={isRead}
      loading={storage.loading}
      isActive={color => !!getArray(currentSelect).find(item => color.id === item.id)}
      onDel={item => {
        if (item) {
          storage.delItem(item?.id);
        }
      }}
    />
  );
};
