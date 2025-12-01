import React, { FC } from 'react';
import { View, Text, Image } from '@ray-js/components';
import Res from '@/res';
import Strings from '@/i18n';
import { EMPTY_TYPE } from '../../index';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  type: EMPTY_TYPE;
  resultType?: string;
}

const EmptyContent: FC<Props> = ({ type, resultType }) => {
  return (
    <View className={styles.emptyBox}>
      <Image src={Res.imgPlaceholder} className={styles.emptyImg} />
      {type === EMPTY_TYPE.NO_RESULT && (
        <Text className={styles.emptyText}>
          {Strings.getLang('recording_detail_tip_no_result')}
        </Text>
      )}
      {type === EMPTY_TYPE.NO_TRANSCRIPTION && (
        <Text className={styles.emptyText}>
          {Strings.getLang('recording_detail_tip_no_transcription')}
        </Text>
      )}
      {type === EMPTY_TYPE.TRANSCRIBING && (
        <Text className={styles.loadingText}>
          {resultType === 'stt' && Strings.getLang('recording_detail_tip_transcribing_stt')}
          {resultType === 'summary' && Strings.getLang('recording_detail_tip_transcribing_summary')}
        </Text>
      )}
    </View>
  );
};

export default React.memo(EmptyContent);
