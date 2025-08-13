import { RESET_MAP_CMD_APP_V1 } from '@/constant/cmd';
import { encodeStandardFeatureCommand } from '@/utils/command';

/**
 * *重置当前首页地图0x42/0x43
 *
 * 向设备下发的快速建图指令(0x42) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeResetMap0x42 = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(RESET_MAP_CMD_APP_V1, '01', version);
};

/**
 * @deprecated 请使用 encodeResetMap0x42
 */
export const encodeResetMapV1 = encodeResetMap0x42;
