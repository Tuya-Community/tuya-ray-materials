import React, { FC, useState } from 'react';
import { View, Text, Textarea } from '@ray-js/components';
import { convertSecondsToTime } from '@/utils';
import { playerEmitter } from '@/components/Player';
import { RecordType } from '@/redux/modules/audioFileSlice';
import { useDebounceFn } from 'ahooks';
import { EMPTY_TYPE, PLAY_STATUS, TRANSFER_STATUS } from '../../index';
import EmptyContent from '../EmptyContent';
// @ts-ignore
import styles from './index.module.less';

export type SttDataItem = {
  startSecond: number;
  endSecond: number;
  text: string;
  transText?: string;
  asrId?: number;
  channel?: number; // 其中channel0表示 左耳，channel1表示 右耳
};

interface Props {
  playerStatus: PLAY_STATUS;
  transferStatus: TRANSFER_STATUS;
  sttData: SttDataItem[];
  currPlayTime: number;
  innerAudioContextRef: any;
  isEditMode: boolean;
  recordType: RecordType;
  onUpdateSttData: (text: string, index: number, isTrans?: boolean) => void;
}

const SttContent: FC<Props> = ({
  playerStatus,
  // wavFilePath,
  sttData,
  transferStatus,
  currPlayTime,
  // onChangePlayerStatus,
  innerAudioContextRef,
  isEditMode,
  recordType,
  onUpdateSttData,
}) => {
  const handleClickSttItem = async (sttItem: any) => {
    if (isEditMode) return;
    if (!innerAudioContextRef.current) return;
    const second = sttItem?.startSecond || 0;
    playerEmitter.emit('seek', { second });
  };

  const [editItemIdx, setEditItemIdx] = useState(-1);

  const handleLongClickSttItem = (index: number) => {
    if (!isEditMode) return;
    setEditItemIdx(index);
  };

  const { run: handleInput } = useDebounceFn(
    (value: string, index: number, isTrans) => {
      onUpdateSttData(value, index, !!isTrans);
    },
    {
      wait: 250,
    }
  );

  if (sttData?.length) {
    return (
      <View className={styles.content}>
        {sttData.map((item, index) => {
          const { startSecond, endSecond, text, transText, channel, asrId } = item;
          const isPlay = !!playerStatus && currPlayTime >= startSecond && currPlayTime < endSecond;
          if (recordType === RecordType.SIMULTANEOUS || recordType === 3) {
            return (
              <View
                key={asrId}
                className={channel === 0 ? styles.leftTextBox : styles.rightTextBox}
                onClick={() => {
                  handleClickSttItem(item);
                }}
                onLongClick={() => {
                  handleLongClickSttItem(index);
                }}
              >
                {isEditMode && editItemIdx === index ? (
                  <>
                    <Textarea
                      style={styles.textareaText}
                      autoHeight
                      maxLength={1000}
                      value={text}
                      onInput={event => {
                        handleInput(event?.value || '', index, false);
                      }}
                    />
                    <Textarea
                      style={styles.textareaText}
                      autoHeight
                      maxLength={1000}
                      value={transText}
                      onInput={event => {
                        handleInput(event?.value || '', index, true);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Text
                      className={styles.originText}
                      style={
                        isPlay
                          ? {
                            color: 'rgba(240, 51, 51, 1)',
                          }
                          : null
                      }
                    >
                      {text}
                    </Text>
                    <Text className={styles.transText}>{transText}</Text>
                  </>
                )}
              </View>
            );
          }
          return (
            <View
              key={`${startSecond}`}
              className={styles.sttItem}
              onClick={() => {
                handleClickSttItem(item);
              }}
              onLongClick={() => {
                handleLongClickSttItem(index);
              }}
            >
              <View className={styles.sttItemHeader}>
                <View className={styles.timeDot} />
                <Text className={styles.timeText}>{convertSecondsToTime(startSecond)}</Text>
              </View>
              {isEditMode && editItemIdx === index ? (
                <>
                  <Textarea
                    style={styles.textareaText}
                    autoHeight
                    maxLength={1000}
                    value={text}
                    onInput={event => {
                      handleInput(event?.value || '', index, false);
                    }}
                  />
                  <Textarea
                    style={styles.textareaText}
                    autoHeight
                    maxLength={1000}
                    value={transText}
                    onInput={event => {
                      handleInput(event?.value || '', index, true);
                    }}
                  />
                </>
              ) : (
                <>
                  <Text
                    className={styles.sttText}
                    style={
                      isPlay
                        ? {
                          color: 'rgba(240, 51, 51, 1)',
                        }
                        : null
                    }
                  >
                    {text}
                  </Text>
                  <Text
                    className={styles.sttText}
                    style={{
                      backgroundColor: 'rgba(23, 106, 253, 0.15)',
                    }}
                  >
                    {transText}
                  </Text>
                </>
              )}
            </View>
          );
        })}
      </View>
    );
  }
  if (transferStatus === TRANSFER_STATUS.Processing)
    return <EmptyContent type={EMPTY_TYPE.TRANSCRIBING} resultType="stt" />;
  if (transferStatus === TRANSFER_STATUS.Finish)
    return <EmptyContent type={EMPTY_TYPE.NO_RESULT} />;
  return null;
};

export default React.memo(SttContent);
