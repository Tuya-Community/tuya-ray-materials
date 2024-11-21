import { PROTOCOL_VERSION } from '@/constant';
import { commandTransCode, modeCode, statusCode, switchChargeCode } from '@/constant/dpCodes';
import store from '@/redux';
import {
  setLaserMapSplitType,
  showPilePositionBreatheAnimation,
  showRobotSleepAnimation,
} from '@/utils/openApi';

import Strings from '@/i18n';
import {
  isRobotSilence,
  isRobotSleep,
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
import { EMapSplitStateEnum, ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import { Grid } from '@ray-js/smart-ui';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useUpdateEffect } from 'ahooks';
import { updateMapData } from '@/redux/modules/mapStateSlice';
import { mapExtrasUpdated } from '@/redux/modules/mapExtrasSlice';
import { emitter } from '@/utils';
import AddAreaButton from './addAreaButton';
import styles from './index.module.less';
import ModeChange from './modeChange';
import QuickMapButton from './quickMapButton';
import RechargeButton from './rechargeButton';
import SettingButton from './settingButton';
import SwitchButton from './switchButton';

type Props = {
  mapStatus: number;
  setMapStatus: (status: number) => void;
};

const ControllerBar: FC<Props> = ({ mapStatus, setMapStatus }) => {
  const dispatch = useDispatch();
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const dpMode = useProps(props => props[modeCode]) as Mode;
  const dpSwitchCharge = useProps(props => props[switchChargeCode]);
  const dpActions = useActions();

  // 工作模式
  const [modeState, setModeState] = useState<Mode>(
    (['smart', 'select_room', 'zone', 'pose'] as Mode[]).includes(dpMode) ? dpMode : 'smart'
  );

  useUpdateEffect(() => {
    const { mapId } = store.getState().mapState;

    // 扫地机处于充电状态下显示充电中的动画
    if (robotIsCharing(dpStatus)) {
      showPilePositionBreatheAnimation(mapId, true);
    } else {
      showPilePositionBreatheAnimation(mapId, false);
    }

    // 扫地机是否处于休眠中状态
    if (isRobotSleep(dpStatus)) {
      showRobotSleepAnimation(mapId, true);
    } else {
      showRobotSleepAnimation(mapId, false);
    }

    // 扫地机处于待机/充电中/充电完成/休眠/故障状态
    if (isRobotSilence(dpStatus) || robotIsFault(dpStatus)) {
      setModeState('smart');
      setMapStatus(ENativeMapStatusEnum.normal);
      dispatch(updateMapData({ selectRoomData: [] }));
      dispatch(mapExtrasUpdated({ appointData: [], sweepRegionData: [] }));
      emitter.emit('reorganizationRCTAreaList');
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
      const { mapId } = store.getState().mapState;
      // 扫地机处于回充/寻找集尘桶/集尘/手动控制状态
      if (
        robotIsToCharing(dpStatus, dpSwitchCharge) ||
        robotIsCharing(dpStatus) ||
        robotIsDust(dpStatus) ||
        robotIsManual(dpMode, dpStatus)
      ) {
        setModeState('smart');
        setMapStatus(ENativeMapStatusEnum.normal);

        dispatch(updateMapData({ selectRoomData: [] }));
        dispatch(mapExtrasUpdated({ appointData: [], sweepRegionData: [] }));
        emitter.emit('reorganizationRCTAreaList');
      }

      // 扫地机处于指哪扫哪暂停状态
      if ([robotIsPointPause].some(fn => fn(dpMode, dpStatus))) {
        setModeState('pose');
        dpActions[commandTransCode].set(requestSpotClean0x3f({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于指哪扫哪清扫状态
      if ([robotIsPointing].some(fn => fn(dpMode, dpStatus))) {
        setModeState('pose');
        setMapStatus(ENativeMapStatusEnum.normal);
        dpActions[commandTransCode].set(requestSpotClean0x3f({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于划区清扫暂停状态
      if ([robotIsAreaPause].some(fn => fn(dpMode, dpStatus))) {
        setModeState('zone');
        setMapStatus(ENativeMapStatusEnum.normal);
        dpActions[commandTransCode].set(requestZoneClean0x3b({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于划区清扫中状态
      if ([robotIsAreaing].some(fn => fn(dpMode, dpStatus))) {
        setModeState('zone');
        setMapStatus(ENativeMapStatusEnum.normal);
        dpActions[commandTransCode].set(requestZoneClean0x3b({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于全屋清扫/全屋清扫暂停/快速建图/快速建图暂停状态
      if (
        [robotIsAutoRunning, robotIsAutoRunPause, robotIsMapping].some(fn => fn(dpMode, dpStatus))
      ) {
        setModeState('smart');
        setMapStatus(ENativeMapStatusEnum.normal);
        dispatch(updateMapData({ selectRoomData: [] }));
      }
      // 扫地机处于选区清扫状态
      if ([robotIsSelectRoom].some(fn => fn(dpMode, dpStatus))) {
        setModeState('select_room');
        setMapStatus(ENativeMapStatusEnum.normal);
        setLaserMapSplitType(mapId, EMapSplitStateEnum.click);
        dpActions[commandTransCode].set(requestRoomClean0x15({ version: PROTOCOL_VERSION }));
      }
      // 扫地机处于选区清扫暂停状态
      if ([robotIsSelectRoomPaused].some(fn => fn(dpMode, dpStatus))) {
        setModeState('select_room');
        setLaserMapSplitType(mapId, EMapSplitStateEnum.click);
        setMapStatus(ENativeMapStatusEnum.normal);
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
            width: '100%',
            padding: 10,
            borderRadius: 10,
            margin: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: '12px' }}>
            {Strings.getLang('dsc_home_p2p_tips')}
          </Text>
        </View>
        {/* 快速建图: 无地图且不处于快速建图状态中时显示快速建图按钮 */}
        <QuickMapButton />

        <ModeChange
          setMapStatus={setMapStatus}
          modeState={modeState}
          setModeState={newMode => {
            setModeState(newMode);
          }}
        />
        {/* 控制栏 */}
        <Grid customClass={styles.full} border={false}>
          <SwitchButton mapStatus={mapStatus} />
          {/* 回充 */}
          {mapStatus === ENativeMapStatusEnum.areaSet ? <AddAreaButton /> : <RechargeButton />}
          <SettingButton />
        </Grid>
      </View>
    </CoverView>
  );
};

export default ControllerBar;
