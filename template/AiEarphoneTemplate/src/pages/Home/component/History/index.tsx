import React, { FC, useMemo, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from '@ray-js/components';
import { Icon } from '@ray-js/icons';
import Res from '@/res';
import { router, showModal, showToast } from '@ray-js/ray';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { selectUiStateByKey, updateUiState } from '@/redux/modules/uiStateSlice';
import {
  updateAudioFile,
  selectAudioFile,
  RecordType,
  TransferType,
  selectAudioFileByKey,
  RecordStatus,
} from '@/redux/modules/audioFileSlice';
import { useSelector, useDispatch } from 'react-redux';
import { checkDpExist, convertMillisecondsToTime } from '@/utils';
import {
  tttGetFilesList,
  tttRecordTask,
  tttRemoveFiles,
  tttUpdateFile,
  // loadOfflineFile,
  // getDeviceOfflineAudioStatus,
} from '@/api/ttt';
import TyNotification from '@/components/TyNotification';
import { selectDpStateByCode } from '@/redux/modules/dpStateSlice';
import { selectfileSync, updateFileSync } from '@/redux/modules/fileSyncSlice';
import Strings from '@/i18n';
import { bluetoothStateCode, aiModeCode } from '@/config/dpCodes';
import dayjs from 'dayjs';
import clsx from 'clsx';
import store from '@/redux';
import Power from '@/components/Power';
import { CHANNEL_TYPES, STATUS_TYPES } from '@/constant';
import BeforeSync from './component/Sync/beforeSync';
// @ts-ignore
import styles from './index.module.less';

import NameEditPopup from './component/NameEditPopup';
import BluetoothTipPopup from './component/BluetoothTipPopup';
import SyncComponent from './component/Sync';
// import { offlineDatas } from './offlineFilesMock';

// import mockData from './mockData';

const getCheckedFiles = (selectedRecordTransferIds, recordTransferId) => {
  const isHas = selectedRecordTransferIds?.includes(recordTransferId);
  const newSelectedRecordTransferIds = isHas
    ? selectedRecordTransferIds.filter(id => id !== recordTransferId)
    : [...selectedRecordTransferIds, recordTransferId];

  return newSelectedRecordTransferIds;
};

const History: FC = () => {
  const dispatch = useDispatch();
  const { screenHeight, safeBottomHeight, topBarHeight, language } = useSelector(selectSystemInfo);
  const bluetoothState = useSelector(selectDpStateByCode(bluetoothStateCode));
  const isSyncing = useSelector(selectfileSync);

  const isEditMode = useSelector(selectUiStateByKey('isEditMode'));
  const { devId: deviceId, isOnline } = useSelector(selectDevInfo);
  const task = useSelector(selectAudioFileByKey('task'));
  const { fileList } = useSelector(selectAudioFile);

  const [showBluetoothTipPopup, setShowBluetoothTipPopup] = useState(false);
  const [currSelectedRecordTransferIds, setCurrSelectedRecordTransferIds] = useState<number[]>([]);
  const [showBluetoothDisconnect, setShowBluetoothDisconnect] = useState(false);
  const checkBluetoothStateCodeExist = checkDpExist(bluetoothStateCode);
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion'));
  const isCardStyle = productStyle === 'card';
  const aiModeDp = useSelector(selectDpStateByCode(aiModeCode as never));
  const [hasOfflineFiles, setHasOfflineFiles] = useState(true);

  const [offlineData, setOfflineData] = useState(null);
  const [isStop, setIsStop] = useState(false);
  // 0: 未选择通道 1: 蓝牙通道 2: wifi通道
  const [channel, setChannel] = useState(CHANNEL_TYPES.none);
  // 0: 未开始 1: 开始 2: 结束
  const [status, setStatus] = useState(STATUS_TYPES.beforeStart);
  const [offLineFiles, setOfflineFiles] = useState([]);

  useEffect(() => {
    if (!checkBluetoothStateCodeExist || isBtEntryVersion) return;
    setShowBluetoothDisconnect(bluetoothState === 'disconnect');
  }, [bluetoothState]);

  useEffect(() => {
    if (isCardStyle && !isOnline) {
      setShowBluetoothDisconnect(true);
    }
  }, []);

  const handleClickItem = (recordTransferId: number) => {
    if (isSyncing) {
      showToast({ title: Strings.getLang('hint_content'), icon: 'none' });
      return;
    }
    if (isEditMode) {
      setCurrSelectedRecordTransferIds(
        getCheckedFiles(currSelectedRecordTransferIds, recordTransferId)
      );
    } else {
      router.push(`/detail?recordTransferId=${recordTransferId}`);
    }
  };

  // 长按编辑
  const handleLongClick = () => {
    // 正在同步中不可编辑
    if (isSyncing) {
      return;
    }
    dispatch(updateUiState({ isEditMode: true }));
    // setCurrSelectedRecordTransferIds(
    //   getCheckedFiles(currSelectedRecordTransferIds, recordTransferId)
    // );
  };

  const handleCancelEdit = () => {
    dispatch(updateUiState({ isEditMode: false }));
  };

  // 删除录音文件
  const handleDeleteFile = () => {
    if (!currSelectedRecordTransferIds?.length) return;
    showModal({
      title: Strings.getLang('dialog_delete_title'),
      content: Strings.getLang('dialog_delete_content'),
      showCancel: true,
      cancelText: Strings.getLang('cancel'),
      cancelColor: '#666666',
      confirmText: Strings.getLang('confirm'),
      confirmColor: '#3678E3',
      success: async ({ confirm }) => {
        try {
          if (confirm) {
            await tttRemoveFiles({ fileIds: currSelectedRecordTransferIds });
            const d: any = await tttGetFilesList({});
            dispatch(updateAudioFile({ fileList: d }));
            setCurrSelectedRecordTransferIds([]);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const [showNameEditPopup, setShowNameEditPopup] = useState(false);
  const [currRecordFileName, setCurrRecordFileName] = useState('');
  const handleEditName = () => {
    // 此处如果多选了，则需要置灰编辑按钮
    if (currSelectedRecordTransferIds.length > 1) {
      return;
    }
    const currRecordFile = fileList?.find(
      item => item.recordTransferId === currSelectedRecordTransferIds[0]
    );
    if (currRecordFile) {
      setCurrRecordFileName(currRecordFile?.name || '');
      setShowNameEditPopup(true);
    }
  };

  const handleNameEditClose = () => {
    setShowNameEditPopup(false);
    setCurrRecordFileName('');
  };

  // 编辑录音文件名称
  const handleNameEditConfirm = async (text: string) => {
    // 判断名称是否为空
    if (!text || /^\s*$/.test(text)) {
      showToast({ title: Strings.getLang('name_not_empty'), icon: 'none' });
      return;
    }
    try {
      // 只支持一个编辑，且多选的时候会置灰编辑按钮
      await tttUpdateFile({ recordTransferId: currSelectedRecordTransferIds?.[0], name: text });
      const d: any = await tttGetFilesList({});
      dispatch(updateAudioFile({ fileList: d }));
      handleNameEditClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToRecording = async () => {
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
        } else {
          dispatch(updateAudioFile({ task: null }));
        }
      } else {
        dispatch(updateAudioFile({ task: null }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToRecordingCardDevice = async () => {
    if (!isOnline || !checkDpExist(aiModeCode)) return;
    try {
      const d: any = await tttRecordTask(deviceId);
      // task有值则表示当前存在录音任务，跳转至对应录音模式
      if (d?.task) {
        dispatch(updateAudioFile({ task: d.task }));
        const { recordType } = d.task;
        router.push(`/recording?recordType=${recordType}`);
      } else {
        dispatch(updateAudioFile({ task: null }));
        // 卡片设备录音模式依赖设备上报，直接跳转无需选择
        router.push(
          `/recording?recordType=${aiModeDp === 'meeting' ? RecordType.MEETING : RecordType.CALL}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 获取离线文件数据
  // const getOfflineData = async () => {
  //   const res = await getDeviceOfflineAudioStatus(deviceId);
  //   successCallBack(res);
  // };

  // 获取离线文件l列表数据的回调
  // const successCallBack = async data => {
  //   console.log('data=======>', JSON.stringify(data));
  //   const { response } = data;
  //   setOfflineData(data);
  //   setStatus(data.status);
  //   setChannel(response.channel);
  //   setOfflineFiles(response.files_waiting);
  //   // 是否下载中
  //   store.dispatch(updateFileSync({ isSyncing: data.status === STATUS_TYPES.start }));
  //   // 是否有待下载的文件
  //   if (response.total && data.status === STATUS_TYPES.start) {
  //     setHasOfflineFiles(true);
  //     // 发起下载任务
  //     await loadOfflineFile({
  //       deviceId,
  //       sessionId: data.sessionId,
  //       channel: data.response.channel,
  //     });
  //     // onOfflineFilesProgressEvent(onOfflineFileDataChange);
  //   }
  // };

  /**
   * 离线文件数据变化时的回调
   */
  const onOfflineFileDataChange = async data => {
    console.log('===onOfflineFileDataChange===', data);
    const { response } = data;

    // wifi 通道 || 已结束,隐藏切wifi时的loading
    if (response.channel === CHANNEL_TYPES.wifi || data.status === STATUS_TYPES.end) {
      ty.hideLoading();
    }

    setOfflineData(data);

    setStatus(data.status);
    setChannel(response.channel);
    setOfflineFiles(response.files_waiting);

    // 是否下载中
    store.dispatch(updateFileSync({ isSyncing: data.status === STATUS_TYPES.start }));
  };

  // 开始同步，默认这里发起的都是 蓝牙通道
  const startSync = () => {
    setChannel(CHANNEL_TYPES.bluetooth);
    setHasOfflineFiles(true);
    // 发起下载任务
    // loadOfflineFile({
    //   deviceId,
    //   sessionId: offlineData.sessionId,
    //   channel: CHANNEL_TYPES.bluetooth, // 1 代表蓝牙通道
    // });
  };

  const refreshList = async () => {
    console.log('start to tttGetFilesList ******');
    const d: any = await tttGetFilesList({});
    console.log('tttGetFilesList ******', d);
    dispatch(updateAudioFile({ fileList: d }));
  };

  // useEffect(() => {
  //   if (isCardStyle && isOnline) {
  //     getOfflineData();
  //     // 录音状态变更事件
  //     ty.wear.onOfflineFilesProgressEvent(onOfflineFileDataChange);
  //   }
  // }, [isOnline, isCardStyle]);

  useEffect(() => {
    offlineData?.response?.size && refreshList();
  }, [offlineData?.response?.size]);

  useEffect(() => {
    console.log('current tast ******:', task);
  }, [task]);

  const renderRecordingBtn = () => {
    // 卡片设备交互形态和耳机设备不同
    if (isCardStyle) {
      // 卡片设备跳转录音按钮常显示，且展示对应录音状态，录音模式会议/电话由设备上报，无选择交互
      return !isEditMode && !isSyncing ? (
        <View className={styles.recordBtnBox}>
          <View
            onClick={handleGoToRecordingCardDevice}
            className={
              isOnline
                ? task && task?.state !== RecordStatus.FINISH
                  ? clsx(styles.recordBtn, styles.recording)
                  : styles.recordBtn
                : clsx(styles.recordBtn, styles.offlineBtn)
            }
          >
            <Image src={Res.imgRecordStart} className={styles.btnIcon} />
            <Text className={styles.btnText}>
              {task && task?.state !== RecordStatus.FINISH && task?.state !== RecordStatus.UNKNOWN
                ? Strings.getLang('control_recording')
                : Strings.getLang('control_start_recording')}
            </Text>
          </View>
        </View>
      ) : null;
    }
    // 耳机设备跳转录音仅在录音时（当前存在录音任务）显示
    return !isEditMode &&
      task &&
      task?.state !== RecordStatus.FINISH &&
      task?.state !== RecordStatus.UNKNOWN ? (
      <View className={styles.recordBtnBox}>
        <View onClick={handleGoToRecording} className={clsx(styles.recordBtn, styles.recording)}>
          <Image src={Res.imgRecordStart} className={styles.btnIcon} />
          <Text className={styles.btnText}>{Strings.getLang('control_recording')}</Text>
        </View>
      </View>
    ) : null;
  };

  const scrollContainHeight = useMemo(() => {
    let syncHeight = 0;
    if (status === STATUS_TYPES.beforeStart && offlineData?.response?.total) {
      syncHeight = language === 'zh' ? 100 : 116;
    }
    return `${screenHeight - topBarHeight - safeBottomHeight - 36 - 55 - (isOnline ? 0 : 38) - syncHeight
      }px`;
  }, [
    screenHeight,
    topBarHeight,
    safeBottomHeight,
    isOnline,
    status,
    offlineData?.response?.total,
  ]);

  const iconTypes = {
    [RecordType.CALL]: Res.imgCallMode,
    [RecordType.MEETING]: Res.imgMeetingMode,
    [RecordType.SIMULTANEOUS]: Res.imgSimultaneousMode,
    [RecordType.REAL]: Res.imgRealtimeMode,
  };

  // 根据录音类型获取对应的图标
  const getIcon = (recordType, transferType) => {
    if (recordType === 3) {
      return Res.faceToFaceIcon;
    }
    if (recordType === 1 && transferType === 1) {
      return Res.imgRealtimeMode;
    }
    if (recordType === 0 && transferType === 0) {
      return Res.imgCallMode;
    }
    if (recordType === 1 && transferType === 0) {
      return Res.imgMeetingMode;
    }
    return iconTypes[recordType];
  };

  return (
    <View className={styles.container}>
      <View className={styles.content}>
        {!isOnline && !isSyncing && (
          <View className={styles.offlineMarkBox}>
            <View className={styles.offlineMark}>
              <View className={styles.grayDot} />
              <Text className={styles.offlineText}>{Strings.getLang('offline_tip')}</Text>
            </View>
          </View>
        )}

        <View className={styles.mainHeader}>
          {!isEditMode ? (
            <>
              <Text className={styles.title}>{Strings.getLang('allFiles')}</Text>
              <Power />
            </>
          ) : (
            <>
              <Text className={styles.title}>{Strings.getLang('selectFile')}</Text>
              <Text className={styles.done} onClick={handleCancelEdit}>
                {Strings.getLang('done')}
              </Text>
            </>
          )}
        </View>
        {status === STATUS_TYPES.beforeStart && offlineData?.response?.total ? (
          <BeforeSync total={offlineData?.response?.total} startSync={startSync} />
        ) : (
          <></>
        )}

        {fileList?.length > 0 ? (
          <ScrollView
            className={styles.scroll}
            style={{
              height: scrollContainHeight,
              // backgroundColor: '#0f0',
            }}
            refresherTriggered={false}
            scrollY
          >
            <SyncComponent
              deviceId={deviceId}
              offlineData={offlineData}
              isStop={isStop}
              channel={channel}
              status={status}
              offLineFiles={offLineFiles}
              setHasOfflineFiles={setHasOfflineFiles}
              setChannel={setChannel}
              setIsStop={setIsStop}
            />
            {fileList.map(
              (
                {
                  deviceUniqueId,
                  duration,
                  name,
                  // status,
                  recordType,
                  recordTransferId,
                  transfer,
                  recordTime,
                  visit,
                  transferType,
                  recordId,
                },
                n
              ) => {
                const icon = getIcon(recordType, transferType);
                return (
                  <View
                    key={`${recordId}-${n + 1}`}
                    className={`${styles.item} ${!visit && !isEditMode ? styles.unVisitItem : ''} ${isEditMode ? styles.editItem : ''
                      }`}
                    onClick={() => handleClickItem(recordTransferId)}
                    onLongClick={() => handleLongClick()}
                  >
                    {isEditMode && (
                      <View className={styles.header}>
                        {currSelectedRecordTransferIds?.includes(recordTransferId) ? (
                          <View className={styles.checkbox}>
                            <Icon type="icon-checkmark" size={16} color="#ffffff" />
                          </View>
                        ) : (
                          <View className={styles.checkboxCircle} />
                        )}
                      </View>
                    )}

                    <View className={isEditMode ? styles.editContentBox : ''}>
                      <View className={styles.dotBox}>
                        {!visit && !isEditMode && <Text className={styles.dot} />}
                      </View>
                      <Text className={styles.name}>{name}</Text>
                      <View className={styles.timeBox}>
                        <View className={styles.timeBoxLeft}>
                          <Image src={Res.imgDate} className={styles.dateIcon} />
                          <Text className={styles.date}>
                            {dayjs(recordTime * 1000).format('YYYY/MM/DD HH:mm')}
                          </Text>
                          <Image src={Res.imgClock} className={styles.clockIcon} />
                          <Text className={styles.time}>{convertMillisecondsToTime(duration)}</Text>
                        </View>
                        <View className={styles.timeBoxRight}>
                          <Image src={icon} className={styles.icon} />
                          {/* <Text className={styles.transferStatus}>
  
                          {Strings.getLang(`transfer_status_${transfer}`)}
                        </Text> */}
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }
            )}
            <View style={{ height: '100px' }} />
          </ScrollView>
        ) : (
          <ScrollView
            className={styles.scroll}
            style={{
              height: scrollContainHeight,
            }}
            refresherTriggered={false}
            scrollY
          >
            <SyncComponent
              deviceId={deviceId}
              offlineData={offlineData}
              isStop={isStop}
              channel={channel}
              status={status}
              offLineFiles={offLineFiles}
              setHasOfflineFiles={setHasOfflineFiles}
              setChannel={setChannel}
              setIsStop={setIsStop}
            />
            <View
              className={styles.emptyBox}
              style={{ height: hasOfflineFiles ? '100%' : 'Initial' }}
            >
              <Image src={Res.imgPlaceholder} className={styles.emptyImg} />
              <Text className={styles.emptyText}>{Strings.getLang('noData')}</Text>
            </View>
          </ScrollView>
        )}
        {/* 跳转至录音页 */}
        {renderRecordingBtn()}
      </View>
      {/* 编辑操作底部栏 */}
      {isEditMode && (
        <View className={styles.editBar}>
          <View
            className={`${styles.item} ${currSelectedRecordTransferIds.length > 1 ? styles.disabled : ''
              }`}
            onClick={handleEditName}
          >
            <Image className={styles.icon} src={Res.imgEdit} />
            <Text className={styles.editText}>{Strings.getLang('edit_mode_rename')}</Text>
          </View>
          <View className={styles.item} onClick={handleDeleteFile}>
            <Image className={styles.icon} src={Res.imgTrash} />
            <Text className={styles.deleteText}>{Strings.getLang('edit_mode_delete')}</Text>
          </View>
        </View>
      )}
      {/* 编辑名称 */}
      <NameEditPopup
        initText={currRecordFileName}
        show={showNameEditPopup}
        onCancel={handleNameEditClose}
        onConfirm={handleNameEditConfirm}
      />
      {/* 蓝牙未连接提示, 如果是入门版，不用判断dp */}
      {/* {((checkBluetoothStateCodeExist && !isBtEntryVersion) || !isOnline) && !isSyncing && (
        <TyNotification
          hideCloseBtn
          show={showBluetoothDisconnect}
          onClosed={() => setShowBluetoothDisconnect(false)}
          text={Strings.getLang('bluetooth_disconnect')}
          renderCustomIcon={() => <Image src={Res.imgBluetooth} className={styles.bluetoothIcon} />}
          onClick={() => {
            setShowBluetoothTipPopup(true);
          }}
        />
      )}
      {((checkBluetoothStateCodeExist && !isBtEntryVersion) || !isOnline) && (
        <BluetoothTipPopup
          show={showBluetoothTipPopup}
          onCancel={() => {
            setShowBluetoothTipPopup(false);
          }}
          onConfirm={() => {
            setShowBluetoothTipPopup(false);
            ty.openSystemSettingPage({
              scope: 'Settings',
            });
          }}
        />
      )} */}
    </View>
  );
};

export default React.memo(History);
