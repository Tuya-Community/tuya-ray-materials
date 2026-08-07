import { TranscriptSegment } from '@/types/file';
import { SpeakerColor } from './enum';
import { DURATION_THRESHOLD } from './constants';
import { TransferStatus, SummaryStatus } from '@/constant/enums';

// ============ 数据处理函数 ============

/**
 * 处理实时转写数据
 * @param data 实时转写原始数据
 * @returns 处理后的转写列表
 */
export const processRealtimeData = data => {
  const { list } = data;
  const newData = list
    .filter(item => !!item?.asr)
    .map(item => ({
      asrId: item.asrId,
      startSecond: Math.floor(item.beginOffset / 1000),
      endSecond: Math.floor(item.endOffset / 1000),
      text: item.asr,
      transText: item.translate,
      channel: item.channel,
    }));

  return newData;
};

/**
 * 处理云端录音转写数据
 * @param list 转写列表
 * @param duration 录音时长 单位毫秒
 * @returns 处理后的转写列表
 */
export const processCloudTransferData = (list, duration) => {
  // 单位是否为秒
  const isSecondUnit = list?.[0].timeOffset.includes('s');
  const newList = list.map((item: any, index: number) => {
    const { transcript, translation, timeOffset, speaker } = item || {};
    const startSecond = isSecondUnit ? +parseInt(timeOffset, 10) : Math.floor(+timeOffset / 1000);
    const endSecond =
      index === list.length - 1
        ? Math.floor(duration / 1000)
        : Math.floor(parseInt(list?.[index + 1]?.timeOffset || 0, 10) / (isSecondUnit ? 1 : 1000));
    return {
      speaker,
      startSecond,
      endSecond,
      text: transcript,
      transText: translation,
    };
  });

  return newList;
};

/**
 * 遍历转写列表，计算说话人，映射说话人颜色
 * @param transferList 转写列表
 * @returns 说话人颜色映射对象
 */
export const getSpeakerColorMap = (transferList: TranscriptSegment[]) => {
  const speakerColorMap = {};
  // 遍历列表，去重计算说话人
  const speakerList = transferList.map(item => item.speaker).filter(item => !!item);
  const speakerSet = new Set(speakerList);
  Array.from(speakerSet).forEach((item, index) => {
    speakerColorMap[item] = SpeakerColor[`Speaker${index % 10}`];
  });
  return speakerColorMap;
};

// ============ 业务逻辑判断函数 ============

/**
 * 检查是否需要显示时长警告
 * @param duration 音频时长（毫秒）
 * @returns 是否需要显示警告
 */
export const shouldShowDurationWarning = (duration: number): boolean => {
  return duration < DURATION_THRESHOLD.WARNING;
};

/**
 * 判断是否需要刷新转写结果
 * @param transferStatus 当前转写状态
 * @param oldStatus 旧的转写状态
 * @returns 是否需要刷新
 */
export const shouldRefreshTransferResult = (
  transferStatus: TransferStatus,
  oldStatus: TransferStatus
): boolean => {
  return transferStatus !== TransferStatus.Initial && transferStatus !== oldStatus;
};

/**
 * 判断是否需要刷新总结结果
 * @param summaryStatus 当前总结状态
 * @param oldStatus 旧的总结状态
 * @returns 是否需要刷新
 */
export const shouldRefreshSummaryResult = (
  summaryStatus: SummaryStatus,
  oldStatus: SummaryStatus
): boolean => {
  return summaryStatus !== SummaryStatus.Initial && summaryStatus !== oldStatus;
};
