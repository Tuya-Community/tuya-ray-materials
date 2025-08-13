import type { DataArray } from '@/typings';
import { VOICE_APP_V1, VOICE_ROBOT_V1 } from '@/constant/cmd';
import {
  convertDataArrayToDataStr,
  decodeStandardFeatureCommand,
  encodeExtendFeatureCommand,
} from '@/utils/command';
import { stringToByte } from '@/utils';

/**
 * *语音包0x34/0x35
 *
 * 语音包指令(0x34) | App ➜ Robot
 * @param params 参数
 * @returns 指令
 */
export const encodeVoice0x34 = (params: { id: number; md5: string; url: string }): string => {
  const { id, md5, url } = params;

  const dataArray: DataArray = [];

  const md5ByteArr = stringToByte(md5);
  const md5ByteLength = md5ByteArr.length;

  const urlByteArr = stringToByte(url);
  const urlByteLength = urlByteArr.length;

  dataArray.push(
    {
      value: id,
      byte: 4,
    },
    md5ByteLength,
    ...md5ByteArr,
    {
      value: urlByteLength,
      byte: 4,
    },
    ...urlByteArr
  );

  return encodeExtendFeatureCommand(VOICE_APP_V1, convertDataArrayToDataStr(dataArray));
};

/**
 * *语音包0x34/0x35
 *
 * 语音包状态上报(0x35) | Robot ➜ App
 * @param params 参数
 * @returns 语音包状态
 */
export const decodeVoice0x35 = (params: {
  command: string;
}): {
  languageId: number;
  status: number;
  progress: number;
} | null => {
  const { command } = params;

  const { dataStr, valid } = decodeStandardFeatureCommand(command, VOICE_ROBOT_V1);

  if (!valid) {
    return null;
  }

  const languageId = parseInt(dataStr.slice(0, 8), 16);
  const status = parseInt(dataStr.slice(8, 10), 16);
  const progress = parseInt(dataStr.slice(10, 12), 16);

  return {
    languageId,
    status,
    progress,
  };
};
