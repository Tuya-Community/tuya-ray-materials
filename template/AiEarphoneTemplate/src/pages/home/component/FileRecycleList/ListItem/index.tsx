/*
 * @Author: hkc
 * @Date: 2025-10-21 17:59:51
 * @LastEditors: hkc
 * @LastEditTime: 2026-03-23 14:15:06
 * @Description: 录音文件列表项
 */
import React, { useMemo } from 'react';
import { View, Text } from '@ray-js/ray';
import { Tag } from '@ray-js/smart-ui';
import EllipsisText from '@/components/EllipsisText';
import ThemedImage from '@/components/ThemedImage';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { SingleCloudSyncStatus, SummaryStatus, TransferStatus } from '@/constant/enums';
import { FileListItem, NoteFileConvertStateType } from '@/redux/modules/audioFileSlice';
import { formatMilliseconds } from '@/utils/time';
import { getAudioSourceCode } from '@/utils';
import Res from '@/res';
import Strings from '@/i18n';

import { EmRichText } from '@/utils/searchEmHighlight';
import styles from './index.module.less';

interface IProps {
  id: string;
  data: FileListItem;
  /** 批量模式下当前 item 是否已被选中，由父组件计算后传入（替代整个 selectedRecordIds 数组） */
  isSelected?: boolean;
  isBatchMode?: boolean;
  isCloudFile?: boolean;
  /** 由父组件（FileRecycleList）统一订阅一次后传入，避免每个 ListItem 自行向 Redux 注册订阅 */
  isCloudSyncEnabled?: boolean;
  children?: React.ReactNode;
  needEmHighlight?: boolean;
  // onClick / onLongPress 已移除：由 RecycleView 的事件代理（onItemClick / onItemLongPress）统一分发，
  // 避免每个 item mount/unmount 时向 bridge 注册/注销大量回调导致函数注册表累积（内存泄漏根因）。
}

const Index: React.FC<IProps> = props => {
  const {
    id,
    data,
    isSelected = false,
    isBatchMode = false,
    isCloudFile,
    isCloudSyncEnabled = false,
    children,
    needEmHighlight = false,
  } = props;
  const {
    name,
    visit,
    transfer,
    summary,
    cloudSyncStatus,
    recordTime,
    duration,
    source,
    noteFileConvertState,
    tags,
  } = data;
  // 录音来源code
  const audioSourceCode = useMemo(() => getAudioSourceCode(source), [source]);

  const fileStatusElement = useMemo(() => {
    const isFailed = transfer === TransferStatus.Fail || summary === SummaryStatus.Fail;
    const isCompleted =
      transfer === TransferStatus.Success && summary === SummaryStatus.Success && visit === 2;
    const isProcessing = transfer === TransferStatus.Process || summary === SummaryStatus.Process;
    const isTransferring = noteFileConvertState === NoteFileConvertStateType.ING;
    const isTransferrFailed = noteFileConvertState === NoteFileConvertStateType.FAIL;

    if (isTransferrFailed) {
      return <Text className={styles.error}>{Strings.getLang('transforming_failed')}</Text>;
    }
    if (isTransferring) {
      return <Text className={styles.transferring}>{Strings.getLang('transforming')}</Text>;
    }
    if (isFailed) {
      return <Text className={styles.error}>{Strings.getLang('transfer_status_3')}</Text>;
    }
    if (isCompleted) {
      return <Text className={styles.success}>{Strings.getLang('transfer_status_2')}</Text>;
    }
    if (isProcessing) {
      return (
        <View className={styles.processing}>
          <ThemedImage
            src={Res.transcodingIcon}
            className={styles.processingIcon}
            imageName="transcodingIcon"
          />
          <Text className={styles.processingText}>
            {Strings.getLang('recording_detail_tip_transcribing')}
          </Text>
          <View className={styles.processingDots}>
            <Text className={styles.processingDot}>.</Text>
            <Text className={styles.processingDot}>.</Text>
            <Text className={styles.processingDot}>.</Text>
          </View>
        </View>
      );
    }

    // 下载相关状态不受云同步开关影响
    if (cloudSyncStatus === SingleCloudSyncStatus.Downloading) {
      return (
        <ThemedImage imageName="downloadGif" src={Res.downloadGif} className={styles.syncGif} />
      );
    }
    if (cloudSyncStatus === SingleCloudSyncStatus.DownloadFailed) {
      return (
        <ThemedImage
          imageName="uploadFailedImg"
          src={Res.uploadFailedImg}
          className={styles.syncGif}
        />
      );
    }

    if (!isCloudSyncEnabled) return null;

    // 使用静态映射对象，避免每次渲染都创建新对象
    if (cloudSyncStatus === SingleCloudSyncStatus.Uploading) {
      return <ThemedImage src={Res.uploadGif} className={styles.syncGif} imageName="uploadGif" />;
    }
    if (cloudSyncStatus === SingleCloudSyncStatus.UploadFailed) {
      return (
        <ThemedImage
          src={Res.uploadFailedImg}
          className={styles.syncGif}
          imageName="uploadFailedImg"
        />
      );
    }

    return null;
  }, [transfer, summary, visit, cloudSyncStatus, isCloudSyncEnabled, noteFileConvertState]);

  const listItemDisabled = useMemo(
    () =>
      noteFileConvertState === NoteFileConvertStateType.ING ||
      noteFileConvertState === NoteFileConvertStateType.FAIL,
    [noteFileConvertState]
  );

  // 格式化日期
  const formattedDate = useMemo(
    () => dayjs(recordTime * 1000).format('YYYY/MM/DD HH:mm:ss'),
    [recordTime]
  );

  // 格式化时长
  const formattedDuration = useMemo(() => formatMilliseconds(duration), [duration]);

  // 音频源图标
  const audioSourceIcon = useMemo(() => {
    if (!audioSourceCode) return null;
    const iconName = `${audioSourceCode}SourceIcon`;
    return <ThemedImage imageName={iconName} className={styles.icon} src={Res[iconName]} />;
  }, [audioSourceCode]);

  const itemClassName = useMemo(
    () =>
      clsx(styles.item, {
        [styles.unVisitItem]: !visit && !isBatchMode,
        [styles.editItem]: isBatchMode,
        [styles.disabled]: listItemDisabled,
      }),
    [visit, isBatchMode, listItemDisabled]
  );

  return (
    // 根 View 上不再注册 onClick / onLongPress：由 RecycleView 的 item wrapper 统一代理，
    // 消除 virtual list 每次 mount/unmount 时向 bridge 注册函数的累积问题。
    <View id={id} className={itemClassName}>
      {/* 批量模式下纯视觉 checkbox 指示器：无任何事件绑定，点击事件可自然冒泡到 RecycleView 代理层 */}
      {isBatchMode && (
        <View
          className={`${styles.checkboxIndicator}${
            isSelected ? ` ${styles.checkboxIndicatorSelected}` : ''
          }`}
        />
      )}

      <View className={isBatchMode ? styles.editContentBox : ''}>
        {!needEmHighlight && (
          <View className={styles.dotBox}>
            {!visit && !isBatchMode && <Text className={styles.dot} />}
          </View>
        )}
        <View className={styles.header}>
          <EllipsisText
            text={
              needEmHighlight ? (
                <EmRichText
                  content={name}
                  className={styles.name}
                  highlightClassName={styles.emHighlight}
                />
              ) : (
                name
              )
            }
            className={styles.name}
          />
          <View className={styles.status}>{fileStatusElement}</View>
        </View>
        <View className={styles.info}>
          <View className={styles.date}>{formattedDate}</View>
          <View className={styles.duration}>{formattedDuration}</View>
          {audioSourceIcon}
          {/* 图标代表云端有这个文件，不能用isFromCloud，等app新增字段 */}
          {isCloudFile && (
            <ThemedImage imageName="cloudIcon" src={Res.cloudIcon} className={styles.icon} />
          )}
        </View>
        {tags && tags.length > 0 && (
          <View className={styles.tagsRow}>
            {/* eslint-disable react/no-array-index-key -- 标签无唯一 id */}
            {tags.map((tag, idx) => (
              <Tag
                key={`${id}-tag-${tag}-${idx}`}
                color="var(--color-bg-tag)"
                textColor="var(--color-text-tag)"
                customClass={styles.tag}
              >
                {needEmHighlight ? (
                  <EmRichText
                    content={tag}
                    className={styles.tagEm}
                    highlightClassName={styles.emHighlight}
                    isTag
                  />
                ) : (
                  tag
                )}
              </Tag>
            ))}
            {/* eslint-enable react/no-array-index-key */}
          </View>
        )}
        {children}
      </View>
    </View>
  );
};

export default React.memo(Index);
