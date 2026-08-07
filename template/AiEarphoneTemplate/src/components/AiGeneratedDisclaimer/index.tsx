import React from 'react';
import { View, Text } from '@ray-js/components';
import Strings from '@/i18n';
import styles from './index.module.less';

interface Props {
  className?: string;
}

const AiGeneratedDisclaimer: React.FC<Props> = ({ className = '' }) => {
  return (
    <View className={`${styles.disclaimer} ${className}`}>
      <Text className={styles.disclaimerText}>{Strings.getLang('ai_generated_disclaimer')}</Text>
    </View>
  );
};

export default AiGeneratedDisclaimer;
