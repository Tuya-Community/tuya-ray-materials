import React from 'react';
import { View, Text } from '@ray-js/ray';
import clsx from 'clsx';
import DecryptImage from '@ray-js/ray-ipc-decrypt-image';
import { getFileNameByUrl } from '@/utils';
import { IconFont } from '@/components/icon-font';
import Strings from '@/i18n';

import styles from './point-item.module.less';

export interface PointItemProps {
  className?: string;
  devId: string;
  imageSrc: string;
  secret: string;
  playing?: boolean;
}

export function PointItem(props: PointItemProps) {
  const { className, imageSrc, devId, secret, playing } = props;

  return (
    <View
      className={clsx(styles.content, className, {
        [styles.playing]: playing,
      })}
    >
      <View className={styles.imageBox}>
        <DecryptImage
          className={styles.img}
          src={imageSrc}
          errView={<View className={styles.img} />}
          deviceId={devId}
          fileName={getFileNameByUrl(imageSrc)}
          encryptKey={secret}
        />
      </View>
      <View className={styles.jumpBtn}>
        <Text>{Strings.getLang('moveToPointTitle')}</Text>
        <IconFont style={{ marginTop: '3rpx' }} icon="right-arrow" />
      </View>
    </View>
  );
}
