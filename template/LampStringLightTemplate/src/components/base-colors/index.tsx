import classnames from 'classnames';
import React, { useMemo, useState } from 'react';

import Strings from '@/i18n';
import res from '@/res';
import { getArray, merge, splitArray } from '@/utils/kit';
import { hsv2rgbString } from '@ray-js/panel-sdk/lib/utils';
import { Image, Text, View } from '@ray-js/ray';

import { showConfirmDeleteModal } from '@/utils/showConfirmModal';
import { IconX } from '../icon-x';
import styles from './index.module.less';
import ColorSelectorCircle from '../color-selector-circle';

export interface BaseColorsProps {
  title?: string;
  hasTitle?: boolean;
  onAdd?: VoidFunction;
  onEdit?: (item: { h: number; s: number; id?: number; v: number }, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  data: { h: number; s: number; id?: number; v: number }[];
  disableDelCheck?: boolean;
  onDel?: (item: { h: number; s: number; id?: number }) => void;
  isRead?: boolean;
  loading?: boolean;
  isActive?: (item: { h: number; s: number; id?: number; v: number }, id: number) => boolean;
  onClick?: (hs: { h: number; s: number; v: number }, id?: number) => void;
  maxSize?: number;
  autoInEdit?: boolean;
  selectable?: boolean;
  isSelected?: (item: { h: number; s: number; id?: number; v: number }, id: number) => boolean;
}

export const BaseColors: React.FC<BaseColorsProps> = ({
  title = Strings.getLang('myColor'),
  onAdd,
  onEdit,
  className,
  style,
  data,
  onDel,
  isRead,
  loading,
  isActive,
  onClick,
  maxSize = 20,
  disableDelCheck = false,
  autoInEdit = false,
  selectable = false,
  isSelected,
  hasTitle,
}) => {
  const [isEdit, setIsEdit] = useState(!!autoInEdit);
  const list = useMemo(() => splitArray(data, 5), [data]);

  const isOverMax = getArray(data).length >= maxSize;

  const showEdit = getArray(data).length > 0;
  return (
    <View
      className={classnames(styles.contain, className)}
      style={merge<React.CSSProperties>(
        style,
        isRead && {
          background: 'transparent',
          width: '100%',
        }
      )}
    >
      {!isRead && (
        <View className={styles.head}>
          <Text className={styles.title}>{title}</Text>
          {!autoInEdit && !!showEdit && (
            <View className={styles.edit}>
              <Image className={styles.editIcon} src={isEdit ? res.cancel_edit : res.pancil} />
              <View
                className={styles.editText}
                hoverClassName="button-hover"
                onClick={() => setIsEdit(!isEdit)}
              >
                {isEdit ? Strings.getLang('cancelEdit') : Strings.getLang('edit')}
              </View>
            </View>
          )}
        </View>
      )}
      {isRead && hasTitle && (
        <View className={styles.head}>
          <Text className={styles.title}>{title}</Text>
        </View>
      )}
      {list.length > 0 ? (
        <View className={styles.list}>
          {list.map((colors, i) => (
            <View key={i} className={styles.row}>
              {colors.map((color, idx) => {
                const _index = i * 5 + idx;
                return (
                  <View
                    key={`${color.h}_${idx}`}
                    hoverClassName="button-hover"
                    className={styles.item}
                    onClick={() => {
                      if (isEdit) {
                        // 0,1,2,3,4
                        // 5,6,7,8,9
                        onEdit && onEdit(color, _index);
                        return;
                      }
                      onClick && onClick({ h: color.h, s: color.s, v: color.v }, color.id);
                    }}
                    style={merge<React.CSSProperties>(
                      {
                        marginLeft: idx === 0 ? 0 : '36rpx',
                        borderColor:
                          isActive && isActive(color, color.id) ? '#0D84FF' : 'transparent',
                      },
                      selectable
                        ? {}
                        : {
                            backgroundColor: hsv2rgbString(color?.h, color.s / 10, color.v / 10),
                          }
                    )}
                  >
                    {selectable && (
                      <ColorSelectorCircle
                        colorData={{
                          ...color,
                          h: color.h,
                          s: color.s,
                          v: color.v,
                        }}
                        isSelected={isSelected && isSelected(color, color.id)}
                      />
                    )}
                    {isEdit && (
                      <IconX
                        className={styles.cancelIcon}
                        onClick={e => {
                          e?.origin?.stopPropagation?.();
                          if (disableDelCheck) {
                            onDel && onDel(color);
                          } else {
                            showConfirmDeleteModal({
                              content: Strings.getLang('deleteColorTip'),
                              success(res) {
                                if (res.confirm) {
                                  onDel && onDel(color);
                                }
                              },
                            });
                          }
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      ) : loading ? null : (
        <View className={styles.empty}>
          <Image mode="aspectFit" className={styles.emptyImg} src={res.empty} />
        </View>
      )}
      {!isRead && (
        <View
          className={styles.addColor}
          hoverClassName="button-hover"
          style={{
            opacity: isOverMax ? '0.5' : '1',
          }}
          onClick={() => {
            if (isOverMax) {
              return;
            }
            onAdd && onAdd();
          }}
        >
          <Image className={styles.addColorIcon} src={res.plus} />
          <View className={styles.addColorLabel}>{Strings.getLang('addColor')}</View>
        </View>
      )}
    </View>
  );
};
