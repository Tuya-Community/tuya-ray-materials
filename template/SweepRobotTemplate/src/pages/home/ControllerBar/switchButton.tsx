import { PROTOCOL_VERSION } from '@/constant';
import {
  cleanTimesCode,
  commandTransCode,
  customizeModeSwitchCode,
  modeCode,
  statusCode,
  switchGoCode,
} from '@/constant/dpCodes';
import Strings from '@/i18n';
import store from '@/redux';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import {
  robotIsAreaPause,
  robotIsAreaing,
  robotIsAutoRunPause,
  robotIsAutoRunning,
  robotIsMapping,
  robotIsPointPause,
  robotIsPointing,
  robotIsSelectRoom,
  robotIsSelectRoomPaused,
} from '@/utils/robotStatus';
import { useActions, useProps } from '@ray-js/panel-sdk';
import {
  encodeRoomClean0x14,
  encodeSpotClean0x3e,
  encodeZoneClean0x3a,
} from '@ray-js/robot-protocol';
import { GridItem } from '@ray-js/smart-ui';
import PauseIcon from '@tuya-miniapp/icons/dist/svg/Pause';
import PlayIcon from '@tuya-miniapp/icons/dist/svg/Play';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import styles from './index.module.less';

const SwitchButton: FC = () => {
  const dpActions = useActions();
  const customizeModeSwitchState = useProps(props => props[customizeModeSwitchCode]);
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const dpMode = useProps(props => props[modeCode]) as Mode;
  const workTimesState = useProps(props => props[cleanTimesCode]);
  const selectRoomIds = useSelector(selectMapStateByKey('selectRoomIds'));
  const currentMode = useSelector(selectMapStateByKey('currentMode'));

  /**
   * 根据扫地机的当前状态,判断清扫按钮的状态
   * @returns
   */
  const judgeRobotStatus: () => 'continue' | 'paused' | 'start' = () => {
    if (
      [robotIsAutoRunPause, robotIsPointPause, robotIsAreaPause, robotIsSelectRoomPaused].some(fn =>
        fn(dpMode, dpStatus)
      )
    ) {
      // 当前处于清扫暂停中,按钮显示为继续清扫
      return 'continue';
    }
    if (
      [
        robotIsAutoRunning,
        robotIsPointing,
        robotIsAreaing,
        robotIsSelectRoom,
        robotIsMapping,
      ].some(fn => fn(dpMode, dpStatus))
    ) {
      // 表示当前处于清扫状态中,按钮显示为暂停
      return 'paused';
    }
    // 表示当前处于非清扫状态中,按钮显示为开始
    return 'start';
  };

  /**
   * 下发划区清扫指令
   * @returns
   */
  const handleZoneStart = async () => {
    const { cleanZones } = store.getState().mapState;

    const command = encodeZoneClean0x3a({
      version: PROTOCOL_VERSION,
      protocolVersion: 2,
      cleanMode: 0,
      suction: 1,
      cistern: 1,
      cleanTimes: 1,
      zones: cleanZones.map(item => {
        return {
          name: '',
          points: item.points,
        };
      }),
    });

    await dpActions[commandTransCode].set(command);

    await dpActions[modeCode].set('zone');
    await dpActions[switchGoCode].set(true);
  };

  /**
   * 下发指哪扫哪清扫指令
   * @returns
   */
  const handlePoseStart = async () => {
    const { spots } = store.getState().mapState;

    const command = encodeSpotClean0x3e({
      version: PROTOCOL_VERSION,
      protocolVersion: 1,
      cleanMode: 0,
      suction: 4,
      cistern: 0,
      cleanTimes: 2,
      points: spots.map(item => item.point),
    });

    await dpActions[commandTransCode].set(command);

    await dpActions[modeCode].set('pose');
    await dpActions[switchGoCode].set(true);
  };

  /**
   * 下发选区清扫指令
   * @returns
   */
  const handleSelectRoomStart = async (cb?: () => any) => {
    const { version } = store.getState().mapState;

    const maxUnknownId = version === 1 ? 31 : 26;

    try {
      // 不能超过指定的房间个数
      if (selectRoomIds.length > maxUnknownId) {
        ty.showToast({
          title: Strings.getLang('dsc_out_limited'),
          icon: 'error',
        });
        return;
      }
      // 不能不选择房间
      if (selectRoomIds.length === 0) {
        ty.showToast({
          title: Strings.getLang('dsc_not_room_selected'),
          icon: 'error',
        });
        return;
      }

      const data = encodeRoomClean0x14({
        cleanTimes: customizeModeSwitchState ? 1 : workTimesState,
        roomIds: selectRoomIds,
        mapVersion: version,
      });

      dpActions[commandTransCode].set(data);

      dpActions[modeCode].set('select_room');
      dpActions[switchGoCode].set(true);
      typeof cb === 'function' && cb();
    } catch (error) {
      console.warn('put select room dp data failed\n', error);
    }
  };
  /**
   * 扫地机开始/暂停/继续清扫
   * 下发DP不可合并,设备端指定了下发顺序: commands -> mode -> switch/pause
   */
  const handleStart = async () => {
    const btnStatus = judgeRobotStatus();
    if (btnStatus !== 'start') {
      // 结束清扫
      return dpActions[switchGoCode].set(false);
    }
    // 地图处于划区状态
    if (currentMode === 'zone') {
      handleZoneStart();
    }

    // 地图处于指哪扫哪状态
    if (currentMode === 'pose') {
      handlePoseStart();
    }

    // 地图处于选区清扫状态
    if (currentMode === 'select_room') {
      handleSelectRoomStart();
    }

    // 地图处于正常状态
    if (currentMode === 'smart') {
      dpActions[modeCode].set('smart');
      dpActions[switchGoCode].set(true);
    }
  };

  return (
    <GridItem
      text={
        judgeRobotStatus() === 'start'
          ? Strings.getLang('dsc_start')
          : Strings.getLang('dsc_end_clean')
      }
      onClick={handleStart}
      className={styles.cleanModeItem}
      icon={judgeRobotStatus() === 'paused' ? PauseIcon : PlayIcon}
    />
  );
};

export default SwitchButton;
