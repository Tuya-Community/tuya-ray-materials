/*
 * @Author: hkc
 * @Date: 2025-09-24 10:56:05
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-02 16:48:37
 * @Description: 文件信息
 */
import React, { useContext, useMemo } from 'react';
import { Textarea, View, Text } from '@ray-js/ray';
import dayjs from 'dayjs';

import { formatMilliseconds } from '@/utils/time';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { getAudioSourceCode } from '@/utils';
import {
  TransferStatus,
  SummaryStatus,
  SingleCloudSyncStatus,
  ShareStatus,
} from '@/constant/enums';
import { atopUpdateFileInfo } from '@/api/common';
import { useSelector } from '@/redux';
import Strings from '@/i18n';
import FileDetailContext from '../../context';

import styles from './index.module.less';

interface IProps {
  updateSummary: (params: { title: string; summary?: string }) => Promise<void>;
  style?: React.CSSProperties;
  id?: string;
}

const Index: React.FC<IProps> = ({ updateSummary, style, id }) => {
  const { homeId } = useSelector(state => state.devInfo);
  const { fileDetail } = useContext(FileDetailContext);
  const summaryStatus = fileDetail?.summary;
  const transferStatus = fileDetail?.transfer;

  // 录音来源code
  const audioSourceCode = useMemo(() => {
    return getAudioSourceCode(fileDetail?.source);
  }, [fileDetail]);

  // 失焦时间处理
  const handleBlur = async event => {
    const value = event.detail.value || '';
    if (
      value &&
      value !== fileDetail?.name &&
      summaryStatus !== SummaryStatus.Process &&
      transferStatus !== TransferStatus.Process
    ) {
      updateSummary({
        title: value,
      });

      // 更新云端文件名
      await atopUpdateFileInfo({
        audioRecordRequest: JSON.stringify({
          recordId: fileDetail?.recordId,
          name: value,
          ownerId: homeId,
        }),
      });
    }
  };

  return (
    <View id={id} className={styles.fileInfo} style={style}>
      <Textarea
        className={styles.name}
        value={fileDetail?.name}
        disabled={
          summaryStatus === SummaryStatus.Process || transferStatus === TransferStatus.Process
        }
        autoHeight
        onBlur={handleBlur}
      />

      <View className={styles.info}>
        <View className={styles.date}>
          {dayjs((fileDetail?.recordTime || 0) * 1000).format('YYYY/MM/DD HH:mm:ss')}
        </View>
        <View className={styles.divider} />
        <View className={styles.duration}>{formatMilliseconds(fileDetail?.duration || 0)}</View>
        {audioSourceCode && (
          <ThemedImage
            imageName={`${audioSourceCode}SourceIcon`}
            className={styles.icon}
            src={Res[`${audioSourceCode}SourceIcon`]}
          />
        )}
        {(fileDetail?.cloudSyncStatus === SingleCloudSyncStatus.UploadSuccess ||
          fileDetail?.isFromCloud) && (
          <ThemedImage imageName="cloudIcon" src={Res.cloudIcon} className={styles.icon} />
        )}
        {fileDetail?.linkShared === ShareStatus.ShareIng && (
          <Text className={styles.share}>{Strings.getLang('share_link_shared')}</Text>
        )}
      </View>
    </View>
  );
};

export default Index;
