import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import { View, Text, Image, Button } from '@ray-js/components';
import Strings from '@/i18n';
import { Loading } from '@ray-js/smart-ui/es/loading';
import Res from '@/res';
import dayjs from 'dayjs';
import { convertMillisecondsToTime } from '@/utils';
import CircleProgress from '@/components/CircleProgress';
// import { loadOfflineFile } from '@/api/ttt';
import { showModal, showToast } from '@ray-js/ray';
import DownloadProgress from '@/components/Progress';
import { CHANNEL_TYPES, STATUS_TYPES } from '@/constant';
import { useSelector } from 'react-redux';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { debounce } from 'lodash-es';
// import { getDeviceOfflineAudioStatus } from '../../offlineFilesMock';

// @ts-ignore
import styles from './index.module.less';

interface ProgressConfigType {
  theme: 'blue' | 'orange';
  uploadIcon: string;
}

const blueColor = 'blue';
const accelerateColor = 'orange';

const Index = ({
  deviceId,
  setHasOfflineFiles,
  offlineData,
  isStop,
  channel,
  status,
  offLineFiles,
  setChannel,
  setIsStop,
}) => {
  const platform = useSelector(selectSystemInfoByKey('platform'));
  /**
   * total 待下载的文件数量
   * */
  const total = useMemo(() => {
    const res = offlineData?.response;
    if (res) {
      const total = res?.total;
      setHasOfflineFiles(!!total); // 是否有离线文件待下载
      return total;
    }
    return null;
  }, [offlineData]);

  // wifi 快传
  const onAccelerate = () => {
    if (offLineFiles.length === 0) {
      showToast({ title: Strings.getLang('async_done_no_accelerate'), icon: 'none' });
      return;
    }
    ty.showLoading({ title: Strings.getLang('to_accelerate_ing') });
    // ios不需要授权
    if (platform === 'ios') {
      // loadOfflineFile({
      //   deviceId,
      //   sessionId: offlineData.sessionId,
      //   channel: CHANNEL_TYPES.wifi, // 2 代表wifi通道快传
      // }).catch(e => {
      //   console.log('accelerate faile: ', e);
      //   ty.hideLoading();
      // });
      return;
    }
    ty.authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        // loadOfflineFile({
        //   deviceId,
        //   sessionId: offlineData.sessionId,
        //   channel: CHANNEL_TYPES.wifi, // 2 代表wifi通道快传
        // }).catch(e => {
        //   console.log('accelerate faile: ', e);
        //   ty.hideLoading();
        // });
      },
    });
  };

  const progressConfig: ProgressConfigType = useMemo(() => {
    console.log('channel:::', channel);
    return channel === CHANNEL_TYPES.wifi
      ? {
        theme: accelerateColor,
        uploadIcon: Res.accelerateBlackIcon,
      }
      : {
        theme: blueColor,
        uploadIcon: Res.uploadBlackIcon,
      };
  }, [channel]);

  const stopDownload = useCallback(() => {
    if (offLineFiles.length === 0) {
      showToast({ title: Strings.getLang('async_done'), icon: 'none' });
      return;
    }
    showModal({
      title: Strings.getLang('transfer_start_recordTime_warn_title'),
      content: Strings.getLang('confirm_stop'),
      showCancel: true,
      cancelText: Strings.getLang('cancel'),
      cancelColor: '#66666',
      confirmText: Strings.getLang('confirm'),
      confirmColor: '#3678E3',
      success: async ({ confirm }) => {
        try {
          if (confirm) {
            // const res = await loadOfflineFile({
            //   deviceId,
            //   sessionId: offlineData?.sessionId,
            //   channel: CHANNEL_TYPES.none,
            // });
            // if (res?.status === STATUS_TYPES.end) {
            //   setChannel(CHANNEL_TYPES.none);
            //   setIsStop(true);
            // }
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  }, [offLineFiles, deviceId, offlineData, setChannel, setIsStop]);
  const debounceStopDownloadRef = useRef(debounce(stopDownload, 500));
  // 依赖变化时，更新防抖函数
  useEffect(() => {
    debounceStopDownloadRef.current = debounce(stopDownload, 500);
    return () => {
      debounceStopDownloadRef.current.cancel();
    };
  }, [stopDownload]);
  const renderFileItem = (item, n, statusText?, type?) => (
    <View className={styles.container} key={`${item.fileId}-${n + 1}`}>
      <Text className={styles.name}>{item.fileName}</Text>
      <View className={styles.timeBox}>
        <View className={styles.timeBoxLeft}>
          <Image src={Res.imgDate} className={styles.dateIcon} />
          <Text className={styles.date}>
            {dayjs(item.timeStamp * 1000).format('YYYY/MM/DD HH:mm')}
          </Text>
          <Image src={Res.imgClock} className={styles.clockIcon} />
          <Text className={styles.time}>{convertMillisecondsToTime(item.fileDuring)}</Text>
        </View>
        <View className={styles.timeBoxRight}>
          {statusText ? (
            <Text className={`${type === 'error' ? styles.errorInfo : ''}`}>{statusText}</Text>
          ) : item.progress === 0 ? (
            <View className={styles.loadingBox}>
              <Loading type="spinner" size="28" />
            </View>
          ) : (
            <View className={styles.progressBox}>
              <CircleProgress progress={item.progress} radius={8} strokeWidth={3} />
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const getDoms = () => {
    return (
      <>
        {offLineFiles?.map((item, n) => renderFileItem(item, n))}
        {offlineData?.response.files_transform?.map((item, n) =>
          renderFileItem(item, n, Strings.getLang('transforming'))
        )}
        {offlineData?.response.files_failed?.map((item, n) =>
          renderFileItem(item, n, Strings.getLang('async_failed'), 'error')
        )}
      </>
    );
  };

  return (
    !!total &&
    !isStop &&
    status === 1 && (
      <View>
        <View className={styles.container}>
          {status === STATUS_TYPES.start && (
            <View className={styles.syncing}>
              {/* <Progress
                className={styles.progress}
                activeColor={progressConfig.themeColor}
                percent={70}
                strokeWidth={24}
                borderRadius={16}
              /> */}
              <DownloadProgress
                theme={progressConfig.theme}
                progress={(offlineData?.response?.size / total) * 100}
              />
              <View className={styles.progressLeft}>
                <Image className={styles.icon} src={progressConfig.uploadIcon} />
                <Text>{`${offlineData?.response?.size}/${total}`}</Text>
              </View>
              <Text className={styles.progressRight}>{`${(
                offlineData?.response?.speed || 0
              ).toFixed(2)}KB/s`}</Text>
              <View className={styles.btnBox}>
                <Button
                  className={`${styles.stopBtn} ${channel === 2 ? styles.wP100 : ''}`}
                  onClick={debounceStopDownloadRef.current}
                >
                  <Image className={styles.icon} src={Res.stopBlackIcon} />
                  <Text>{Strings.getLang('sync_stop')}</Text>
                </Button>
                {/* {channel !== CHANNEL_TYPES.wifi && (
                  <Button className={styles.accelerateBtn} onClick={onAccelerate}>
                    <Image className={styles.icon} src={Res.accelerateIcon} />
                    <Text>{Strings.getLang('sync_accelerate')}</Text>
                  </Button>
                )} */}
              </View>
              <Text className={styles.uploadTip}>{Strings.getLang('sync_desc')}</Text>
            </View>
          )}
        </View>
        {status !== STATUS_TYPES.beforeStart ? <>{getDoms()}</> : <></>}
      </View>
    )
  );
};

export default Index;
