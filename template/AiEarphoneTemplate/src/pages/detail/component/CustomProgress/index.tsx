/*
 * @Author: hkc
 * @Date: 2025-07-17 10:23:51
 * @LastEditors: hkc
 * @LastEditTime: 2026-02-05 12:03:20
 * @Description:
 */
import React from 'react';
import { View } from '@ray-js/ray';

import CanvasProgressBar from '@/components/CanvasProgressBar';
import { OfflineFileUploadStatus } from '@/types/file';
import Strings from '@/i18n';
import Res from '@/res';
import FileInfo from '../FileInfo';
import EmptyContent from '../EmptyContent';

import styles from './index.module.less';

// 进度条配置常量
const PROGRESS_BAR_CONFIG = {
  HEIGHT: 12,
  FILL_COLOR: '#5E9BFF',
  TRACK_COLOR: '#E7E8EE',
} as const;

interface IProps {
  progress: number;
  uploadStatus: OfflineFileUploadStatus;
  updateSummary: (params: { title: string; summary?: string }) => Promise<void>;
}

const Index: React.FC<IProps> = props => {
  const { progress, uploadStatus, updateSummary } = props;

  // 判断是否为等待上传状态
  const isWaitingUpload = uploadStatus === OfflineFileUploadStatus.Waiting;

  // 渲染等待上传状态
  const renderWaitingContent = () => (
    <EmptyContent
      image={Res.fileTranscribe}
      title={Strings.getLang('detail.upload_waiting')}
      desc={Strings.getLang('detail.upload_tip')}
    />
  );

  // 渲染上传进度内容
  const renderUploadingContent = () => (
    <>
      <CanvasProgressBar
        percent={progress}
        className={styles.progress}
        height={PROGRESS_BAR_CONFIG.HEIGHT}
        fillColor={PROGRESS_BAR_CONFIG.FILL_COLOR}
        trackColor={PROGRESS_BAR_CONFIG.TRACK_COLOR}
      />
      <View className={styles.progressTitle}>{Strings.getLang('record_file_uploading')}</View>
      <View className={styles.progressText}>{Strings.getLang('keep_app_active')}</View>
    </>
  );

  return (
    <View className={styles.container}>
      <FileInfo updateSummary={updateSummary} />
      <View className={styles.content}>
        {isWaitingUpload ? renderWaitingContent() : renderUploadingContent()}
      </View>
    </View>
  );
};

export default Index;
