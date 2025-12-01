import React, { useEffect, useRef } from 'react';
import { View } from '@ray-js/components';
// @ts-ignore
import styles from './index.module.less';

const ProgressBar = ({ progress }) => {
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  return (
    <View className={styles.container}>
      <View className={styles.bar} ref={progressBarRef} />
    </View>
  );
};

export default ProgressBar;
