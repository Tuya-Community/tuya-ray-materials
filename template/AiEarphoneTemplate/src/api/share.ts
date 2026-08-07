import { getDevId } from '@/utils';
import { getShareLinkDetail, createSttShareLink } from './commonHighway';
import { AtopGetShareLinkDetailRes } from './interface';

interface AtopGetSttShareLinkV3Req {
  key: string; // 音频 ID 或 recordId
  exportType: 'TRANSCRIPTION' | 'SUMMARY'; // 导出内容类型（转写/总结）
  format: 'pdf' | 'docx' | 'md' | 'jpg'; // 导出文件类型
  contentOption?: 'ORIGINAL' | 'TRANSLATION' | 'ORIGINAL_AND_TRANSLATION'; // 导出内容选择（原文、译文、原文和译文）
  paragraphTime?: boolean; // 是否包含段落时间
  speakerLabel?: boolean; // 是否包含说话人标签
}

const SHARE_FORMAT_MAP: Record<AtopGetSttShareLinkV3Req['format'], string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  md: 'MARKDOWN',
  jpg: 'JPG',
};

/**
 * 创建分享文件并直接返回下载链接（1天有效期）
 * @tuya-miniapp/cloud-api getShareFileLinkV3：body 扁平字段
 */
export const atopGetSttShareLinkV3 = ({
  key,
  exportType,
  format,
  contentOption,
  paragraphTime,
  speakerLabel,
}: AtopGetSttShareLinkV3Req) => {
  return createSttShareLink({
    key,
    exportType,
    format: SHARE_FORMAT_MAP[format] || format,
    devId: getDevId(),
    contentOption,
    paragraphTime,
    speakerLabel,
  });
};

/** 获取分享链接详情（@tuya-miniapp/cloud-api queryShareLink） */
export const atopGetShareLinkDetail = (recordId: string) => {
  return getShareLinkDetail(recordId) as Promise<AtopGetShareLinkDetailRes>;
};
