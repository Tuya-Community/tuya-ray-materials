import React, { FC, useEffect } from 'react';
import { View, Text, router } from '@ray-js/ray';
import { useDispatch } from 'react-redux';
import { updateUiState } from '@/redux/modules/uiStateSlice';
import Strings from '@/i18n';
import { EMPTY_TYPE, TRANSFER_STATUS } from '../../index';
import EmptyContent from '../EmptyContent';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  summary: string;
  transferStatus: TRANSFER_STATUS;
}

const MindMapContent: FC<Props> = ({ summary, transferStatus }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    summary && dispatch(updateUiState({ tempMarkdownText: summary }));
  }, [summary]);

  const handleJumpToMindMap = () => {
    console.log('click......');
  };

  if (summary) {
    return (
      <View className={styles.content}>
        <View className={styles.box}>
          <View className={styles.button} onClick={handleJumpToMindMap}>
            <Text className={styles.label}>
              {Strings.getLang('recording_detail_go_to_mind_map')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (transferStatus === TRANSFER_STATUS.Processing)
    return <EmptyContent type={EMPTY_TYPE.TRANSCRIBING} resultType="summary" />;
  if (transferStatus === TRANSFER_STATUS.Finish)
    return <EmptyContent type={EMPTY_TYPE.NO_RESULT} />;
  return null;
};

export default React.memo(MindMapContent);
