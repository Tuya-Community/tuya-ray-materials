import React, { FC, useState } from 'react';
import { Image, location, router, Text, View } from '@ray-js/ray';
import { TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import { imgCloneTypeReciting, imgCloneTypeRecord } from '@/res';
import { getTheme } from '@/utils';
import styles from './index.module.less';

interface RouterSource {
  remainTimes: string;
  cloneEntry: string;
}

const CloneSetting: FC = () => {
  const routerSource = location.query as RouterSource;
  const { remainTimes, cloneEntry } = routerSource;
  const [cloneWay, setCloneWay] = useState('reciting');
  const [themeColor, setThemeColor] = useState(getTheme());

  const goToClone = () => {
    router.push(
      `/cloneVoice?cloneWay=${cloneWay}&remainTimes=${remainTimes}&cloneEntry=${cloneEntry}`
    );
  };

  return (
    <View className={styles.view}>
      <TopBar title={Strings.getLang('dsc_clone_voice_top_title')} backgroundColor="#daecf6" />
      <View className={styles.topContent}>
        <Text className={styles.title}>{Strings.getLang('dsc_clone_way')}</Text>
        <TouchableOpacity
          className={styles.singleWay}
          style={{
            border: cloneWay === 'reciting' ? `6rpx solid ${themeColor}` : '6rpx solid transparent',
          }}
          onClick={() => setCloneWay('reciting')}
        >
          <View className={styles.textWrap}>
            <Text className={styles.singleText}>{Strings.getLang('dsc_reciting_text')}</Text>
            <Text className={styles.singleTextDesc}>
              {Strings.getLang('dsc_clone_type_reciting_desc')}
            </Text>
          </View>

          <Image src={imgCloneTypeReciting} className={styles.singleImage} />
        </TouchableOpacity>
        <TouchableOpacity
          className={styles.singleWay}
          style={{
            border: cloneWay === 'record' ? `6rpx solid ${themeColor}` : '6rpx solid transparent',
          }}
          onClick={() => setCloneWay('record')}
        >
          <View className={styles.textWrap}>
            <Text className={styles.singleText}>{Strings.getLang('dsc_record_audio')}</Text>
            <Text className={styles.singleTextDesc}>
              {Strings.getLang('dsc_clone_type_recording_desc')}
            </Text>
          </View>

          <Image src={imgCloneTypeRecord} className={styles.singleImage} />
        </TouchableOpacity>
      </View>
      <View className={styles.btn} onClick={() => goToClone()}>
        <Text className={styles.btnText}>{Strings.getLang('dsc_next')}</Text>
      </View>
    </View>
  );
};

export default CloneSetting;
