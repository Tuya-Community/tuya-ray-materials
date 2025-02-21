import { PROTOCOL_VERSION } from '@/constant';
import { commandTransCode } from '@/constant/dpCodes';
import {
  useCreateVirtualWall,
  useForbiddenNoGo,
  useForbiddenNoMop,
  usePoseClean,
  useZoneClean,
} from '@/hooks';
import store from '@/redux';
import { selectCustomConfig, setCustomConfig } from '@/redux/modules/customConfigSlice';
import { mapExtrasUpdated } from '@/redux/modules/mapExtrasSlice';
import { updateMapData } from '@/redux/modules/mapStateSlice';
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
  decodeRoomOrder0x27,
  decodeSetRoomName0x25,
  decodeSetRoomProperty0x23,
  getCmdStrFromStandardFeatureCommand,
  requestVirtualArea0x39,
  requestVirtualWall0x13,
} from '@ray-js/robot-protocol';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '@/redux';
import { devices } from '@/devices';
import { usePageEvent } from '@ray-js/ray';
import { parseRoomHexId } from '@ray-js/robot-protocol';

/**
 * 接收指令数据并解析
 * @returns
 */
export default function useCommandTransData() {
  const dispatch = useDispatch();
  const dpActions = useActions();
  const dpDataChangeRef = useRef<number>(null);

  const { getForbiddenNoMopConfig } = useForbiddenNoMop();
  const { getPoseCleanConfig } = usePoseClean();
  const { getForbiddenNoGoConfig } = useForbiddenNoGo();
  const { getZoneCleanConfig } = useZoneClean();
  const { getVirtualWallConfig } = useCreateVirtualWall();
  const customConfig = useSelector(selectCustomConfig);
  const { version } = useSelector(state => state.mapState);

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

      if (cmd === SET_ROOM_NAME_CMD_ROBOT_V1) {
        const data = decodeSetRoomName0x25({ command, version: PROTOCOL_VERSION, mapVersion });
        if (data && data.length > 0) {
          const res = { ...customConfig };
          data.forEach(item => {
            const { name, roomHexId } = item;

            const preConfig = customConfig[roomHexId] || {};
            res[roomHexId] = {
              ...preConfig,
              name,
            };
          });
          dispatch(setCustomConfig(res));
        }
      }

      if (cmd === ROOM_ORDER_CMD_ROBOT_V1) {
        const data = decodeRoomOrder0x27({ command, version: PROTOCOL_VERSION });
        if (data && data.length > 0) {
          const res = { ...customConfig };
          data.forEach((roomId, index) => {
            const roomHexId = parseRoomHexId(roomId, version);
            const preConfig = customConfig[roomHexId] || {};
            res[roomHexId] = {
              ...preConfig,
              order: index + 1,
            };
          });
          emitter.emit('receiveRoomOrderResponse', command);
          dispatch(setCustomConfig(res));
        }
      }

      if (cmd === SET_ROOM_PROPERTY_CMD_ROBOT_V1) {
        const data = decodeSetRoomProperty0x23({
          command,
          version: PROTOCOL_VERSION,
          mapVersion,
        });
        if (data && data.length > 0) {
          const res = { ...customConfig };
          data.forEach(item => {
            const { suction, cistern, cleanTimes, roomHexId } = item;
            const preConfig = customConfig[roomHexId] || {};
            res[roomHexId] = {
              ...preConfig,
              water_level: cistern,
              fan: suction,
              sweep_count: cleanTimes,
            };
          });
          dispatch(setCustomConfig(res));
        }

        return emitter.emit('receiveSetRoomPropertyResponse', command);
      }

      if (cmd === ROOM_CLEAN_CMD_ROBOT_V1) {
        // 选区清扫上报
        const roomClean = decodeRoomClean0x15({
          command,
          version: PROTOCOL_VERSION,
          mapVersion,
        });

        if (roomClean) {
          const { roomHexIds } = roomClean;
          dispatch(updateMapData({ selectRoomData: roomHexIds }));
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

      const data = decodeAreas(command);

      if (!data) return;

      log4js.info('区域数据', data);

      dispatch(mapExtrasUpdated(data));

      if (
        [VIRTUAL_AREA_CMD_ROBOT_V2, VIRTUAL_WALL_CMD_ROBOT_V1, VIRTUAL_WALL_CMD_ROBOT_V2].includes(
          cmd
        )
      ) {
        emitter.emit('reportVirtualData', command);
      }

      handleReorganizationRCTAreaList();

      // 处理地板材质上报
      if ([SET_FLOOR_MATERIAL_CMD_ROBOT_V1].includes(cmd)) {
        emitter.emit('reportRoomFloorMaterial', command);
      }
    };

    const handleReorganizationRCTAreaList = () => {
      const {
        virtualMopAreaData,
        appointData,
        virtualAreaData,
        sweepRegionData,
        virtualWallData,
      } = store.getState().mapExtras;
      const areaList = [];
      areaList.push(
        ...virtualMopAreaData.map(item => {
          return getForbiddenNoMopConfig(item.points);
        })
      );
      areaList.push(
        ...virtualAreaData.map(item => {
          return getForbiddenNoGoConfig(item.points);
        })
      );
      areaList.push(
        ...virtualWallData.map(item => {
          return getVirtualWallConfig(item);
        })
      );
      areaList.push(...sweepRegionData.map(item => getZoneCleanConfig(item.points)));

      if (appointData && appointData.length > 0) {
        areaList.push(getPoseCleanConfig(appointData));
      }

      dispatch(updateMapData({ RCTAreaList: areaList }));
    };

    emitter.on('reorganizationRCTAreaList', handleReorganizationRCTAreaList);

    dpActions[commandTransCode].set(requestVirtualArea0x39({ version: PROTOCOL_VERSION }));
    dpActions[commandTransCode].set(requestVirtualWall0x13({ version: PROTOCOL_VERSION }));

    return () => {
      emitter.off('reorganizationRCTAreaList');
    };
  }, []);
  return {};
}
