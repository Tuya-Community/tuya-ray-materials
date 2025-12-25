import { Image, Text, View } from '@ray-js/ray';
import React from 'react';
import { Colors, ColorsProps } from '@/components/colors';
import Strings from '@/i18n';
import { getArray, merge } from '@/utils/kit';
import res from '@/res';
import styles from './index.module.less';

export interface DiySceneCardProps {
  colors: ColorsProps['colors'];
  onEdit: VoidFunction;
  onDelete: VoidFunction;
  isEdit: boolean;
  name: string;
  type: 'diy' | 'ai';
  style?: React.CSSProperties;
  isActive?: boolean;
  onClick?: VoidFunction;
}

export const DiySceneCard: React.FC<DiySceneCardProps> = ({
  name,
  type,
  isEdit,
  colors,
  onDelete,
  onEdit,
  style,
  isActive,
  onClick,
}) => {
  return (
    <View
      className={styles.contain}
      hoverClassName="button-hover"
      onClick={onClick}
      style={merge<React.CSSProperties>(
        style,
        isActive && {
          borderColor: '#0D84FF',
        }
      )}
    >
      <View className={styles.head}>
        <Colors colors={getArray(colors)} itemBorderWidth={4} itemWidth={30} />
      </View>
      {isEdit ? (
        <View className={styles.bottom}>
          <View
            className={styles.bottomText}
            hoverClassName="button-hover"
            onClick={e => {
              e?.origin?.stopPropagation?.();
              onEdit && onEdit();
            }}
          >
            {Strings.getLang('modify')}
          </View>
          <View className={styles.bottomDiv} />
          <View
            className={styles.bottomText}
            style={{ color: '#DA3737' }}
            hoverClassName="button-hover"
            onClick={e => {
              e?.origin?.stopPropagation?.();
              onDelete && onDelete();
            }}
          >
            {Strings.getLang('delete')}
          </View>
        </View>
      ) : (
        <View className={styles.bottomShow}>
          <Text className={styles.bottomShowLabel}>{name}</Text>
          <View className={styles.bottomShowIcon}>
            <Image
              className={styles.bottomShowIconImg}
              mode="aspectFit"
              src={type === 'diy' ? res.icon_diy : res.icon_ai}
            />
          </View>
        </View>
      )}
    </View>
  );
};
