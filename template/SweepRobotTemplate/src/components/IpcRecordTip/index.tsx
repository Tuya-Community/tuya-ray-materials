/* eslint-disable no-console */
import React, { useMemo } from 'react';
import { View, Text, Button, Image } from '@ray-js/ray';
import Strings from '@/i18n';
import { useSelector } from 'react-redux';
import { selectIpcCommonValue } from '@/redux/modules/ipcCommonSlice';
import { goToAlbum } from '@/utils/ipc';
import clsx from 'clsx';
import playIcon from '@tuya-miniapp/icons/dist/svg/Play';
import { Icon } from '@ray-js/smart-ui';

import styles from './index.module.less';

function IpcRecordTip() {
  const recordType = useSelector(selectIpcCommonValue('recordType'));
  const recordPic = useSelector(selectIpcCommonValue('recordPic'));
  const isFull = useSelector(selectIpcCommonValue('isFull'));

  const tipText = useMemo(() => {
    const langKey = recordType === 1 ? 'ipc_screen_shot_text' : 'ipc_record_save';
    return Strings.getLang(langKey);
  }, [recordType]);

  return (
    <View className={clsx(styles.container, isFull && styles.isFull)}>
      <View className={styles.left}>
        <View className={styles.imageWrap}>
          {recordPic.map((pic, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <View className={styles.image} key={`pic${index}`}>
                <View className={styles.play} style={{ display: recordType === 2 ? '' : 'none' }}>
                  <Icon name={playIcon} size="40rpx" color="#ffffff" />
                </View>
                <Image src={pic} className={styles.pic} />
              </View>
            );
          })}
        </View>
        <Text>{tipText}</Text>
      </View>
      <Button className={styles.goAlbum} onClick={goToAlbum}>
        {Strings.getLang('ipc_enter_album')}
      </Button>
    </View>
  );
}

export default IpcRecordTip;
