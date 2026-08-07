import React, { FC } from 'react';
import { View, Text, Button } from '@ray-js/components';
import { BottomSheet } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import styles from './index.module.less';

interface Props {
  show: boolean;
  onEnable: () => void;
  onSkip: () => void;
}

const TranscribeOptimizePopup: FC<Props> = ({ show, onEnable, onSkip }) => {
  return (
    <BottomSheet
      customClass={styles.bottomSheet}
      show={show}
      round
      draggable
      closeOnClickOverlay={false}
      midDragHeight={500}
      minDragHeight={500}
      maxDragHeight={600}
      closeDragHeight={500}
    >
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>{Strings.getLang('transcribe_optimize')}</Text>
          <Text className={styles.desc}>{Strings.getLang('transcribe_optimize_popup_desc')}</Text>
        </View>

        <View className={styles.exampleCard}>
          <View className={styles.exampleSection}>
            <Text className={styles.exampleLabel}>
              {Strings.getLang('transcribe_optimize_before')}
            </Text>
            <Text className={styles.exampleTextBefore}>
              {Strings.getLang('transcribe_optimize_before_example')}
            </Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.exampleSection}>
            <Text className={styles.exampleLabel}>
              {Strings.getLang('transcribe_optimize_after')}
            </Text>
            <Text className={styles.exampleTextAfter}>
              {Strings.getLang('transcribe_optimize_after_example')}
            </Text>
          </View>
        </View>

        <View className={styles.buttonContainer}>
          <Button className={styles.enableButton} onClick={onEnable}>
            <Text className={styles.enableButtonText}>
              {Strings.getLang('transcribe_optimize_enable')}
            </Text>
          </Button>
          <Button className={styles.skipButton} onClick={onSkip}>
            <Text className={styles.skipButtonText}>
              {Strings.getLang('transcribe_optimize_skip')}
            </Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
};

export default TranscribeOptimizePopup;
