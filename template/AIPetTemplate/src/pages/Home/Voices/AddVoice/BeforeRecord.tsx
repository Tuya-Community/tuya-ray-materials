import React, { FC, useRef, useState } from 'react';
import { Text, View, getRecorderManager } from '@ray-js/ray';
import { Icon, Progress, Circle } from '@ray-js/smart-ui';
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
      <View
        style={{ position: 'relative', width: '100px', height: '100px' }}
        hoverClassName="touchable"
        onTouchStart={handleStart}
        onTouchEnd={handleFinish}
      >
        <Circle
          size={100}
          trackWidth={4}
          trackColor="#f2f2f2"
          percent={percent}
          fillColor={THEME_COLOR}
          customStyle={{ zIndex: 2 }}
        />
        <Icon
          name={iconVoiceMic}
          size="80rpx"
          color="rgba(0, 0, 0, 0.7)"
          customStyle={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
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
