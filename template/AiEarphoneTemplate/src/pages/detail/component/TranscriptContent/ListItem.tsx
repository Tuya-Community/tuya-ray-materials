import React, { useCallback, useContext, useMemo, useRef, useEffect } from 'react';
import { Textarea, View, Text, showToast } from '@ray-js/ray';
import { useDebounceFn } from 'ahooks';
import isNumber from 'lodash/isNumber';

import { TranscriptSegment } from '@/types/file';
import { convertSecondsToTime } from '@/utils';
import { TranslateStatus, SingleCloudSyncStatus } from '@/constant/enums';
import { tttDownloadNoteAudio } from '@/api/ttt';
import Strings from '@/i18n';
import { PlayStatus } from '../../enum';
import { fileEmitter } from '../../index';
import FileDetailContext from '../../context';

import styles from './index.module.less';

interface IProps {
  id?: string;
  data: TranscriptSegment;
  index: number;
  speakerColorMap: { [key: string]: string };
  onClickSpeaker: (speaker: string, index: number) => void;
  onEnableAutoScroll?: () => void;
}

const ListItem: React.FC<IProps> = props => {
  const { id, data, index, speakerColorMap, onClickSpeaker, onEnableAutoScroll } = props;
  const {
    playStatus,
    currentPlaySecond,
    setTransferList,
    isEditMode,
    transEditIndex,
    setTransEditIndex,
    fileDetail,
    audioDownloadStatus,
    setAudioDownloadStatus,
  } = useContext(FileDetailContext);
  const { startSecond, endSecond, text, transText, speaker } = data || {};
  const playableAudioPath = useMemo(() => fileDetail?.filePath, [fileDetail?.filePath]);

  const lastClickedSecondRef = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 是否播放
  const isPlay = useMemo(() => {
    return (
      playStatus !== PlayStatus.Initial &&
      isNumber(currentPlaySecond) &&
      currentPlaySecond >= startSecond &&
      currentPlaySecond < endSecond
    );
  }, [data, playStatus, currentPlaySecond]);

  // 是否编辑
  const isEditItem = useMemo(() => {
    return isEditMode && transEditIndex === index;
  }, [isEditMode, transEditIndex, index]);

  // 更新转写数据（函数式更新，避免闭包捕获整个 transferList）
  const handleUpdateSttData = useCallback(
    (newText: string, targetIndex: number, isTrans?: boolean) => {
      setTransferList?.(prev =>
        prev.map((item, idx) => {
          if (idx !== targetIndex) return item;
          return isTrans ? { ...item, transText: newText } : { ...item, text: newText };
        })
      );
    },
    [setTransferList]
  );

  // 点击文案防抖播放
  const handleClickSttItem = async () => {
    const second = data?.startSecond || 0;

    // 如果没有本地文件路径，需要先下载音频
    if (!playableAudioPath) {
      // 记录最后一次点击的片段时间
      lastClickedSecondRef.current = second;

      // 如果正在下载中，只显示提示，不重复触发下载
      if (audioDownloadStatus === SingleCloudSyncStatus.Downloading) {
        showToast({
          title: Strings.getLang('audio_downloading'),
          icon: 'none',
        });
        return;
      }

      // 开始下载音频
      try {
        setAudioDownloadStatus?.(SingleCloudSyncStatus.Downloading);
        showToast({
          title: Strings.getLang('audio_downloading'),
          icon: 'none',
        });

        await tttDownloadNoteAudio({
          fileId: fileDetail?.fileId,
          recordId: fileDetail?.recordId,
        });

        // 下载成功，状态会在其他地方更新（通过MQTT或刷新文件详情）
        // 这里不需要手动更新状态，等待 fileDetail?.filePath 更新后自动播放
      } catch (error) {
        console.error('音频下载失败:', error);
      }
      return;
    }

    // 有本地文件，直接播放
    fileEmitter.emit('onAsrClick', second);

    // 恢复自动滚动
    onEnableAutoScroll?.();
  };
  const { run: runClickSttItem } = useDebounceFn(handleClickSttItem, { wait: 300, leading: true });

  // 监听文件路径变化或下载状态变化，下载完成后自动播放
  useEffect(() => {
    // 如果之前有记录点击的片段，且现在文件路径已存在或下载成功，则自动播放
    if (lastClickedSecondRef.current !== null && playableAudioPath) {
      const targetSecond = lastClickedSecondRef.current;
      lastClickedSecondRef.current = null;

      autoPlayTimerRef.current = setTimeout(() => {
        fileEmitter.emit('onAsrClick', targetSecond);
        onEnableAutoScroll?.();
        autoPlayTimerRef.current = null;
      }, 100);
    }
  }, [playableAudioPath, onEnableAutoScroll]);

  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, []);

  // 输入文案防抖
  const { run: handleInput } = useDebounceFn(
    (value: string, index: number, isTrans: boolean) => {
      handleUpdateSttData(value, index, isTrans);
    },
    {
      wait: 250,
    }
  );

  return (
    <View key={`${startSecond}`} className={`${styles.sttItem} stt-list-item`} id={id}>
      <View className={styles.header}>
        {speaker && (
          <Text
            className={styles.speaker}
            style={
              {
                color: speakerColorMap[speaker],
                // @ts-ignore
                '--speaker-bg-color': `${speakerColorMap[speaker]}1A`,
              } as any
            }
            onClick={() => {
              onClickSpeaker(speaker, index);
            }}
          >
            {speaker}
          </Text>
        )}
        <Text className={styles.timeText}>{convertSecondsToTime(startSecond)}</Text>
      </View>

      <View
        onClick={e => {
          if (isEditMode) {
            setTransEditIndex(index);
          } else {
            e.origin.stopPropagation();
            runClickSttItem();
          }
        }}
      >
        {isEditMode && transEditIndex === index ? (
          <>
            <Textarea
              // @ts-ignore
              focus={isEditItem}
              // disabled={!isEditItem}
              className={styles.textareaText}
              autoHeight
              maxLength={1000}
              value={text}
              onInput={event => {
                handleInput(event?.value || '', index, false);
              }}
            />
            {transText && (
              <Textarea
                className={styles.textareaText}
                style={{
                  color: 'var(--color-primary)',
                }}
                autoHeight
                maxLength={1000}
                value={transText}
                onInput={event => {
                  handleInput(event?.value || '', index, true);
                }}
              />
            )}
          </>
        ) : (
          <>
            <View
              className={styles.sttText}
              style={
                isPlay
                  ? { color: speaker ? speakerColorMap[speaker] : 'var(--color-primary)' }
                  : undefined
              }
            >
              {text}
            </View>
            {fileDetail?.translateState !== TranslateStatus.Process && transText && (
              <View
                className={styles.sttText}
                style={{
                  color: 'var(--color-primary)',
                }}
              >
                {transText}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default React.memo(ListItem);
