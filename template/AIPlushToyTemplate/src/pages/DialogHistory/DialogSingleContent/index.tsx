import React, { FC } from 'react';
import { Text, View } from '@ray-js/ray';
import { DialogContentItem } from '@/types';
import styles from './index.module.less';

interface Props {
  questionList: Array<DialogContentItem>;
  answerList: Array<DialogContentItem>;
  requestId: string;
  createTime: string;
}

const DialogSingleContent: FC<Props> = ({ questionList, answerList, requestId, createTime }) => {
  return (
    <View className={styles.container} id={requestId}>
      <Text className={styles.timeText}>{createTime}</Text>
      <View className={styles.questionBox}>
        {questionList.map((item, index) => {
          const { type, context } = item;
          return (
            <View
              className={styles.contentBox}
              key={`${requestId}question${index}`}
              style={{ backgroundColor: '#427FF7', borderRadius: '32rpx 32rpx 0px 32rpx' }}
            >
              {type === 'text' && (
                <Text
                  className={styles.contentText}
                  style={{
                    color: '#FFFFFF',
                  }}
                >
                  {context}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <View className={styles.answerBox}>
        {answerList.map((item, index) => {
          const { type, context } = item;
          return (
            <View
              className={styles.contentBox}
              key={`${requestId}answer${index}`}
              style={{ backgroundColor: '#FFFFFF', borderRadius: '32rpx 32rpx 32rpx 0px' }}
            >
              {type === 'text' && (
                <Text
                  className={styles.contentText}
                  style={{
                    color: 'rgba(0, 0, 0, 0.9)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {context}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DialogSingleContent;
