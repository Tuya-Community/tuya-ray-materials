import React, { useEffect, useState } from 'react';
import { View } from '@ray-js/components';
// @ts-ignore
import styles from './index.module.less';

const MIN_HEIGHT = 2;
const MAX_HEIGHT = 20;
const defaultBars = [8, 4, 16, 12, 6, 18, 10];

const RecordingAnimal = ({
  isRecording = false,
  initBars = defaultBars,
  width = null,
  bg = null,
  marginLeft = 32,
}) => {
  const [bars, setBars] = useState<number[]>(initBars);
  const [barStyle, setBarStyle] = useState({});
  useEffect(() => {
    let timer = null;
    if (bg) {
      setBarStyle({ background: bg });
    }
    if (isRecording) {
      timer = setInterval(() => {
        setBars(bars.map(() => Math.random() * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT));
      }, 300);
    } else {
      // 暂停录音时
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [bars, isRecording]);

  return (
    <View
      className={styles.waveAnimMini}
      style={{
        width: width ? `${width}px` : '20px',
        marginLeft: `${marginLeft}px`,
      }}
    >
      {bars.map((h, i) => (
        <View key={i} className={styles.waveBar} style={{ height: `${h}px`, ...barStyle }} />
      ))}
    </View>
  );
};

export default RecordingAnimal;
