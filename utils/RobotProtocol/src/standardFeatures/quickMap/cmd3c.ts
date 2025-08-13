import { QUICK_MAP_CMD_APP_V1 } from '@/constant/cmd';
import { encodeStandardFeatureCommand } from '@/utils/command';

/**
 * *快速建图0x3c/0x3d
 *
 * 向设备下发的快速建图指令(0x3c) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeQuickMap0x3c = (params: { version?: '0' | '1' } = {}): string => {
  const { version = '1' } = params;

  return encodeStandardFeatureCommand(QUICK_MAP_CMD_APP_V1, '01', version);
};

/**
 * @deprecated 请使用 encodeQuickMap0x3c
 */
export const encodeQuickMapV1 = encodeQuickMap0x3c;
