import { ContentType, ExportFormatType } from './types';
import { GenerateType } from '@/redux/modules/fileDetailSlice';
import { MINI_PROGRAM_ID } from '@/constant';

// ============ Tab类型枚举 ============
export enum DetailTabType {
  Transcribe = 'transcribe',
  Summarize = 'summarize',
  MindMap = 'mindMap',
}

// ============ 内容类型常量 ============
export const CONTENT_TYPE = {
  ORIGINAL: 'ORIGINAL' as ContentType,
  TRANSLATION: 'TRANSLATION' as ContentType,
  ORIGINAL_AND_TRANSLATION: 'ORIGINAL_AND_TRANSLATION' as ContentType,
  TRANSCRIPT_PARAGRAPH_TIME: 'TRANSCRIPT_PARAGRAPH_TIME' as ContentType, // 段落时间
  TRANSCRIPT_SPEAKER: 'TRANSCRIPT_SPEAKER' as ContentType, // 说话人标签
  AUDIO: 'AUDIO' as ContentType, // 音频
  SUMMARY: 'SUMMARY' as ContentType, // 总结
  MINDMAP: 'MINDMAP' as ContentType, // 思维导图
} as const;

// ============ 导出格式常量 ============
export const EXPORT_FORMAT = {
  MD: 'md' as ExportFormatType,
  DOCX: 'docx' as ExportFormatType,
  PDF: 'pdf' as ExportFormatType,
  JPG: 'jpg' as ExportFormatType,
} as const;

// ============ 音频源标识 ============
export const AUDIO_SOURCE = MINI_PROGRAM_ID;

// ============ 时长阈值（毫秒） ============
export const DURATION_THRESHOLD = {
  WARNING: 90 * 1000, // 90秒警告阈值
} as const;

// ============ 上传进度常量 ============
export const UPLOAD_PROGRESS = {
  COMPLETE: 100, // 上传完成
  INITIAL: 0, // 初始状态
} as const;

// ============ 生成类型到Tab的映射 ============
export const GENERATE_TYPE_TO_TAB_MAP: Record<GenerateType, DetailTabType> = {
  [GenerateType.Transcribe]: DetailTabType.Transcribe,
  [GenerateType.Summarize]: DetailTabType.Summarize,
  [GenerateType.Translate]: DetailTabType.Transcribe,
};
