import React from 'react';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
// @ts-ignore
import styles from './index.module.less';

const RecordingAnimal = ({ isRecording = false, isCall = false, isCardCalling = false }) => {
  const imageSrc = isRecording
    ? isCall || isCardCalling
      ? Res.callAniGif
      : Res.voiceGif
    : isCall || isCardCalling
      ? Res.callAni
      : Res.voiceStatic;
  
  const imageName = isRecording
    ? isCall || isCardCalling
      ? 'callAniGif'
      : 'voiceGif'
    : isCall || isCardCalling
      ? 'callAni'
      : 'voiceStatic';

  return (
    <ThemedImage
      imageName={imageName}
      src={imageSrc}
      className={styles.voiceGif}
    />
  );
};

export default RecordingAnimal;
