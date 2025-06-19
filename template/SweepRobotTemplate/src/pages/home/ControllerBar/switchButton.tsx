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
import { getMapPointsInfo } from '@/utils/openApi';
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
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import { GridItem } from '@ray-js/smart-ui';
import PauseIcon from '@tuya-miniapp/icons/dist/svg/Pause';
import PlayIcon from '@tuya-miniapp/icons/dist/svg/Play';
import { once } from 'lodash-es';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import styles from './index.module.less';

type Props = {
  mapStatus: number;
};

const SwitchButton: FC<Props> = props => {
  const dpActions = useActions();
  const customizeModeSwitchState = useProps(props => props[customizeModeSwitchCode]);
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const dpMode = useProps(props => props[modeCode]) as Mode;
  const workTimesState = useProps(props => props[cleanTimesCode]);
  const selectRoomData = useSelector(selectMapStateByKey('selectRoomData'));

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
   * 下发划区清扫/指哪扫哪指令
   * @param minCount
   * @returns
   */
  const putPointData = async (minCount: number, cb?: () => Promise<void>) => {
    const { mapId, origin } = store.getState().mapState;
    const { mapStatus } = props;
    const { data } = await getMapPointsInfo(mapId);

    let dataArr = [];
    if (mapStatus === ENativeMapStatusEnum.areaSet) {
      dataArr = data;
    } else {
      data.forEach(i => dataArr.push(i.points));
    }

    const putFn = once(async () => {
      if (mapStatus === ENativeMapStatusEnum.pressToRun) {
        // 定点清扫
        const command = encodeSpotClean0x3e({
          version: PROTOCOL_VERSION,
          protocolVersion: 1,
          cleanMode: 0,
          suction: 4,
          cistern: 0,
          cleanTimes: 2,
          origin,
          points: dataArr,
        });

        await dpActions[commandTransCode].set(command);
      }

      if (mapStatus === ENativeMapStatusEnum.areaSet) {
        // 划区清扫
        const command = encodeZoneClean0x3a({
          version: PROTOCOL_VERSION,
          protocolVersion: 2,
          cleanMode: 0,
          suction: 1,
          cistern: 1,
          cleanTimes: 1,
          origin,
          zones: dataArr.map(item => {
            return {
              name: item.content.text,
              points: item.points,
            };
          }),
        });

        await dpActions[commandTransCode].set(command);
      }
    });

    if (minCount && dataArr.length < minCount) {
      ty.showToast({
        title: Strings.getLang('dsc_not_selected'),
        icon: 'error',
      });
      return false;
    }
    await putFn();
    typeof cb === 'function' && (await cb());
    return true;
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
      if (selectRoomData.length > maxUnknownId) {
        ty.showToast({
          title: Strings.getLang('dsc_out_limited'),
          icon: 'error',
        });
        return;
      }
      // 不能不选择房间
      if (selectRoomData.length === 0) {
        ty.showToast({
          title: Strings.getLang('dsc_not_room_selected'),
          icon: 'error',
        });
        return;
      }

      const data = encodeRoomClean0x14({
        cleanTimes: customizeModeSwitchState ? 1 : workTimesState,
        roomHexIds: selectRoomData,
        mapVersion: version,
      });

      dpActions[commandTransCode].set(data);
      typeof cb === 'function' && cb();
    } catch (error) {
      console.warn('put select room dp data failed\n', error);
    }
  };
  /**
   * 扫地机开始/暂停/继续清扫
   * 下发DP不可合并,设备端指定了下发顺序: commands -> mode -> switch/pause
   */
  const handleSwitchStart = async () => {
    const { mapStatus } = props;
    const btnStatus = judgeRobotStatus();
    if (btnStatus !== 'start') {
      // 结束清扫
      return dpActions[switchGoCode].set(false);
    }
    // 地图处于划区状态
    if (mapStatus === ENativeMapStatusEnum.areaSet) {
      // 如果处于还未开始清扫状态
      const callback = async () => {
        await dpActions[modeCode].set('zone');
        await dpActions[switchGoCode].set(true);
      };
      putPointData(1, callback);
    }

    // 地图处于指哪扫哪状态
    if (mapStatus === ENativeMapStatusEnum.pressToRun) {
      // 如果处于还未开始清扫状态
      const callback = async () => {
        await dpActions[modeCode].set('pose');
        await dpActions[switchGoCode].set(true);
      };
      putPointData(1, callback);
    }

    // 地图处于选区清扫状态
    if (mapStatus === ENativeMapStatusEnum.mapClick) {
      // 如果处于还未开始清扫状态
      const callback = () => {
        dpActions[modeCode].set('select_room');
        dpActions[switchGoCode].set(true);
      };
      handleSelectRoomStart(callback);
    }

    // 地图处于正常状态
    if (mapStatus === ENativeMapStatusEnum.normal) {
      // 如果处于还未开始清扫状态
      // 如果处于寻找充电座中,则弹窗提示
      // 反之则下发开始清扫指令

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
      onClick={handleSwitchStart}
      className={styles.cleanModeItem}
      icon={judgeRobotStatus() === 'paused' ? PauseIcon : PlayIcon}
    />
  );
};

export default SwitchButton;
