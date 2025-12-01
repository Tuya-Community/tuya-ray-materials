import React, { FC, useMemo } from 'react';
import { View, Text, Image, router, openPanel } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
import Res from '@/res';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '@/redux/modules/userInfoSlice';
import { ActionRow } from '@/components/ActionRow';
import { selectAudioFile } from '@/redux/modules/audioFileSlice';
import Strings from '@/i18n';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
// @ts-ignore
import styles from './index.module.less';

const iconImgStyle = { width: '20px', height: '20px' };

const Setting: FC = () => {
  const devInfo = useSelector(selectDevInfo);
  const dispatch = useDispatch();
  const { fileList } = useSelector(selectAudioFile);
  const { avatarUrl, nickName } = useSelector(selectUserInfo);
  // const { AI_WEARABLE_BT, AI_AUDIO_TRANS } = useSelector(selectShopInfo);
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const supportEarControl = useSelector(selectUiStateByKey('supportEarControl'));
  const isCardStyle = productStyle === 'card';
  const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion'));

  // useEffect(() => {
  //   dispatch(getAudioAccountDetailByCatalogCode('AI_WEARABLE_BT'));
  //   dispatch(getAudioAccountDetailByCatalogCode('AI_AUDIO_TRANS'));
  // }, []);

  // 离线转写剩余时长
  // const offlineLeftTimeText = useMemo(() => {
  //   return `${Strings.getLang('vip_offline_trans_left_time_text').replace(
  //     '__leftTime__',
  //     Math.floor((AI_WEARABLE_BT?.accountData?.leftTime || 0) / 60)
  //   )}`;
  // }, [AI_WEARABLE_BT]);
  const offlineLeftTimeText = 0; // 此处暂时写死
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
    // 1小时 = 60分钟
    const hours = Math.floor(minutes / 60);
    return hours;
  }, [fileList]);

  return (
    <View className={styles.container}>
      <View className={styles.userInfo}>
        <Image src={avatarUrl} className={styles.avatar} />
        <Text className={styles.userName}>{nickName}</Text>
      </View>
      <View className={styles.sum}>
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
      <View
        className={styles.vipContainer}
        style={{
          backgroundImage: `url(${Res.vipBg})`,
        }}
      >
        <Image src={Res.vipIcon} className={styles.vipIcon} />
        <View className={styles.header}>
          <Text className={styles.title}>{Strings.getLang('ai_vip')}</Text>
          <Icon type="icon-right" size={16} color="#fff" />
        </View>
        <View className={styles.dateContainer}>
          <Text className={styles.dateText}>{`${offlineLeftTimeText}`}</Text>
        </View>
        {/* 产品确认: 设置页账号信息展示 [文字]离线剩余|在线剩余，[进度]显示剩余离线转写时长 */}
        {/* <View className={styles.barContainer}>
          <View
            className={styles.barValue}
            style={{ width: `${(AI_WEARABLE_BT?.accountData?.remainingTimePercent || 0) * 100}%` }}
          />
        </View> */}
      </View>
      <ActionRow
        img={Res.imgRecords}
        imgStyle={iconImgStyle}
        label={Strings.getLang('title_transcription_records')}
        actionType="arrow"
        onClick={() => {
          router.push('/records');
        }}
      />
      {/* 只有专业版支持，入门版和卡片不支持 */}
      {supportEarControl && (
        <ActionRow
          img={Res.imgGear}
          imgStyle={iconImgStyle}
          label={Strings.getLang('earphone_control')}
          actionType="arrow"
          onClick={() => {
            openPanel({
              deviceId: devInfo.devId,
              extraInfo: {
                productId: devInfo.productId,
                productVersion: devInfo.pv,
                i18nTime: devInfo.i18nTime,
                bizClientId: '00000195zh',
                uiType: 'RN',
              },
            });
          }}
        />
      )}
    </View>
  );
};

export default React.memo(Setting);
