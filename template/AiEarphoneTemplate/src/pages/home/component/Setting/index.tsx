import React, { FC, useEffect, useMemo } from 'react';
import { View, Text, router } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { useSelector, useDispatch } from 'react-redux';
// import dayjs from 'dayjs';
import { selectUserInfo } from '@/redux/modules/userInfoSlice';
import { ActionRow } from '@/components/ActionRow';
import { getAudioAccountDetailByCatalogCode, selectShopInfo } from '@/redux/modules/shopInfoSlice';
import { selectAudioFile } from '@/redux/modules/audioFileSlice';
import Strings from '@/i18n';
import { CUSTOM_APPS, SHOP_CATALOG } from '@/constant';
import { selectAppInfo } from '@/redux/modules/appInfoSlice';

// @ts-ignore
import styles from './index.module.less';

const iconImgStyle = { width: '20px', height: '20px' };

const Setting: FC = () => {
  const dispatch = useDispatch();
  const { fileList } = useSelector(selectAudioFile);
  const { avatarUrl, nickName } = useSelector(selectUserInfo);
  // const { AI_WEARABLE_BT, benefits } = useSelector(selectShopInfo);
  const { benefits } = useSelector(selectShopInfo);
  const { appId } = useSelector(selectAppInfo);
  // const productStyle = useSelector(selectUiStateByKey('productStyle'));
  // const isCardStyle = productStyle === 'card';
  // const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion'));

  useEffect(() => {
    dispatch(getAudioAccountDetailByCatalogCode(SHOP_CATALOG.AI_WEARABLE_BT));
    dispatch(getAudioAccountDetailByCatalogCode(SHOP_CATALOG.AI_AUDIO_TRANS));
  }, []);

  // 离线转写剩余时长
  // const offlineLeftTimeText = useMemo(() => {
  //   return `${Strings.getLang('vip_offline_trans_left_time_text').replace(
  //     '__leftTime__',
  //     Math.floor((AI_WEARABLE_BT?.accountData?.leftTime || 0) / 60)
  //   )}`;
  // }, [AI_WEARABLE_BT]);
  // 实时转写剩余时长
  // const realtimeLeftTimeText = useMemo(() => {
  //   return `${Strings.getLang('vip_realtime_trans_left_time_text').replace(
  //     '__leftTime__',
  //     Math.floor((AI_AUDIO_TRANS?.accountData?.leftTime || 0) / 60)
  //   )}`;
  // }, [AI_AUDIO_TRANS]);

  // const resetTimeText = `${Strings.getLang('vip_reset_time')} | ${dayjs(
  //   resetTime || new Date()
  // ).format('YYYY.MM.DD')}`;
  // const leftTimeText = `${Strings.getLang('vip_left_time_text').replace(
  //   '__leftTime__',
  //   Math.floor(leftTime / 60)
  // )}`;
  // const totalTimeText = `${Strings.getLang('vip_total_time_text').replace(
  //   '__totalTime__',
  //   Math.floor(totalTime / 60)
  // )}`;

  const hours = useMemo(() => {
    const val = fileList.reduce((acc, item) => acc + item.duration, 0);
    // 1秒 = 1000毫秒
    const seconds = Math.floor(val / 1000);
    // 1分钟 = 60秒
    const minutes = Math.floor(seconds / 60);
    // 1小时 = 60分钟，保留一位小数
    const hours = (minutes / 60).toFixed(1);
    return hours;
  }, [fileList]);

  return (
    <View className={styles.container}>
      {!CUSTOM_APPS.includes(appId) && (
        <View className={styles.userInfo}>
          <ThemedImage src={avatarUrl} className={styles.avatar} />
          <Text className={styles.userName}>{nickName}</Text>
        </View>
      )}
      <View
        className={styles.sum}
        style={{
          marginBottom: CUSTOM_APPS.includes(appId) ? '30px' : '0px',
          marginTop: CUSTOM_APPS.includes(appId) ? '40px' : '0px',
        }}
      >
        <View className={styles.line} />
        <View className={styles.sumTextBox}>
          <Text className={styles.sumValue}>{fileList?.length}</Text>
          <Text className={styles.sumText}>{Strings.getLang('files_count')}</Text>
        </View>
        <View className={styles.sumTextBox}>
          <Text className={styles.sumValue}>{hours}</Text>
          <Text className={styles.sumText}>{Strings.getLang('timeLen')}</Text>
        </View>
      </View>
      {!CUSTOM_APPS.includes(appId) && (
        <View
          className={styles.vipContainer}
          onClick={() => {
            router.push('/shop', { subpackage: 'pkgShop' });
          }}
        >
          <View className={styles.header}>
            <View className={styles.vipBox}>
              <ThemedImage imageName="vipIcon" src={Res.vipIcon} className={styles.vipIcon} />
              <Text className={styles.title}>{Strings.getLang('ai_vip')}</Text>
            </View>
            <View className={styles.benefitText}>
              {Strings.formatValue('shop_aready_benefit', benefits?.length || 0)}
            </View>
          </View>
          <Icon type="icon-right" size={16} color="var(--color-white-solid)" />
        </View>
      )}

      <ActionRow
        img={Res.imgRecords}
        imgStyle={iconImgStyle}
        label={Strings.getLang('title_transcription_records')}
        actionType="arrow"
        onClick={() => {
          router.push('/records', { subpackage: 'pkgSettings' });
        }}
      />
    </View>
  );
};

export default React.memo(Setting);
