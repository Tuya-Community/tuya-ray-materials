import React, { FC, useEffect, useState } from 'react';
import { View, Text } from '@ray-js/components';
import { convertSecondsToTime } from '@/utils';
// @ts-ignore
import styles from './index.module.less';

type SttList = {
  start: number;
  end: number;
  timeOffset: string;
  transcript: string;
};

type SttData = {
  startSecond: number;
  endSecond: number;
  text: string;
  id: string;
};

interface Props {
  sttList: SttList[];
}

const SttContent: FC<Props> = ({ sttList }) => {
  const [sttData, setSttData] = useState<SttData[]>([]);
  const resolveSttText = (sttList: SttList[]) => {
    try {
      if (!sttList.length) return;
      // 单位是否为秒
      const isSecondUnit = sttList?.[0].timeOffset.includes('s');
      const sttResData = sttList.map(({ transcript, timeOffset }: SttList, idx: number) => {
        const time = isSecondUnit ? +parseInt(timeOffset, 10) : Math.floor(+timeOffset / 1000);
        const startSecond =
          idx === 0
            ? 0
            : Math.floor(
                parseInt(sttList?.[idx - 1]?.timeOffset || '0', 10) / (isSecondUnit ? 1 : 1000)
              );
        const endSecond = time;
        return {
          startSecond,
          endSecond,
          text: transcript,
          id: `${startSecond}-${endSecond}`,
        };
      });
      setSttData(sttResData);
    } catch (error) {
      console.warn('resolveSttText error', error);
    }
  };

  useEffect(() => {
    resolveSttText(sttList);
  }, [sttList]);

  if (sttData?.length) {
    return (
      <View className={styles.content}>
        {sttData.map(item => {
          const { startSecond, text, id } = item;
          return (
            <View key={`${id}`} className={styles.sttItem}>
              <View className={styles.sttItemHeader}>
                <View className={styles.timeDot} />
                <Text className={styles.timeText}>{convertSecondsToTime(startSecond)}</Text>
              </View>
              <Text className={styles.sttText}>{text}</Text>
            </View>
          );
        })}
      </View>
    );
  }
  return null;
};

export default React.memo(SttContent);
