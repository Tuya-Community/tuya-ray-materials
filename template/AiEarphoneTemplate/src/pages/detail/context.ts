/*
 * @Author: hkc
 * @Date: 2025-08-29 19:40:59
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-04 16:54:08
 * @Description:
 */
import React from 'react';
import { RecordTransferResultDetail } from '@/api/ttt.interface';
import { TranscriptSegment } from '@/types/file';
import { PlayStatus } from './enum';
import { SingleCloudSyncStatus } from '@/constant/enums';

interface FileDetailContextProps {
  playerShow: boolean; // 是否显示播放器弹窗
  setPlayerShow: React.Dispatch<React.SetStateAction<boolean>>;
  playStatus: PlayStatus; // 播放状态
  setPlayStatus: React.Dispatch<React.SetStateAction<string>>; // 设置播放状态
  currentPlaySecond: number; // 当前播放时间 秒
  setCurrentPlaySecond: React.Dispatch<React.SetStateAction<number>>; // 设置当前
  audioContext: any; // 音频上下文
  fileDetail: RecordTransferResultDetail; // 文件详情数据
  summaryLang?: string; // 总结语言
  setSummaryLang?: React.Dispatch<React.SetStateAction<string>>; // 设置总结语言
  translateLang?: string; // 翻译语言
  setTranslateLang?: React.Dispatch<React.SetStateAction<string>>; // 设置翻译语言
  translatePopupShow?: boolean; // 翻译弹窗显示状态
  setTranslatePopupShow?: React.Dispatch<React.SetStateAction<boolean>>; // 设置翻译弹窗显示状态
  transferList?: TranscriptSegment[]; // 转写列表
  originTransferListRef?: React.MutableRefObject<TranscriptSegment[]>; // 原始处理过的转写列表
  originRecognizeListRef?: React.MutableRefObject<any>; // 原始离线录音转写列表
  setTransferList?: React.Dispatch<React.SetStateAction<TranscriptSegment[]>>; // 设置转写列表
  isEditMode?: boolean; // 是否编辑模式
  setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>; // 设置编辑模式
  transEditIndex?: number; // 转写编辑索引
  setTransEditIndex?: React.Dispatch<React.SetStateAction<number>>; // 设置转写编辑索引
  audioDownloadStatus?: SingleCloudSyncStatus; // 音频下载状态
  setAudioDownloadStatus?: React.Dispatch<React.SetStateAction<SingleCloudSyncStatus>>; // 设置音频下载状态
  updateFileDetailLocal?: (
    updater: (prev: RecordTransferResultDetail) => RecordTransferResultDetail
  ) => void; // 更新本地文件详情
  scrollVisibleChapterTime?: number | null; // 滚动可视区域中间位置对应的章节时间（秒）
  setScrollVisibleChapterTime?: React.Dispatch<React.SetStateAction<number | null>>; // 设置滚动章节时间
  refreshFileDetail?: () => Promise<any>;
  markAsLeaving?: () => void;
}

const FileDetailContext = React.createContext<FileDetailContextProps>({
  playerShow: false,
  setPlayerShow: () => {},
  playStatus: PlayStatus.Initial,
  setPlayStatus: () => {},
  currentPlaySecond: 0,
  setCurrentPlaySecond: () => {},
  audioContext: null,
  fileDetail: null,
  summaryLang: '',
  setSummaryLang: () => {},
  translateLang: '',
  setTranslateLang: () => {},
  translatePopupShow: false,
  setTranslatePopupShow: () => {},
  transferList: [] as TranscriptSegment[],
  originTransferListRef: { current: [] as TranscriptSegment[] },
  originRecognizeListRef: { current: [] },
  setTransferList: () => {},
  isEditMode: false,
  setIsEditMode: () => {},
  transEditIndex: -1,
  setTransEditIndex: () => {},
  audioDownloadStatus: SingleCloudSyncStatus.Default,
  scrollVisibleChapterTime: null,
  setScrollVisibleChapterTime: () => {},
  refreshFileDetail: () => Promise.resolve(),
  markAsLeaving: () => {},
});

export default FileDetailContext;
