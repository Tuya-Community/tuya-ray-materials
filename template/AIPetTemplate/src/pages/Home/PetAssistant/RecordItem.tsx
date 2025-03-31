import React, { FC } from 'react';
import { View, Image } from '@ray-js/ray';
import styles from './index.module.less';

interface IProps {
  data: PetRecordData;
}

const RecordItem: FC<IProps> = ({ data }) => {
  const { time, desc, img } = data;
  return (
    <View className={styles['assistant-item']}>
      <View className={styles.time}>{time}</View>
      <View className={styles.detail}>
        <View className={styles.desc}>{desc}</View>
        {img && <Image src={img} className={styles.img} />}
      </View>
    </View>
  );
};

export default RecordItem;
