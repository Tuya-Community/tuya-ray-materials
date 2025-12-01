import React, { useEffect, useState, useCallback } from 'react';
import 'ray';
import {
  getSystemInfoSync,
  getMenuButtonBoundingClientRect,
  device,
  initPanelEnvironment,
  useAppEvent,
} from '@ray-js/ray';
import '@/i18n';
import { onDpDataChange, offDpDataChange } from '@ray-js/api';
import { kit, hooks } from '@ray-js/panel-sdk';
import { Provider } from 'react-redux';
import Res from '@/res';
import {
  RecordStatus,
  updateRecordTask,
  updateRecordTransferResultList,
} from '@/redux/modules/audioFileSlice';
import store from './redux';
import { devInfoChange, updateDeviceOnline } from './redux/modules/devInfoSlice';
import { formatDevSchema, formatDps, checkOnlineHandle } from './utils';
import { initializeUserInfo, updateUserInfo } from './redux/modules/userInfoSlice';
import { responseUpdateDp } from './redux/modules/dpStateSlice';

import '@/icon/iconfont.css';
import '@/global.less';
import { updateSystemInfo } from './redux/modules/systemInfoSlice';
import { updateUiState, getSupportLangList } from './redux/modules/uiStateSlice';
import { mapCloudFunKey } from './utils/panelConfig';

// panel 面板云能力配置
interface FnConfig {
  productStyle?: string;
  modeConfigList?: string[]; // 功能点配置
}

const { initDevInfo } = kit;
const { onDeviceOnlineStatusUpdate, offDeviceOnlineStatusUpdate, getDeviceOnlineType } = device;

const App = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [offlineUsage, setOfflineUsage] = useState(false);
  const panelConfig = hooks.usePanelConfig();
  const [devInfo, setDevInfo] = useState({});
  const [isBtEntryVersion, setIsBtEntryVersion] = useState(false);
  const handleUpdateRecordStatus = useCallback(
    async ({ deviceId, state }) => {
      const devId = store.getState()?.devInfo?.devId;
      if (deviceId === devId) {
        store.dispatch(updateRecordTask());
        if (state === RecordStatus.FINISH) {
          // 录音完成更新录音列表
          try {
            store.dispatch(updateRecordTransferResultList());
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    [devInfo]
  );

  useEffect(() => {
    // 录音状态变更事件
    ty.wear.onRecordTransferStatusUpdateEvent(handleUpdateRecordStatus);
  }, []);

  useAppEvent('onUnload', () => {
    ty.wear.offRecordTransferStatusUpdateEvent(handleUpdateRecordStatus);
  });

  const handleDpDataChange = data => {
    const dpState = formatDps(data);

    if (Object.keys(dpState).length > 0) {
      // 上报dp数据
      store.dispatch(responseUpdateDp(dpState));
    }
  };

  const getOnlineType = devObj => {
    getDeviceOnlineType({
      deviceId: devObj.devId,
      success: ({ onlineType }) => {
        const isOnline = checkOnlineHandle(onlineType, 6);
        store.dispatch(
          updateDeviceOnline({
            isOnline: devObj?.isVirtualDevice || offlineUsage ? true : isOnline,
            isDevOnline: devObj?.isVirtualDevice ? true : isOnline, // 是否设备在线。原先的isOnline使用的地方太多，要支持离线可用。需要用这个字段来区分，设备真实在线状态
          })
        );
      },
      fail: err => {
        console.log('===getDeviceOnlineType=== fail', err);
      },
    });
  };

  const handleDevOnlineChange = data => {
    const { online, deviceId } = data;
    const devObj = store?.getState()?.devInfo;
    if (devObj?.devId === deviceId) {
      store.dispatch(updateDeviceOnline({ isOnline: online }));
      // 入门版耳机，需要根据此判断在离线
      isBtEntryVersion && getOnlineType(devObj);
      // 设备连接状态变化时获取下app录音任务状态
      store.dispatch(updateRecordTask());
    }
  };

  useEffect(() => {
    const initializeState = async () => {
      const systemInfo = getSystemInfoSync();
      const {
        statusBarHeight,
        screenHeight,
        safeArea: { bottom },
        platform,
      } = systemInfo;
      const topBarHeight = statusBarHeight + 44;
      const safeBottomHeight = screenHeight - bottom;
      store.dispatch(
        updateSystemInfo({
          ...systemInfo,
          topBarHeight,
          safeBottomHeight,
          platform: platform.toLowerCase(),
        })
      );
      getMenuButtonBoundingClientRect({
        success: menuBounding => {
          console.log('menuBounding', menuBounding);
          store.dispatch(
            updateSystemInfo({
              menuBounding,
            })
          );
        },
      });
    };

    initializeState();

    ty.getUserInfo({
      success: async (d: any) => {
        store.dispatch(initializeUserInfo(d));
        try {
          const imgUrl = Res.imgDefaultAvatar;
          store.dispatch(
            updateUserInfo({
              avatarUrl: imgUrl,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    });
  }, []);

  useAppEvent('onShow', async () => {
    const devInfoInitial = await initDevInfo();
    setDevInfo(devInfoInitial);
    if (devInfoInitial) {
      store.dispatch(devInfoChange(formatDevSchema(devInfoInitial)));
      setInitialized(true);
      // 获取历史录音列表
      store.dispatch(updateRecordTransferResultList());
      // 获取当前录音任务
      store.dispatch(updateRecordTask());
      // 获取支持的语言列表
      store.dispatch(getSupportLangList());
    }
  });

  useEffect(() => {
    offDpDataChange(handleDpDataChange);
    offDeviceOnlineStatusUpdate(handleDevOnlineChange);
    onDpDataChange(handleDpDataChange);
    onDeviceOnlineStatusUpdate(handleDevOnlineChange);
    return () => {
      offDpDataChange(handleDpDataChange);
      offDeviceOnlineStatusUpdate(handleDevOnlineChange);
    };
  }, [isBtEntryVersion]);

  useEffect(() => {
    if (panelConfig?.initialized) {
      const fnConfig: FnConfig = {};
      const mapCloudFunc = mapCloudFunKey(panelConfig.fun);
      const {
        productStyle,
        modeConfigList,
        isBtEntryVersion,
        offlineUsage,
        opusEncodingType,
        supportRecordChannelChange,
        supportEarControl,
      } = mapCloudFunc;
      setOfflineUsage(!!offlineUsage);
      if (productStyle?.length) {
        fnConfig.productStyle = productStyle?.[0];
      }

      if (modeConfigList?.length) {
        modeConfigList.push('faceToFace');
        fnConfig.modeConfigList = modeConfigList;
      }

      const isBtEntryType = isBtEntryVersion && fnConfig.productStyle !== 'card';

      fnConfig.isBtEntryVersion = isBtEntryType;
      setIsBtEntryVersion(isBtEntryType);
      const currTab = fnConfig.productStyle === 'card' ? 'history' : 'mode';
      store.dispatch(
        updateUiState({
          ...fnConfig,
          offlineUsage,
          isOpusCelt: opusEncodingType?.includes('celt'), // 是否支持opus celt
          currTab,
          supportRecordChannelChange,
          supportEarControl,
        })
      );
    }
  }, [panelConfig]);

  useEffect(() => {
    if (devInfo?.devId && isBtEntryVersion) {
      getOnlineType(devInfo);
    }
  }, [devInfo, isBtEntryVersion]);

  useEffect(() => {
    initPanelEnvironment({ useDefaultOffline: false });
    if (isBtEntryVersion) {
      initPanelEnvironment({ useDefaultOffline: false, showBLEToast: false });
    }
  }, [isBtEntryVersion]);

  return <Provider store={store}>{initialized ? children : null}</Provider>;
};

export default App;
