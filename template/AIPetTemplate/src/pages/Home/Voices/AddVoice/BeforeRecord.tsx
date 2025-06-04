import React, { FC, useRef, useState } from 'react';
import { Text, View, getRecorderManager } from '@ray-js/ray';
import { Icon, Progress } from '@ray-js/smart-ui';
import { iconVoiceMic } from '@/res/iconsvg';
import { THEME_COLOR } from '@/constant';
import { useInterval } from 'ahooks';
import Strings from '@/i18n';

import styles from './index.module.less';

type Props = {
  onRecorded: (file: string) => void;
};

const BeforeRecord: FC<Props> = ({ onRecorded }) => {
  const [percent, setPercent] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const recordManager = useRef(getRecorderManager());
  const recordFile = useRef<string>();

  const handleStart = () => {
    recordManager.current.start({
      frameSize: undefined,
      format: 'wav',
      success: res => {
        recordFile.current = res.tempFilePath;
        setIsRecording(true);
      },
      fail: err => {
        console.log(err);
      },
    });
  };

  const handleFinish = () => {
    recordManager.current.stop({
      success: () => {
        setIsRecording(false);
        onRecorded(recordFile.current);
      },
    });
  };

  useInterval(
    () => {
      if (isRecording) {
        setPercent(percent => {
          const newPercent = percent + 10;

          if (newPercent >= 100) {
            recordManager.current.stop({
              success: () => {
                setIsRecording(false);
                onRecorded(recordFile.current);
              },
            });
          }

          return Math.min(newPercent, 100);
        });
      }
    },
    isRecording ? 1000 : undefined
  );

  return (
    <View className={styles.beforeRecord}>
      <View hoverClassName="touchable" onTouchStart={handleStart} onTouchEnd={handleFinish}>
        <Progress.Circle
          size="288rpx"
          trackWidth="4rpx"
          trackColor="#f2f2f2"
          percent={percent}
          fillColor={THEME_COLOR}
        >
          <Icon name={iconVoiceMic} size="80rpx" color="rgba(0, 0, 0, 0.7)" />
        </Progress.Circle>
      </View>
      <Text className={styles.text}>
        {isRecording
          ? Strings.getLang('dsc_release_finish')
          : Strings.getLang('dsc_press_start_audio')}
      </Text>
    </View>
  );
};

export default BeforeRecord;
