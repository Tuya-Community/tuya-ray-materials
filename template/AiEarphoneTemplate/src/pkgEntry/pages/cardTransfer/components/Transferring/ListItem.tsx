/*
 * @Author: hkc
 * @Date: 2026-01-25 17:31:48
 * @Description:
 * @LastEditTime: 2026-01-29 12:00:31
 * @LastEditors: hkc
 */
import React, { useMemo } from 'react';
import { View, Text, Image } from '@ray-js/ray';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { EllipsisText } from '@/components';
import Strings from '@/i18n';
import { CardTransferFileStatus } from '@/types/card';
import { formatMilliseconds } from '@/utils/time';
import Res from '@/res';

import styles from './index.module.less';

interface IProps {
  fileName: string;
  status: number;
  progress: number;
  fileDuring: number;
  timeStamp: number;
}

const ListItem: React.FC<IProps> = ({ fileName, status, progress, fileDuring, timeStamp }) => {
  const statusText = useMemo(() => {
    switch (status) {
      case CardTransferFileStatus.Waiting:
        return Strings.getLang('cardTransfer.status_waiting');
      case CardTransferFileStatus.Downloading:
        return `${progress}%`;
      case CardTransferFileStatus.Transforming:
        return Strings.getLang('cardTransfer.status_converting');
      case CardTransferFileStatus.Success:
        return Strings.getLang('cardTransfer.status_success');
      case CardTransferFileStatus.Failed:
        return Strings.getLang('cardTransfer.status_failed');
      default:
        return '';
    }
  }, [status, progress]);

  return (
    <View
      className={clsx(styles.listItem, {
        [styles.active]: status === CardTransferFileStatus.Downloading,
      })}
      style={{
        // @ts-ignore
        '--border-progress': `${progress}%`,
      }}
    >
      <EllipsisText className={styles.title} text={fileName} />
      <View className={styles.info}>
        <View className={styles.left}>
          {`${dayjs(timeStamp * 1000).format('YYYY/MM/DD HH:mm')} | ${formatMilliseconds(
            fileDuring
          )}`}
          <Image src={Res.cardSourceIcon} className={styles.icon} />
        </View>
        <Text
          className={`${styles.status} ${
            status === CardTransferFileStatus.Failed ? styles.statusError : ''
          }`}
        >
          {statusText}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(ListItem);
