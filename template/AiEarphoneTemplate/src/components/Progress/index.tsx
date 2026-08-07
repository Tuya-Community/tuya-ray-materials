import React, { useEffect, useRef, useState } from 'react';
import { View } from '@ray-js/components';

import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  progress: number;
  theme: 'orange' | 'blue';
  h?: number; // height
}
const ProgressBar = ({ progress, theme, h = 24 }: Props) => {
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
    <View
      className={`download-progress-box ${styles.container}`}
      ref={progressBarRef}
      style={{
        height: `${h}px`,
      }}
    >
      <View
        className={`${theme === 'orange' ? styles.orange : styles.blue}`}
        ref={progressBarRef}
        style={{ width: `${progress}%`, height: `${h}px` }}
      />
      {theme === 'orange' ? (
        <View className={styles.orange} style={{ width: `${progress}%`, height: `${h}px` }}>
          <ThemedImage
            imageName="progresOrange"
            className={styles.img}
            src={Res.progresOrange}
            style={{ width, height: `${h}px` }}
          />
        </View>
      ) : (
        <View className={styles.blue} style={{ width: `${progress}%`, height: `${h}px` }}>
          <ThemedImage imageName="progressBg" className={styles.img} src={Res.progressBg} style={{ width, height: `${h}px` }} />
        </View>
      )}
    </View>
  );
};

export default ProgressBar;
