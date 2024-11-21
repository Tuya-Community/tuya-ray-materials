import { commandTransCode } from '@/constant/dpCodes';
import { PROTOCOL_VERSION } from '@/constant';
import {
  useCreateVirtualWall,
  useForbiddenNoGo,
  useForbiddenNoMop,
  usePoseClean,
  useZoneClean,
} from '@/hooks';
import store from '@/redux';
import { mapExtrasUpdated } from '@/redux/modules/mapExtrasSlice';
import { updateMapData } from '@/redux/modules/mapStateSlice';
import { decodeAreas, emitter } from '@/utils';
import log4js from '@ray-js/log4js';
import { useActions } from '@ray-js/panel-sdk';
import {
  DELETE_MAP_CMD_ROBOT_V1,
  PARTITION_DIVISION_CMD_ROBOT_V1,
  PARTITION_MERGE_CMD_ROBOT_V1,
  ROOM_CLEAN_CMD_ROBOT_V1,
  SET_ROOM_NAME_CMD_ROBOT_V1,
  USE_MAP_CMD_ROBOT_V1,
  VIRTUAL_AREA_CMD_ROBOT_V2,
  VIRTUAL_WALL_CMD_ROBOT_V1,
  VIRTUAL_WALL_CMD_ROBOT_V2,
  decodeRoomClean0x15,
  getCmdStrFromStandardFeatureCommand,
  requestVirtualAreaV2,
  requestVirtualWallV1,
} from '@ray-js/robot-protocol';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

/**
 * 接收指令数据并解析
 * @returns
 */
export default function useCommandTransData() {
  const dispatch = useDispatch();
  const dpActions = useActions();

  const { getForbiddenNoMopConfig } = useForbiddenNoMop();
  const { getPoseCleanConfig } = usePoseClean();
  const { getForbiddenNoGoConfig } = useForbiddenNoGo();
  const { getZoneCleanConfig } = useZoneClean();
  const { getVirtualWallConfig } = useCreateVirtualWall();

  useEffect(() => {
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
          const { roomHexIds } = roomClean;
          dispatch(updateMapData({ selectRoomData: roomHexIds }));
        }
        return;
      }

      if (cmd === DELETE_MAP_CMD_ROBOT_V1 || cmd === USE_MAP_CMD_ROBOT_V1) {
        emitter.emit('receiveUseOrDeleteResponse', command);
        return;
      }

      if (
        cmd === SET_ROOM_NAME_CMD_ROBOT_V1 ||
        cmd === PARTITION_DIVISION_CMD_ROBOT_V1 ||
        cmd === PARTITION_MERGE_CMD_ROBOT_V1
      ) {
        emitter.emit('receiveRoomEditResponse', command);
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

    emitter.on('receiveCommandTransData', handleCommandTransData);
    emitter.on('reorganizationRCTAreaList', handleReorganizationRCTAreaList);

    dpActions[commandTransCode].set(requestVirtualAreaV2({ version: PROTOCOL_VERSION }));
    dpActions[commandTransCode].set(requestVirtualWallV1({ version: PROTOCOL_VERSION }));

    return () => {
      emitter.off('receiveCommandTransData');
      emitter.off('reorganizationRCTAreaList');
    };
  }, []);
  return {};
}
