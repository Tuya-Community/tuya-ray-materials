import React, { useMemo, useState } from 'react';

import { TempColorItem, useTempColorList } from '@/hooks/useTempColorList';
import Strings from '@/i18n';
import res from '@/res';
import { Image, Text, View } from '@ray-js/ray';
import { useProps, utils } from '@ray-js/panel-sdk';

import { getArray, splitArray } from '@/utils/kit';
import { showConfirmDeleteModal } from '@/utils/showConfirmModal';
import { IconX } from '../icon-x';
import styles from './index.module.less';

const { brightKelvin2rgb } = utils;
export interface TempColorsProps {
  onAdd?: VoidFunction;
  onEdit?: (item: TempColorItem) => void;
  onClick?: (temp: number) => void;
  maxSize?: number;
  isRead?: boolean;
}

export const TempColors: React.FC<TempColorsProps> = ({
  onAdd,
  onClick,
  onEdit,
  maxSize = 10,
  isRead = false,
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const temp = useProps(o => o.temp_value);

  const { list: tempColors, storage } = useTempColorList();

  const list = useMemo(() => splitArray(getArray(tempColors), 5), [tempColors]);
  const isOverMax = getArray(tempColors).length >= maxSize;
  const showEdit = getArray(tempColors).length > 0;

  return (
    <View className={styles.contain}>
      <View className={styles.head}>
        <Text className={styles.title}>{Strings.getLang('tempScene')}</Text>
        {showEdit && (
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
      {list.length > 0 ? (
        <View className={styles.list}>
          {list.map((colors, i) => (
            <View key={i} className={styles.row}>
              {colors.map((color, idx) => {
                const scaleValue = color.temp === temp ? 0.75 : 1;
                return (
                  <View
                    key={color.temp + idx + i}
                    style={{
                      marginLeft: idx === 0 ? 0 : '44rpx',
                    }}
                    className={`${styles.itemWrap}`}
                    hoverClassName="button-hover"
                    onClick={() => {
                      if (isEdit) {
                        onEdit && onEdit(color);
                      } else {
                        onClick(color.temp);
                      }
                    }}
                  >
                    <View
                      className={styles.colorSelectorCircle}
                      style={{ transform: `scale(${scaleValue})` }}
                    >
                      <View
                        className={styles.colorselectorcirclecolor}
                        style={{ backgroundColor: `${brightKelvin2rgb(1000, color.temp)}` }}
                      />
                    </View>
                    {color.temp === temp && (
                      <View
                        className={styles.colorSelectorCircleBorder}
                        style={{ borderColor: `${brightKelvin2rgb(1000, temp)}` }}
                      />
                    )}

                    {isEdit && (
                      <IconX
                        className={styles.cancelIcon}
                        onClick={e => {
                          e?.origin?.stopPropagation?.();
                          showConfirmDeleteModal({
                            content: Strings.getLang('deleteSceneTip'),
                            success(res) {
                              if (res.confirm) {
                                storage.delItem(color.id);
                              }
                            },
                          });
                        }}
                      />
                    )}
                    <Text className={styles.itemName}>{color.name}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.empty}>
          <Image mode="aspectFit" className={styles.emptyImg} src={res.empty} />
        </View>
      )}
      {isRead ? (
        <></>
      ) : (
        <View
          className={styles.addColor}
          hoverClassName="button-hover"
          onClick={() => {
            if (isOverMax) {
              return;
            }
            onAdd && onAdd();
          }}
          style={{
            opacity: isOverMax ? '0.5' : '1',
          }}
        >
          <Image className={styles.addColorIcon} src={res.plus} />
          <View className={styles.addColorLabel}>{Strings.getLang('addScene')}</View>
        </View>
      )}
    </View>
  );
};
