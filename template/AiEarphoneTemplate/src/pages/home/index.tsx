import React, { FC, useEffect, useMemo } from 'react';
import {
  View,
  usePageEvent,
  getLaunchOptionsSync,
  setStorageSync,
  getStorageSync,
  router,
  Text,
  showMenuButton,
} from '@ray-js/ray';
import { useDispatch } from 'react-redux';
import { useRequest } from 'ahooks';

import { selectUiStateByKey, updateUiState } from '@/redux/modules/uiStateSlice';
import {
  RecordStatus,
  updateRecordTransferResultList,
  updateAudioFile,
  updateRecordTask,
} from '@/redux/modules/audioFileSlice';
import useRecordTypeChangeTip from '@/hooks/useRecordTypeChangeTip';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { tttGetCloudSyncStatus, tttSyncNoteRecord } from '@/api/ttt';
import Strings from '@/i18n';
import { updateMode, updateIsCall } from '@/redux/modules/recordConfigSlice';
import { CloudSyncStatus } from '@/constant/enums';
import { TopBar } from '@/components';
import { checkIsCall } from '@/utils';
import { useSelector } from '@/redux';
import { useEnsurePageReady } from '@/utils/pageReadyBus';
import { getCdnImageStyle } from '@/utils/cdnImageVars';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import { usePageReShow } from '@/hooks/usePageReShow';
import NewUserGuide from '@/components/NewUserGuide';
import History from './component/History';
import ControlBar from './component/ControlBar';
import Mine from './component/Mine';

// @ts-ignore
import styles from './index.module.less';

enum HomeTabType {
  History = 'history',
  Mine = 'mine',
}
const Home: FC = () => {
  const dispatch = useDispatch();
  // 获取启动参数
  const query = getLaunchOptionsSync()?.query || {};
  const modeKey = query?.modeKey?.split('?')?.[0];
  // @ts-ignore
  const { devId: deviceId = '' } = useSelector(selectDevInfo);
  const currTab = useSelector(selectUiStateByKey('currTab'));
  const isEditMode = useSelector(selectUiStateByKey('isEditMode'));
  const hasVisitHomeOrRecordingPage = useSelector(
    selectUiStateByKey('hasVisitHomeOrRecordingPage')
  );
  const hideSetting = useSelector(selectUiStateByKey('hideSetting'));
  const { menuBounding } = useSelector(state => state.systemInfo);
  const hasNewUserGuide = getStorageSync({ key: 'hasNewUserGuide' }) || null;

  useRecordTypeChangeTip();

  useAppFloatCtrl(false);

  const queryTab = useMemo(() => {
    if ([HomeTabType.History, HomeTabType.Mine].includes(query?.tab)) {
      return query?.tab;
    }
    return HomeTabType.History;
  }, [query?.tab]);

  // 获取云同步状态接口
  const { runAsync: runGetCloudSync } = useRequest(tttGetCloudSyncStatus, {
    manual: true,
  });

  // 同步 Note 记录
  const { runAsync: runSyncNoteRecord } = useRequest(tttSyncNoteRecord, {
    manual: true,
  });

  // 处理翻译小程序跳转过来的tab
  useEffect(() => {
    if (queryTab) {
      dispatch(updateUiState({ currTab: queryTab }));
    }
  }, [queryTab]);

  useEffect(() => {
    if (!hasVisitHomeOrRecordingPage) {
      dispatch(updateUiState({ hasVisitHomeOrRecordingPage: true }));
      if (modeKey) {
        dispatch(updateMode(modeKey));
        router.replace('/recordingMode');
      }
    }
  }, [modeKey, hasVisitHomeOrRecordingPage, dispatch]);

  // 修复翻译跳转到笔记时设备自动切换导致的问题
  // const initDeviceInfoFromTask = useMemo(
  //   () =>
  //     debounce((deviceId, task, devList) => {
  //       if (deviceId !== task?.devId) {
  //         dispatch(devInfoChange(formatDevSchema(devList.find(i => i.devId === task?.devId))));
  //       }
  //     }, 300),
  //   []
  // );

  // useEffect(() => {
  //   // 其他设备在录音中，但由于退出小程序默认设置的设备是卡片，这里进行一次纠错
  //   // 仅在首页可见时执行，避免录音页切换设备时被后台首页覆盖
  //   if (
  //     isShow &&
  //     devList.length &&
  //     (task?.state === RecordStatus.RECORDING || task?.state === RecordStatus.PAUSE) &&
  //     deviceId !== task?.devId &&
  //     customDevType === DEVTYPES.card
  //   ) {
  //     dispatch(devInfoChange(formatDevSchema(devList.find(i => i.devId === task?.devId))));
  //   }
  // }, [isShow, task, devList, deviceId, customDevType]);

  const getRecordTask = async () => {
    if (!deviceId) return;
    try {
      const action: any = await dispatch(updateRecordTask() as any);
      const task = action?.payload || null;
      // 仅当有进行中的任务时才同步 isCall，避免 task=null 时覆盖录音页已设置的状态
      // ControlBar 中的 isCall 矫正逻辑只在 isRecording=true 时生效，task 为 null 时无需更新
      if (task) {
        dispatch(updateIsCall(checkIsCall(task)));
      }
    } catch (error) {
      console.error('getRecordTask failed:', error);
      dispatch(updateAudioFile({ taskState: RecordStatus.UNKNOWN }));
    }
  };

  useEnsurePageReady('/home');

  usePageReShow(() => {
    if (!deviceId) return;
    getRecordTask();
  });

  usePageEvent('onShow', () => {
    showMenuButton();
  });

  useEffect(() => {
    dispatch(updateRecordTransferResultList({ source: 'home_mount' }));
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    getRecordTask();
  }, [deviceId]);

  // 云同步开关状态变更事件
  const handleCloudSyncSwitchStatusUpdate = res => {
    if (res) {
      dispatch(updateUiState({ cloudSyncSwitchStatus: res }));
      if (!res?.enabled) {
        dispatch(
          updateUiState({
            cloudSyncStatus: {
              status: CloudSyncStatus.Disabled,
              errorCode: 0,
            },
          })
        );
      }
    }
  };

  // 初始化云同步状态
  const initCloudSyncStatus = data => {
    const storageCloudSyncStatus = getStorageSync({ key: 'cloudSyncStatus' }) || '{}';
    const storageCloudSyncStatusObj = JSON.parse(storageCloudSyncStatus as string);
    const { status, errorCode } = storageCloudSyncStatusObj;
    // 更新云同步开关状态
    dispatch(updateUiState({ cloudSyncSwitchStatus: data }));
    // 更新云同步状态
    dispatch(
      updateUiState({
        cloudSyncStatus: {
          status: data?.enabled // 如果云同步开关状态为开启，则根据存储的云同步状态来判断
            ? status === undefined // 如果存储的云同步状态为undefined，则默认为同步成功
              ? CloudSyncStatus.Success // 同步成功
              : status // 否则使用存储的云同步状态
            : CloudSyncStatus.Disabled, // 如果云同步开关状态为关闭，则默认为未开启
          errorCode,
        },
      })
    );
  };

  // 文件列表状态全局刷新事件(包含新增)
  const handleFileListUpdateStatus = (res: any) => {
    // syncBusinessType表示同步业务类型，0: 其他业务，1: 上传业务，只有0的时候刷新列表，1的时候只更新云同步卡片状态
    if (res?.syncBusinessType === 1) {
      setStorageSync({
        key: 'cloudSyncStatus',
        data: JSON.stringify(res),
      });
      dispatch(updateUiState({ cloudSyncStatus: res }));
    } else {
      dispatch(updateRecordTransferResultList({ source: 'home_file_list_update_event' }));
    }
  };

  // 列表的局部刷新事件已统一在 DelayedHooksContainer 的 usePartialRecordUpdate 中接入。

  usePageEvent('onLoad', () => {
    // 文件列表状态全局刷新事件
    // @ts-ignore
    ty.wear?.onFileListUpdateStatusEvent?.(handleFileListUpdateStatus);
  });

  usePageEvent('onUnload', () => {
    // @ts-ignore
    ty.wear?.offFileListUpdateStatusEvent?.();
    // @ts-ignore
    ty.wear?.offCloudSyncSwitchStatusEvent?.();
  });

  useEffect(() => {
    // 监听云同步开关状态变更事件
    // @ts-ignore
    ty.wear?.onCloudSyncSwitchStatusEvent?.(handleCloudSyncSwitchStatusUpdate);

    runSyncNoteRecord().catch(() => {});
    runGetCloudSync()
      .then(res => {
        initCloudSyncStatus(res);
      })
      .catch(() => {});
  }, []);

  return (
    <View className={styles.container} style={getCdnImageStyle()}>
      <View className={styles.main}>
        <TopBar
          leftArrow={false}
          slot={{
            left: <View className={styles.leftTitle}>{Strings.getLang('aiEarPhone')}</View>,
            right: (
              <View
                className={styles.rightTitle}
                style={{ paddingRight: `${menuBounding?.width + 8 || 0}px` }}
              />
            ),
          }}
        />
        <View className={styles.tabRow}>
          <View
            className={`${styles.tabItem} ${
              currTab === HomeTabType.History ? styles.tabActive : ''
            }`}
            onClick={() => {
              dispatch(updateUiState({ currTab: HomeTabType.History }));
            }}
          >
            <Text className={styles.tabText}>{Strings.getLang('home')}</Text>
          </View>
          {!hideSetting && (
            <View
              className={`${styles.tabItem} ${
                currTab === HomeTabType.Mine ? styles.tabActive : ''
              }`}
              onClick={() => {
                dispatch(updateUiState({ currTab: HomeTabType.Mine }));
              }}
            >
              <Text className={styles.tabText}>{Strings.getLang('my')}</Text>
            </View>
          )}
        </View>
        {currTab === HomeTabType.History && <History />}
        {currTab === HomeTabType.Mine && <Mine />}
        {!isEditMode && <ControlBar />}
      </View>
      {!hasNewUserGuide && <NewUserGuide />}
    </View>
  );
};

export default React.memo(Home);
