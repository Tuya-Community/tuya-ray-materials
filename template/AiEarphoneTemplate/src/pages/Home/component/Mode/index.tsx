import React, { FC, useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, PageContainer, Button } from '@ray-js/components';
import Res from '@/res';
import { router, usePageEvent, setStorageSync, getStorageSync } from '@ray-js/ray';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { tttRecordTask } from '@/api/ttt';
import {
  updateAudioFile,
  RecordType,
  TransferType,
  selectAudioFileByKey,
  RecordStatus,
  updateRecordTransferResultList,
} from '@/redux/modules/audioFileSlice';
import { useSelector, useDispatch } from 'react-redux';
import Radio from '@/components/Radio';
import { selectDpStateByCode } from '@/redux/modules/dpStateSlice';
import Strings from '@/i18n';
import clsx from 'clsx';
import GuideContent, { defaultConfigs } from '@/components/SwiperContent';
import Power from '@/components/Power';
// @ts-ignore
import styles from './index.module.less';

const History: FC = () => {
  const dispatch = useDispatch();
  const currTab = useSelector(selectUiStateByKey('currTab'));
  const [noReminds, setCatchNoReminds] = useState<string[]>([]); // 缓存不再提醒的功能点
  const [showGuide, setShowGuide] = useState(false); // 是否显示引导
  const [guideData, setGuideData] = useState({}); // 引导数据
  const [noRemind, setNoRemind] = useState(false); // 不再提示
  const { screenHeight, safeBottomHeight, statusBarHeight, topBarHeight } =
    useSelector(selectSystemInfo);
  const bluetoothState = useSelector(selectDpStateByCode('bluetooth_state'));
  const devInfo = useSelector(selectDevInfo);
  const { devId: deviceId, isOnline, name } = devInfo;
  const task = useSelector(selectAudioFileByKey('task'));
  const [showBluetoothTipPopup, setShowBluetoothTipPopup] = useState(false);
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  // 是否离线可用
  const offlineUsage = useSelector(selectUiStateByKey('offlineUsage'));
  const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion'));
  // mode的功能点配置
  const modeConfigList = useSelector(selectUiStateByKey('modeConfigList'));
  // 卡片设备仅有电话和会议模式
  const isCardStyle = productStyle === 'card';

  const [showBluetoothDisconnect, setShowBluetoothDisconnect] = useState(false);
  useEffect(() => {
    if (isBtEntryVersion) {
      setShowBluetoothDisconnect(!isOnline);
      return;
    }
    setShowBluetoothDisconnect(bluetoothState === 'disconnect');
  }, [bluetoothState, isBtEntryVersion, showBluetoothDisconnect]);

  const handleGoToRecording = async (newTaskCb: any) => {
    // if (!isOnline) return;
    try {
      const d: any = await tttRecordTask(deviceId);
      // task有值则表示当前存在录音任务，跳转至对应录音模式
      if (d?.task) {
        dispatch(updateAudioFile({ task: d.task }));
        const { transferType, recordType } = d.task;
        if (recordType === RecordType.SIMULTANEOUS) {
          router.push(`/simultaneousRecording`);
        } else if (transferType === TransferType.FILE) {
          router.push(`/recording?recordType=${recordType}`);
        } else if (transferType === TransferType.REALTIME) {
          router.push(`/realTimeRecording?recordType=${recordType}`);
        }
      } else {
        dispatch(updateAudioFile({ task: null }));
        newTaskCb();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disableNewTask =
    !isOnline ||
    (task && task?.state !== RecordStatus.FINISH && task?.state !== RecordStatus.UNKNOWN);

  const handleGoToMeetingMode = () => {
    if (disableNewTask) return;
    const item = defaultConfigs.find(item => item.key === 'meeting');
    const path = `/recording?recordType=${RecordType.MEETING}`;
    if (noReminds.includes('meeting') || isCardStyle) {
      handleGoToRecording(() => router.push(path));
      return;
    }
    setGuideData({ ...item, router: path });
    setShowGuide(true);
  };
  const handleGoToCallMode = () => {
    if (disableNewTask) return;
    if (bluetoothState === 'disconnect' && !isCardStyle && !isBtEntryVersion) {
      router.push(`/btOffline`);
      return;
    }

    const item = defaultConfigs.find(item => item.key === 'call');
    const path = `/recording?recordType=${RecordType.CALL}`;
    if (noReminds.includes('call') || isCardStyle) {
      handleGoToRecording(() => router.push(path));
      return;
    }
    setGuideData({ ...item, router: path });
    setShowGuide(true);
  };
  const handleGoToRealTimeMode = () => {
    if (disableNewTask) return;
    const item = defaultConfigs.find(item => item.key === 'realtime');
    const path = `/realTimeRecording?recordType=${RecordType.MEETING}`;
    if (noReminds.includes('realtime') || isCardStyle) {
      handleGoToRecording(() => router.push(path));
      return;
    }
    setGuideData({ ...item, router: path });
    setShowGuide(true);
  };
  const handleSimultaneousRecording = () => {
    if (disableNewTask) return;
    const item = defaultConfigs.find(item => item.key === 'simultaneous');
    const path = '/simultaneousRecording';
    if (noReminds.includes('simultaneous') || isCardStyle) {
      handleGoToRecording(() => router.push(path));
      return;
    }
    setGuideData({ ...item, router: path });
    setShowGuide(true);
  };

  const handleFaceToFace = () => {
    if (disableNewTask) return;
    const item = defaultConfigs.find(item => item.key === 'faceToFace');
    const path = '/faceToFace';
    if (noReminds.includes('faceToFace') || isCardStyle) {
      handleGoToRecording(() => router.push(path));
      return;
    }
    setGuideData({ ...item, router: '/faceToFace' });
    setShowGuide(true);
  };

  usePageEvent('onShow', async () => {
    // const d: any = await tttRecordTask(deviceId);
    dispatch(updateRecordTransferResultList());
    const noRemindsStorage = getStorageSync({
      key: 'noRemind',
    });

    const noReminds = noRemindsStorage ? JSON.parse(noRemindsStorage) : [];
    setCatchNoReminds(noReminds);
    // console.log('mode onShow task info:', d);
    // dispatch(updateAudioFile({ task: d?.task || null }));
  });

  useEffect(() => {
    const noRemindsStorage = getStorageSync({
      key: 'noRemind',
    });

    const noReminds = noRemindsStorage ? JSON.parse(noRemindsStorage) : [];
    setCatchNoReminds(noReminds);
  }, [currTab]);

  const toggleIsShow = () => {
    setShowGuide(!showGuide);
  };

  const toGuide = () => {
    router.push('/howToUse');
  };

  const handleStart = () => {
    guideData?.router &&
      handleGoToRecording(() => {
        // 不再提醒
        const noRemindStorage = getStorageSync({
          key: 'noRemind',
        });
        const nodeRemidsCatch = noRemindStorage ? JSON.parse(noRemindStorage) : [];
        console.log('noRemindStorage', noRemindStorage, nodeRemidsCatch);
        if (noRemind) {
          nodeRemidsCatch.push(guideData.key);
          const data = JSON.stringify(nodeRemidsCatch);
          console.log('setStorageSync noRemind', data);
          setStorageSync({ key: 'noRemind', data });
        }
        setShowGuide(false);
        setNoRemind(false);
        router.push(guideData?.router);
      });
  };

  // 此处样式结构修改之后，还是在原先逻辑上堆砌img，通过样式类型判断显隐。后续有时间可以修改
  const items = {
    meeting: (
      <View
        className={styles.rowContent}
        onClick={handleGoToMeetingMode}
        style={
          {
            // backgroundImage: `url(${Res.modeOne})`
          }
        }
      >
        <Image src={Res.modeLiveIcon} className={styles.icon} />
        <Image src={Res.modeLIveBlueIcon} className={styles.blueIcon} />
        <View className={styles.modeTextBox}>
          <Text className={styles.modeTitle}>
            {Strings.getLang('mode_title_meeting_recording')}
          </Text>
          <Text className={styles.modeDesc}>{Strings.getLang('mode_desc_meeting_recording')}</Text>
        </View>
        <Image src={Res.modeLiveIcon} className={styles.thirdIcon} />
      </View>
    ),
    call: (
      <View
        className={styles.rowContent}
        onClick={handleGoToCallMode}
        style={
          {
            // backgroundImage: `url(${Res.modeTwo})`
          }
        }
      >
        <Image src={Res.modeLiveIcon} className={styles.icon} />
        <Image src={Res.modeLIveBlueIcon} className={styles.blueIcon} />
        <View className={styles.modeTextBox}>
          <Text className={styles.modeTitle}>{Strings.getLang('mode_title_call_recording')}</Text>
          <Text className={styles.modeDesc}>{Strings.getLang('mode_desc_call_recording')}</Text>
        </View>
        <Image src={Res.modeLiveIcon} className={styles.thirdIcon} />
      </View>
    ),
    realtime: !isCardStyle ? (
      <View
        className={styles.rowContent}
        onClick={handleGoToRealTimeMode}
        style={
          {
            // backgroundImage: `url(${Res.modeTwo})`
          }
        }
      >
        <Image src={Res.modeRealIcon} className={styles.icon} />
        <Image src={Res.modeRealBlueIcon} className={styles.blueIcon} />
        <View className={styles.modeTextBox}>
          <Text className={styles.modeTitle}>
            {Strings.getLang('mode_title_realtime_recording')}
          </Text>
          <Text className={styles.modeDesc}>{Strings.getLang('mode_desc_realtime_recording')}</Text>
        </View>
        <Image src={Res.modeRealIcon} className={styles.thirdIcon} />
      </View>
    ) : null,
    simultaneous: !isCardStyle ? (
      <View
        className={styles.rowContent}
        onClick={handleSimultaneousRecording}
        style={
          {
            // backgroundImage: `url(${Res.modeThree})`
          }
        }
      >
        <Image src={Res.modeFaceIcom} className={styles.icon} style={{ marginRight: '16px' }} />
        <Image src={Res.modeFaceBlueIcon} className={styles.blueIcon} />
        <View className={styles.modeTextBox}>
          <Text className={styles.modeTitle}>
            {Strings.getLang('mode_title_simultaneous_recording')}
          </Text>
          <Text className={styles.modeDesc}>
            {Strings.getLang('mode_desc_simultaneous_recording')}
          </Text>
        </View>
        <Image src={Res.modeFaceIcom} className={styles.thirdIcon} />
      </View>
    ) : null,
    faceToFace:
      isBtEntryVersion || isCardStyle ? (
        <View
          className={styles.rowContent}
          onClick={handleFaceToFace}
          style={
            {
              // backgroundImage: `url(${Res.modeThree})`
            }
          }
        >
          <Image src={Res.modeFaceIcom} className={styles.icon} style={{ marginRight: '16px' }} />
          <Image src={Res.modeFaceBlueIcon} className={styles.blueIcon} />
          <View className={styles.modeTextBox}>
            <Text className={styles.modeTitle}>
              {Strings.getLang('mode_title_faceToFace_recording')}
            </Text>
            <Text className={styles.modeDesc}>
              {Strings.getLang('mode_desc_faceToFace_recording')}
            </Text>
          </View>
          <Image src={Res.modeFaceIcom} className={styles.thirdIcon} />
        </View>
      ) : null,
  };

  const getModes = useCallback(() => {
    let realConfigTabs = modeConfigList;
    if (isCardStyle) {
      realConfigTabs = modeConfigList.filter(
        item => item !== 'realtime' && item !== 'simultaneous'
      );
    }

    const doms = realConfigTabs?.map(item => {
      return {
        dom: items[item],
        key: item,
      };
    });
    if (realConfigTabs.length > 3) {
      // 尾部的元素,前面的3个元素样式排布需要特殊处理
      const wbDoms = doms
        .filter((obj, n) => n > 2 && obj.dom)
        .map((item, n) => {
          const modeImag = n === 0 ? Res.modeOne : n === 1 ? Res.modeTwo : Res.modeThree;
          return (
            <View
              className={`${styles.row} ${styles.blueRow}`}
              key={item.key}
              style={{
                opacity: disableNewTask ? 0.4 : 1,
                backgroundImage: `url(${modeImag})`,
                backgroundSize: 'cover',
                borderRadius: '16px',
              }}
            >
              {item.dom}
            </View>
          );
        });
      return (
        <>
          <View className={styles.firstRow} style={{ opacity: disableNewTask ? 0.4 : 1 }}>
            <View
              className={`${styles.column} ${styles.firstColumn}`}
              style={{
                backgroundImage: `url(${Res.mode1})`,
                backgroundSize: 'cover',
              }}
            >
              {/* 会议转写 */}
              {doms[0]?.dom}
            </View>
            <View className={styles.columnGap} />
            <View className={styles.column}>
              {/* 电话转写 */}
              <View
                className={styles.columnCld1}
                style={{
                  backgroundImage: `url(${Res.mode2})`,
                  backgroundSize: 'cover',
                }}
              >
                {doms[1]?.dom}
              </View>
              <View className={styles.rowGap} />
              {/* 实时转写 */}
              <View
                className={styles.columnCld2}
                style={{
                  backgroundImage: `url(${Res.mode3})`,
                  backgroundSize: 'cover',
                }}
              >
                {doms[2]?.dom}
              </View>
            </View>
          </View>
          {wbDoms}
        </>
      );
    }

    return doms.map((item, n) => {
      const modeImag = n === 0 ? Res.modeOne : n === 1 ? Res.modeTwo : Res.modeThree;
      return (
        <View
          className={styles.threeRowBox}
          key={item.key}
          style={{ opacity: disableNewTask ? 0.4 : 1, backgroundImage: `url(${modeImag})` }}
        >
          {item.dom}
        </View>
      );
    });
  }, [modeConfigList, disableNewTask, isCardStyle, bluetoothState, noReminds]);

  return (
    <View className={styles.container}>
      <View className={styles.content}>
        {!isOnline && (
          <View className={styles.offlineMarkBox}>
            <View className={styles.offlineMark}>
              <View className={styles.grayDot} />
              <Text className={styles.offlineText}>{Strings.getLang('offline_tip')}</Text>
            </View>
          </View>
        )}
        <Text className={styles.name}>{name}</Text>
        <View className={styles.powBox}>
          <Power />
        </View>
        <ScrollView
          className={styles.modeItemBox}
          scrollY
          style={{
            height: `${screenHeight - topBarHeight - safeBottomHeight - 160}px`,
          }}
        >
          {getModes()}
          {!isCardStyle && (
            <View className={styles.guide} onClick={toGuide}>
              <Image src={Res.helpIcon} className={styles.guideImg} />
              <Text>{Strings.getLang('useHelp')}</Text>
            </View>
          )}
        </ScrollView>

        {isOnline &&
          task &&
          task?.state !== RecordStatus.FINISH &&
          task?.state !== RecordStatus.UNKNOWN && (
            <View className={styles.recordBtnBox}>
              <View
                onClick={handleGoToRecording}
                className={clsx(styles.recordBtn, styles.recording)}
              >
                <Image src={Res.imgRecordStart} className={styles.btnIcon} />
                <Text className={styles.btnText}>{Strings.getLang('control_recording')}</Text>
              </View>
            </View>
          )}
      </View>
      {/* 蓝牙未连接提示 */}
      {/* <TyNotification
        hideCloseBtn
        show={showBluetoothDisconnect}
        onClosed={() => setShowBluetoothDisconnect(false)}
        text={Strings.getLang('bluetooth_disconnect')}
        renderCustomIcon={() => <Image src={Res.imgBluetooth} className={styles.bluetoothIcon} />}
        onClick={() => {
          setShowBluetoothTipPopup(true);
        }}
      />
      <BluetoothTipPopup
        show={showBluetoothTipPopup}
        onCancel={() => {
          setShowBluetoothTipPopup(false);
        }}
        onConfirm={() => {
          setShowBluetoothTipPopup(false);
          ty.openAppSystemSettingPage({
            scope: 'Settings',
          });
        }}
      /> */}
      <PageContainer
        customStyle={{
          height: '1200rpx',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0px -3px 15px 0px rgba(0, 0, 0, 0.05)',
        }}
        position="bottom"
        show={showGuide}
        onClickOverlay={toggleIsShow}
      >
        <View className={styles.guideBox}>
          <GuideContent {...guideData} />
          <View className={styles.bottomBox}>
            <Radio
              checked={noRemind}
              setChecked={setNoRemind}
              text={Strings.getLang('not_remind_again')}
            />
            <Button className={styles.btnStart} type="primary" onClick={handleStart}>
              {Strings.getLang('start_use')}
            </Button>
          </View>
        </View>
      </PageContainer>
    </View>
  );
};

export default React.memo(History);
