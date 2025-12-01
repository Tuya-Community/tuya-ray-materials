import React from 'react';
import { View, Image } from '@ray-js/ray';
import Res from '@/res';
import Strings from '@/i18n';
// @ts-ignore
import styles from './index.module.less';

export default function SwiperContent({ name, desc, imgPath }) {
  return (
    <>
      <View>
        <View className={styles.title}>{Strings.getLang(name)}</View>
      </View>
      <Image className={styles.img} src={imgPath} />
      <View className={styles.subtitle}>{desc}</View>
    </>
  );
}

export const defaultConfigs = [
  {
    name: 'mode_title_faceToFace_recording',
    key: 'faceToFace',
    imgPath: Res.faceGuidIcon,
    desc: (
      <>
        <View className={styles.desc}>{Strings.getLang('faceToface_guide_desc1')}</View>
        <View className={styles.desc}>{Strings.getLang('faceToface_guide_desc2')}</View>
      </>
    ),
  },
  {
    name: 'mode_title_simultaneous_recording',
    key: 'simultaneous',
    imgPath: Res.faceGuidIcon,
    desc: (
      <>
        <View className={styles.desc}>{Strings.getLang('simultaneous_guide_desc')}</View>
        <View className={styles.desc}>{Strings.getLang('simultaneous_guide_desc1')}</View>
        <View className={styles.desc}>{Strings.getLang('simultaneous_guide_desc2')}</View>
      </>
    ),
  },
  {
    name: 'mode_title_realtime_recording',
    key: 'realtime',
    imgPath: Res.realRecordGuidIcon,
    desc: (
      <>
        <View className={styles.desc}>{Strings.getLang('realtime_guide_desc')}</View>
        <View className={styles.desc}>{Strings.getLang('realtime_guide_desc1')}</View>
        <View className={styles.desc}>{Strings.getLang('realtime_guide_desc2')}</View>
      </>
    ),
  },
  {
    name: 'mode_title_call_recording',
    key: 'call',
    imgPath: Res.callGuidIcon,
    desc: (
      <>
        <View className={styles.desc}>{Strings.getLang('call_guide_desc')}</View>
        <View className={styles.desc}>{Strings.getLang('call_guide_desc1')}</View>
        <View className={styles.desc}>{Strings.getLang('call_guide_desc2')}</View>
      </>
    ),
  },
  {
    name: 'mode_title_meeting_recording',
    key: 'meeting',
    imgPath: Res.meetingGuidIcon,
    desc: (
      <>
        <View className={styles.desc}>{Strings.getLang('meeting_guide_desc')}</View>
        <View className={styles.desc}>{Strings.getLang('meeting_guide_desc1')}</View>
        <View className={styles.desc}>{Strings.getLang('meeting_guide_desc2')}</View>
      </>
    ),
  },
];
