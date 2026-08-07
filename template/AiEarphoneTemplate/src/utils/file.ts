import { MergeErrorCode } from '@/api/ttt.interface';
import { AudioSource, AudioSourceRanges } from '@/constant/enums';
import Strings from '@/i18n';

/**
 * 判断给定的值是否属于某个音源类型
 * @param value 要判断的值
 * @param sourceType 音源类型
 * @returns 是否属于该音源类型
 */
export const isAudioSourceType = (
  value: number,
  sourceType: keyof typeof AudioSource | keyof typeof AudioSourceRanges
): boolean => {
  // 先检查是否有范围定义
  const range = AudioSourceRanges[sourceType];
  if (range) {
    return value >= range.min && value <= range.max;
  }
  // 如果没有范围定义，则直接比较枚举值
  return value === AudioSource[sourceType];
};

/**
 * 获取给定值对应的音源类型
 * @param value 要判断的值
 * @returns 音源类型的 key，如果没有匹配则返回 undefined
 */
export const getAudioSourceType = (value: number): keyof typeof AudioSource | undefined => {
  // 先检查范围
  for (const [key, range] of Object.entries(AudioSourceRanges)) {
    if (value >= range.min && value <= range.max) {
      return key as keyof typeof AudioSource;
    }
  }
  // 再检查精确匹配
  for (const [key, enumValue] of Object.entries(AudioSource)) {
    if (typeof enumValue === 'number' && enumValue === value) {
      return key as keyof typeof AudioSource;
    }
  }
  return undefined;
};

// 根据错误码获取对应提示文案
export const getMergeErrorMsg = (errorCode?: MergeErrorCode): string => {
  const errorMsgMap: Record<MergeErrorCode, string> = {
    20220: Strings.getLang('merge_error_20220'), // 参数为空
    20221: Strings.getLang('merge_error_20221'), // 通用合并失败
    20222: Strings.getLang('merge_error_20222'), // 网络不可用
    20223: Strings.getLang('merge_error_20223'), // 本地文件不存在
    20224: Strings.getLang('merge_error_20224'), // 上传记录失败
    20225: Strings.getLang('merge_error_20225'), // 合并上报失败
    20226: Strings.getLang('merge_error_20226'), // 录音记录未找到
    20227: Strings.getLang('merge_error_20227'), // 未知错误
    20229: Strings.getLang('merge_error_20229'), // 创建合并 RecordFile 失败
    20230: Strings.getLang('merge_error_20230'), // 取消合并
  };
  return errorCode != null
    ? errorMsgMap[errorCode] ?? Strings.getLang('merge_error_unknown')
    : Strings.getLang('merge_error_unknown');
};

export const getShareImportErrorMsg = (errorCode?: number): string => {
  const errorMsgMap: Record<number, string> = {
    20115: Strings.getLang('share_import_error_20115'),
    20116: Strings.getLang('share_import_error_20116'),
    20117: Strings.getLang('share_import_error_20117'),
    20118: Strings.getLang('share_import_error_20118'),
    20101: Strings.getLang('20101'),
    20102: Strings.getLang('20104'),
  };
  return errorCode != null
    ? errorMsgMap[errorCode] ?? Strings.getLang('share_import_error_20118')
    : Strings.getLang('share_import_error_20118');
};
