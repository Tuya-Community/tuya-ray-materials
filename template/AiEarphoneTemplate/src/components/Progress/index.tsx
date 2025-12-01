import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from '@ray-js/components';

import Res from '@/res';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  progress: number;
  theme: 'orange' | 'blue';
}
const ProgressBar = ({ progress, theme }: Props) => {
  const progressBarRef = useRef(null);
  const [width, setWidth] = useState('0px');

  useEffect(() => {
    if (progressBarRef.current) {
      const query = ty.createSelectorQuery();
      query
        .select('.download-progress-box')
        .boundingClientRect(rect => {
          setWidth(`${rect.width}px`);
        })
        .exec();
    }
  }, [progressBarRef.current]);

  return (
    <View className={`download-progress-box ${styles.container}`} ref={progressBarRef}>
      <View
        className={`${theme === 'orange' ? styles.orange : styles.blue}`}
        ref={progressBarRef}
        style={{ width: `${progress}%` }}
      />
      {theme === 'orange' ? (
        <View className={styles.orange} style={{ width: `${progress}%` }}>
          <Image className={styles.img} src={Res.progresOrange} style={{ width }} />
        </View>
      ) : (
        <View className={styles.blue} style={{ width: `${progress}%` }}>
          <Image className={styles.img} src={Res.progressBg} style={{ width }} />
        </View>
      )}
    </View>
  );
};

export default ProgressBar;
