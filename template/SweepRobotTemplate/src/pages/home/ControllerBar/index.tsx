import { PROTOCOL_VERSION } from '@/constant';
import { commandTransCode, modeCode, statusCode, switchChargeCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { selectMapStateByKey, updateMapState } from '@/redux/modules/mapStateSlice';
import {
  isRobotSilence,
  robotIsAreaPause,
  robotIsAreaing,
  robotIsAutoRunPause,
  robotIsAutoRunning,
  robotIsCharing,
  robotIsDust,
  robotIsFault,
  robotIsManual,
  robotIsMapping,
  robotIsPointPause,
  robotIsPointing,
  robotIsSelectRoom,
  robotIsSelectRoomPaused,
  robotIsToCharing,
} from '@/utils/robotStatus';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { CoverView, Text, View } from '@ray-js/ray';
import {
  requestRoomClean0x15,
  requestSpotClean0x3f,
  requestZoneClean0x3b,
} from '@ray-js/robot-protocol';
import { Grid } from '@ray-js/smart-ui';
import { useUpdateEffect } from 'ahooks';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddAreaButton from './addAreaButton';
import styles from './index.module.less';
import IpcButton from './ipcButton';
import ModeChange from './modeChange';
import QuickMapButton from './quickMapButton';
import RechargeButton from './rechargeButton';
import SettingButton from './settingButton';
import SwitchButton from './switchButton';

const ControllerBar: FC = () => {
  const dispatch = useDispatch();
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const dpMode = useProps(props => props[modeCode]) as Mode;
  const dpSwitchCharge = useProps(props => props[switchChargeCode]);
  const currentMode = useSelector(selectMapStateByKey('currentMode'));
  const dpActions = useActions();

  useUpdateEffect(() => {
    // 扫地机处于待机/充电中/充电完成/休眠/故障状态
    if (isRobotSilence(dpStatus) || robotIsFault(dpStatus)) {
      dispatch(
        updateMapState({ currentMode: 'smart', selectRoomIds: [], spots: [], cleanZones: [] })
      );
    }
  }, [dpStatus]);

  /**
   * 监听 工作模式/机器状态 DP值上报
   */
  useEffect(() => {
    /**
     * 工作模式/机器状态改变回调函数
     */
    const modeAndStatusChange = async () => {
      // 扫地机处于回充/寻找集尘桶/集尘/手动控制状态
      if (
        robotIsToCharing(dpStatus, dpSwitchCharge) ||
        robotIsCharing(dpStatus) ||
        robotIsDust(dpStatus) ||
        robotIsManual(dpMode, dpStatus)
      ) {
        dispatch(updateMapState({ currentMode: 'smart' }));
      }

      // 扫地机处于指哪扫哪暂停状态
      if ([robotIsPointPause].some(fn => fn(dpMode, dpStatus))) {
        dispatch(updateMapState({ currentMode: 'pose' }));
        dpActions[commandTransCode].set(requestSpotClean0x3f({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于指哪扫哪清扫状态
      if ([robotIsPointing].some(fn => fn(dpMode, dpStatus))) {
        dispatch(updateMapState({ currentMode: 'pose' }));
        dpActions[commandTransCode].set(requestSpotClean0x3f({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于划区清扫暂停状态
      if ([robotIsAreaPause].some(fn => fn(dpMode, dpStatus))) {
        dispatch(updateMapState({ currentMode: 'zone' }));
        dpActions[commandTransCode].set(requestZoneClean0x3b({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于划区清扫中状态
      if ([robotIsAreaing].some(fn => fn(dpMode, dpStatus))) {
        dispatch(updateMapState({ currentMode: 'zone' }));
        dpActions[commandTransCode].set(requestZoneClean0x3b({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于全屋清扫/全屋清扫暂停/快速建图/快速建图暂停状态
      if (
        [robotIsAutoRunning, robotIsAutoRunPause, robotIsMapping].some(fn => fn(dpMode, dpStatus))
      ) {
        dispatch(updateMapState({ currentMode: 'smart' }));
      }
      // 扫地机处于选区清扫状态
      if ([robotIsSelectRoom].some(fn => fn(dpMode, dpStatus))) {
        dispatch(
          updateMapState({
            currentMode: 'select_room',
          })
        );
        dpActions[commandTransCode].set(requestRoomClean0x15({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于选区清扫暂停状态
      if ([robotIsSelectRoomPaused].some(fn => fn(dpMode, dpStatus))) {
        dispatch(
          updateMapState({
            currentMode: 'select_room',
          })
        );
        dpActions[commandTransCode].set(requestRoomClean0x15({ version: PROTOCOL_VERSION }));
      }
    };

    modeAndStatusChange();
  }, [dpMode, dpStatus]);

  return (
    <CoverView className={styles.controllerBarContainer}>
      {/* 清扫按钮、清洁偏好、回充、快速建图 */}
      <View className={styles.operationContainer}>
        <View
          style={{
            background: '#FA8C16',
            width: '100vw',
            padding: '8rpx 16rpx',
          }}
        >
          <Text style={{ color: '#fff', fontSize: '12px' }}>
            {Strings.getLang('dsc_home_p2p_tips')}
          </Text>
        </View>
        {/* 快速建图: 无地图且不处于快速建图状态中时显示快速建图按钮 */}
        <QuickMapButton />

        <ModeChange />
        {/* 控制栏 */}
        <Grid customClass={styles.full} border={false}>
          <SwitchButton />
          {/* 回充 */}
          {currentMode === 'zone' ? <AddAreaButton /> : <RechargeButton />}
          <SettingButton />
          <IpcButton />
        </Grid>
      </View>
    </CoverView>
  );
};

export default ControllerBar;
