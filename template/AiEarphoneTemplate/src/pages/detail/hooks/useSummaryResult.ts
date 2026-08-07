import { useState } from 'react';
import { useRequest } from 'ahooks';
import { RecordTransferResultDetail } from '@/api/ttt.interface';
import {
  tttGetRecordTransferSummaryResult,
  tttSaveRecordTransferSummaryResult,
  tttUpdateFile,
} from '@/api/ttt';
import { atopAudioSummaryEdit } from '@/api/common';
import { SummaryStatus, SummaryImageStatus } from '@/constant/enums';
import { OutlineItem } from '@/types/file';

/**
 * 总结结果管理Hook
 * 负责获取、处理和管理总结结果数据
 *
 * @param fileDetailRef - 文件详情引用
 * @param fileDetail - 文件详情数据
 * @param refreshFileDetail - 刷新文件详情的方法
 * @param setSummaryLoading - 设置总结和思维导图tab骨架屏状态的函数
 * @returns {Object} 总结结果状态和方法
 * @property {string} summaryData - 总结内容
 * @property {Function} setSummaryData - 设置总结内容
 * @property {Array} question - 预设问题列表
 * @property {Function} setQuestion - 设置问题列表
 * @property {OutlineItem[]} outlineList - 章节列表
 * @property {Function} setOutlineList - 设置章节列表
 * @property {boolean} summaryResultLoading - 总结结果加载状态
 * @property {Function} setSummaryResultLoading - 设置加载状态
 * @property {Function} getSummaryResult - 获取总结结果
 * @property {Function} updateSummary - 更新总结信息
 */
export const useSummaryResult = (
  fileDetailRef: React.MutableRefObject<RecordTransferResultDetail | null>,
  fileDetail: RecordTransferResultDetail | undefined,
  refreshFileDetail: () => Promise<any>,
  setSummaryLoading: (loading: boolean) => void
) => {
  const [summaryData, setSummaryData] = useState('');
  const [question, setQuestion] = useState([]);
  const [outlineList, setOutlineList] = useState<OutlineItem[]>([]);
  const [summaryResultLoading, setSummaryResultLoading] = useState(false);
  const [summaryImageUrl, setSummaryImageUrl] = useState('');

  /**
   * 处理总结数据
   */
  const processSummaryData = async (text: string) => {
    try {
      const data: any = JSON.parse(text);
      setSummaryData(data?.summary || '');
      // 仅在信息图已生成完成时（首次加载）从接口恢复 imageUrl；
      // 重新总结时（Generating/Initial），由 partial update 推送新 URL，避免恢复旧图导致闪烁
      if (fileDetailRef.current?.summaryImageStatus === SummaryImageStatus.Complete) {
        setSummaryImageUrl(data?.imageUrl || '');
      }
      const outlineList = data?.outline ? JSON.parse(data?.outline) : [];
      setOutlineList(outlineList);
      const questionList = data?.question ? JSON.parse(data?.question) : [];
      setQuestion(questionList);

      // 有总结标题的话更新文件名, 同时需要更新本地和云端的总结标题
      if (data?.title && data.title !== fileDetailRef.current?.name) {
        updateSummary({
          title: data.title,
          summary: data.summary,
          updateCloud: false,
        });
      }
    } catch {
      // ignore summary parse/update failure
    }
  };

  /**
   * 获取总结结果
   */
  const fetchRecordSummaryResult = async () => {
    if (!fileDetailRef.current) return undefined;
    const { summary, recordTransferId } = fileDetailRef.current;

    if (summary === SummaryStatus.Success) {
      // 获取客户端本地总结数据
      const result = await tttGetRecordTransferSummaryResult({
        recordTransferId,
        from: 0,
      });

      return result;
    }
    return undefined;
  };

  const { runAsync: getSummaryResult } = useRequest(fetchRecordSummaryResult, {
    manual: true,
    onSuccess: res => {
      if (res?.text) {
        processSummaryData(res.text);
      }
    },
    onFinally: () => {
      setSummaryResultLoading(false);
      // 总结接口返回后，总是取消总结和思维导图tab的骨架屏
      setSummaryLoading(false);
    },
  });

  /**
   * 更新总结信息
   */
  const updateSummary = async (params: {
    title: string;
    summary?: string;
    updateCloud?: boolean;
  }) => {
    const { title, summary, updateCloud = true } = params;
    const summaryText = JSON.stringify({
      title,
      summary: summary || summaryData,
    });

    try {
      // 更新文件名
      if (title && title !== fileDetailRef.current?.name) {
        const { recordTransferId } = fileDetailRef.current;
        await tttUpdateFile({
          name: title,
          recordTransferId,
        });
        // updateRecordTransferResultList();
      }

      // 需要同时更新本地和云端的总结
      await tttSaveRecordTransferSummaryResult({
        recordTransferId: fileDetailRef.current?.recordTransferId,
        text: summaryText,
      });

      if (updateCloud) {
        await atopAudioSummaryEdit({
          key: fileDetailRef.current?.recordId,
          content: summaryText,
        });
      }
    } catch (error) {
      console.error('updateSummary error', error);
    }
  };

  return {
    summaryData,
    setSummaryData,
    question,
    setQuestion,
    outlineList,
    setOutlineList,
    summaryResultLoading,
    setSummaryResultLoading,
    getSummaryResult,
    updateSummary,
    summaryImageUrl,
    setSummaryImageUrl,
  };
};
