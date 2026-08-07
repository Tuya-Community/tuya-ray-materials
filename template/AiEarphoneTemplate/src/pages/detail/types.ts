// 内容类型：原文、翻译、原文+翻译
export type ContentType =
  | 'ORIGINAL'
  | 'TRANSLATION'
  | 'ORIGINAL_AND_TRANSLATION'
  | 'TRANSCRIPT_PARAGRAPH_TIME'
  | 'TRANSCRIPT_SPEAKER'
  | 'AUDIO'
  | 'SUMMARY'
  | 'MINDMAP';

// 导出格式类型
export type ExportFormatType = 'docx' | 'pdf' | 'md' | 'jpg';
