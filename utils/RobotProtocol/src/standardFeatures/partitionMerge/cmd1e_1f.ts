import type { DataArray } from '@/typings';
import { PARTITION_MERGE_CMD_APP_V1, PARTITION_MERGE_CMD_ROBOT_V1 } from '@/constant/cmd';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeStandardFeatureCommand,
} from '@/utils/command';

/**
 * *分区合并0x1e/0x1f
 *
 * 向设备下发的分区合并指令(0x1e) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodePartitionMerge0x1e = (params: {
  roomIds: number[];
  version?: '0' | '1';
}): string => {
  const { roomIds, version = '1' } = params;

  const dataArray: DataArray = [];

  roomIds.forEach(roomId => {
    dataArray.push(roomId);
  });

  return encodeStandardFeatureCommand(
    PARTITION_MERGE_CMD_APP_V1,
    convertDataArrayToDataStr(dataArray),
    version
  );
};

/**
 * @deprecated 请使用 encodePartitionMerge0x1e
 */
export const encodePartitionMergeV1 = encodePartitionMerge0x1e;
/**
 * *分区合并0x1e/0x1f
 *
 * 解析设备响应的分区合并结果(0x1f) | Robot ➜ App
 * @param params 参数
 * @returns 分区合并结果
 */
export const decodePartitionMerge0x1f = (params: {
  command: string;
  version?: '0' | '1';
}): {
  ret: number;
  success: boolean;
} | null => {
  const { command, version = '1' } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(
    command,
    PARTITION_MERGE_CMD_ROBOT_V1,
    version
  );

  if (!valid) {
    return null;
  }

  const ret = parseInt(dataStr.slice(0, 2), 16);

  return {
    ret,
    success: ret === 1,
  };
};

/**
 * @deprecated 请使用 decodePartitionMerge0x1f
 */
export const decodePartitionMergeV1 = decodePartitionMerge0x1f;
