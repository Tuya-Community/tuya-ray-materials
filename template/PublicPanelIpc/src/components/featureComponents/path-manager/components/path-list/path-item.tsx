import React from 'react';
import clsx from 'clsx';
import { View, Text, Image } from '@ray-js/ray';
import DecryptImage from '@ray-js/ray-ipc-decrypt-image';
import { getFileNameByUrl } from '@/utils';
import { useTheme } from '@/hooks';
import { IconFont } from '@/components/icon-font';
import emptyIconLight from '@/res/image/pathListEmpty.png';
import emptyIconDark from '@/res/image/pathListEmptyDark.png';

import styles from './path-item.module.less';

export interface PathItemProps {
  title: string;
  desc: string;
  devId: string;
  imageSrc: string;
  secret: string;
  playing?: boolean;
  onBtnClick?: (e) => void;
  onContentClick?: (e) => void;
  showBtn?: boolean;
}

export function PathItem(props: PathItemProps) {
  const {
    title,
    desc,
    onBtnClick,
    onContentClick,
    imageSrc,
    secret,
    devId,
    playing,
    showBtn = true,
  } = props;
  const theme = useTheme();

  const _onBtnClick = e => {
    if (!showBtn) return;
    e.origin.stopPropagation();
    onBtnClick && onBtnClick(e);
  };

  const _onContentClick = e => {
    onContentClick && onContentClick(e);
  };

  return (
    <View
      className={clsx(styles.content, {
        [styles.playing]: playing,
      })}
      onClick={_onContentClick}
    >
      <View className={styles.left}>
        <View className={styles.img}>
          <DecryptImage
            src={imageSrc}
            errView={
              <View className={clsx(styles.img, styles.emptyBox)}>
                <Image
                  className={styles.emptyImg}
                  src={theme === 'light' ? emptyIconLight : emptyIconDark}
                />
              </View>
            }
            deviceId={devId}
            fileName={getFileNameByUrl(imageSrc)}
            encryptKey={secret}
          />
        </View>
        <View className={styles.info}>
          <View className={clsx(styles.name, 'ellipsis')}>{title}</View>
          <View className={styles.desc}>
            <Text>{desc}</Text>
            <IconFont icon="right-arrow" otherClassName={styles.rightArrow} />
          </View>
        </View>
      </View>

      <View className={styles.buttonBox} onClick={_onBtnClick}>
        {Boolean(showBtn) && (
          <View className={styles.playButton}>
            <View className={styles.playButtonBg} />
            {playing ? (
              <IconFont icon="playing" otherClassName={styles.playIcon} />
            ) : (
              <IconFont icon="pause" otherClassName={styles.playIcon} />
            )}
          </View>
        )}
      </View>
    </View>
  );
}
