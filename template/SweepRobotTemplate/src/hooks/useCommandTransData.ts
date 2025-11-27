import { PROTOCOL_VERSION } from '@/constant';
import { commandTransCode } from '@/constant/dpCodes';
import store from '@/redux';
import { PanelMapState, updateMapState } from '@/redux/modules/mapStateSlice';
import { decodeAreas, emitter, getDpIdByCode } from '@/utils';
import log4js from '@ray-js/log4js';
import { useActions } from '@ray-js/panel-sdk';
import {
  DELETE_MAP_CMD_ROBOT_V1,
  PARTITION_DIVISION_CMD_ROBOT_V1,
  PARTITION_MERGE_CMD_ROBOT_V1,
  ROOM_CLEAN_CMD_ROBOT_V1,
  SET_FLOOR_MATERIAL_CMD_ROBOT_V1,
  ROOM_ORDER_CMD_ROBOT_V1,
  SET_ROOM_NAME_CMD_ROBOT_V1,
  SET_ROOM_PROPERTY_CMD_ROBOT_V1,
  USE_MAP_CMD_ROBOT_V1,
  VIRTUAL_AREA_CMD_ROBOT_V2,
  VIRTUAL_WALL_CMD_ROBOT_V1,
  VIRTUAL_WALL_CMD_ROBOT_V2,
  decodeRoomClean0x15,
  getCmdStrFromStandardFeatureCommand,
  requestVirtualArea0x39,
  requestVirtualWall0x13,
  AI_OBJECT_CMD_ROBOT_V1,
  decodeAIObject0x37,
} from '@ray-js/robot-protocol';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { devices } from '@/devices';
import { usePageEvent } from '@ray-js/ray';
import { StreamDataNotificationCenter } from '@ray-js/robot-data-stream';

/**
 * 接收指令数据并解析
 * @returns
 */
export default function useCommandTransData() {
  const dispatch = useDispatch();
  const dpActions = useActions();
  const dpDataChangeRef = useRef<number>(null);

  usePageEvent('onUnload', () => {
    dpDataChangeRef.current && devices.common.offDpDataChange(dpDataChangeRef.current);
  });

  useEffect(() => {
    dpDataChangeRef.current = devices.common.onDpDataChange(({ dps }) => {
      const dpCommandTrans = dps[getDpIdByCode(commandTransCode)];

      if (dpCommandTrans && Object.keys(dps).length <= 1) {
        handleCommandTransData(dpCommandTrans);
      }
    });

    const handleCommandTransData = (command: string) => {
      const { version: mapVersion } = store.getState().mapState;
      const cmd = getCmdStrFromStandardFeatureCommand(command, PROTOCOL_VERSION);

      if (cmd === ROOM_CLEAN_CMD_ROBOT_V1) {
        // 选区清扫上报
        const roomClean = decodeRoomClean0x15({
          command,
          version: PROTOCOL_VERSION,
          mapVersion,
        });

        if (roomClean) {
          dispatch(updateMapState({ selectRoomIds: roomClean.roomIds }));
        }
        return;
      }

      if (cmd === DELETE_MAP_CMD_ROBOT_V1 || cmd === USE_MAP_CMD_ROBOT_V1) {
        emitter.emit('receiveUseOrDeleteResponse', { command, cmd });
        return;
      }

      if (
        cmd === SET_ROOM_NAME_CMD_ROBOT_V1 ||
        cmd === PARTITION_DIVISION_CMD_ROBOT_V1 ||
        cmd === PARTITION_MERGE_CMD_ROBOT_V1 ||
        cmd === ROOM_ORDER_CMD_ROBOT_V1
      ) {
        emitter.emit('receiveRoomEditResponse', { command, cmd });
        return;
      }

      if (cmd === SET_ROOM_PROPERTY_CMD_ROBOT_V1) {
        emitter.emit('receiveSetRoomPropertyResponse', { command, cmd });

        return;
      }

      if (cmd === AI_OBJECT_CMD_ROBOT_V1) {
        // AI识别
        const aiObjects = decodeAIObject0x37({
          command,
          version: PROTOCOL_VERSION,
        });

        StreamDataNotificationCenter.emit('receiveAIPicDataFromDp', aiObjects);
      }

      const data = decodeAreas(command);

      if (!data) return;

      log4js.info('Command Data', data);

      if (Object.keys(data).length > 0) {
        dispatch(updateMapState(data as AtLeastOne<PanelMapState>));
      }

      if (
        [VIRTUAL_AREA_CMD_ROBOT_V2, VIRTUAL_WALL_CMD_ROBOT_V1, VIRTUAL_WALL_CMD_ROBOT_V2].includes(
          cmd
        )
      ) {
        emitter.emit('reportVirtualData', command);
      }

      // 处理地板材质上报
      if ([SET_FLOOR_MATERIAL_CMD_ROBOT_V1].includes(cmd)) {
        emitter.emit('receiveRoomFloorMaterialResponse', command);
      }
    };

    dpActions[commandTransCode].set(requestVirtualArea0x39({ version: PROTOCOL_VERSION }));
    dpActions[commandTransCode].set(requestVirtualWall0x13({ version: PROTOCOL_VERSION }));
  }, []);
  return {};
}
