import React, { FC } from 'react';
import clsx from 'clsx';
import { View, Text } from '@ray-js/ray';
import Strings from '@/i18n';
// @ts-ignore
import styles from './index.module.less';

export type ShopType = 'offline' | 'realtime';

type Props = {
  currTab: ShopType;
  onClickItem: (key: ShopType) => void;
  className?: string;
  style?: React.CSSProperties;
  itemClassName?: string;
  textClassName?: string;
  activeItemClassName?: string;
  activeTextClassName?: string;
};

const ShopTypeTab: FC<Props> = ({
  currTab,
  onClickItem,
  className,
  style,
  itemClassName,
  textClassName,
  activeItemClassName,
  activeTextClassName,
}) => {
  const handleClick = (key: ShopType) => {
    onClickItem(key);
  };
  return (
    <View className={clsx(styles.container, className)} style={style}>
      {['offline', 'realtime'].map((key: ShopType) => (
        <View
          className={clsx(
            styles.item,
            itemClassName,
            currTab === key && styles.itemActive,
            currTab === key && activeItemClassName
          )}
          onClick={() => handleClick(key)}
        >
          <Text
            className={clsx(
              styles.text,
              textClassName,
              currTab === key && styles.textActive,
              currTab === key && activeTextClassName
            )}
          >
            {Strings.getLang(`shop_type_${key}`)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ShopTypeTab;
