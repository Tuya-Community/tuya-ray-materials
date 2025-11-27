import React from 'react';
import { View, Image } from '@ray-js/ray';
import { ImgItem } from '@/types';
import styles from './index.module.less';

type Props = {
  style?: React.CSSProperties;
  currentImgId: number;
  imgCheckedList: ImgItem[];
  onClick?: (item: ImgItem) => void;
};

const ImgHorizontalList = (props: Props) => {
  const { currentImgId, imgCheckedList = [], onClick, style = {} } = props;
  const handleClick = (item: ImgItem) => {
    onClick && onClick(item);
  };

  return (
    <View className={styles.imgHorizontalList} style={style}>
      {imgCheckedList.map((item, index) => {
        const isActive = item.id === currentImgId;
        const currentSrc = (item?.filterCode ? item?.filterSrc : item?.src) || item?.src;
        return (
          <Image
            key={index}
            src={currentSrc}
            className={isActive ? styles.editImgItemActive : styles.editImgItem}
            mode="aspectFill"
            onClick={() => handleClick(item)}
          />
        );
      })}
    </View>
  );
};
export default ImgHorizontalList;
