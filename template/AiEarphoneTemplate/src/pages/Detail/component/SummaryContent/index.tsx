import React, { FC } from 'react';
import { View } from '@ray-js/components';
import Markdown from '@/components/MarkdownParser/parser';
// @ts-ignore
import styles from './index.module.less';
import { EMPTY_TYPE, TRANSFER_STATUS } from '../../index';
import EmptyContent from '../EmptyContent';

interface Props {
  summary: string;
  transferStatus: TRANSFER_STATUS;
}

const SummaryContent: FC<Props> = ({ summary, transferStatus }) => {
  if (summary) {
    return (
      <View className={styles.content}>
        <Markdown>{summary}</Markdown>
      </View>
    );
  }

  if (transferStatus === TRANSFER_STATUS.Processing)
    return <EmptyContent type={EMPTY_TYPE.TRANSCRIBING} resultType="summary" />;
  if (transferStatus === TRANSFER_STATUS.Finish)
    return <EmptyContent type={EMPTY_TYPE.NO_RESULT} />;
  return null;
};

export default React.memo(SummaryContent);
