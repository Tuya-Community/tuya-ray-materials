import { useRef } from 'react';
import { useRequest } from 'ahooks';
import { showToast, router } from '@ray-js/ray';
import { tttGetFilesDetail } from '@/api/ttt';
import { RecordTransferResultDetail } from '@/api/ttt.interface';
import { handleTttError } from '@/utils/code';
import Strings from '@/i18n';

/**
 * 文件详情管理Hook
 * 负责获取和管理文件详情数据
 *
 * @param recordId - 录音文件ID
 * @param from - 来源标识（如notification）
 * @returns {Object} 文件详情数据和操作方法
 * @property {RecordTransferResultDetail} fileDetail - 文件详情数据
 * @property {Function} getFileDetail - 获取文件详情
 * @property {Function} refreshFileDetail - 刷新文件详情
 * @property {Function} updateFileDetailLocal - 本地更新文件详情（不请求接口）
 * @property {React.MutableRefObject} fileDetailRef - 文件详情引用
 */
export const useFileDetail = (recordId: string, from?: string) => {
  const fileDetailRef = useRef<RecordTransferResultDetail>(null);
  const isLeavingRef = useRef(false);

  /**
   * 标记页面即将离开，阻止后续 MQTT 删除事件重复弹 toast
   */
  const markAsLeaving = () => {
    isLeavingRef.current = true;
  };

  /**
   * 文件不存在或被删除，返回首页
   */
  const handleBackToHome = (tip: string) => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    showToast({ title: tip, icon: 'error' });
    setTimeout(() => {
      router.replace('/');
    }, 1500);
  };

  // 获取录音转写详情数据
  const {
    data: fileDetail,
    runAsync: getFileDetail,
    refreshAsync: refreshFileDetail,
    mutate: mutateFileDetail,
  } = useRequest(params => tttGetFilesDetail(params, true), {
    manual: true,
    onSuccess: res => {
      if (!res) return;
      fileDetailRef.current = res;
    },
    onError: (err: any) => {
      const errorCode = err?.innerError?.errorCode;
      // 笔记在其他设备上（未开启云同步无法查看）：提示后返回首页
      if (errorCode === '10215') {
        handleBackToHome(Strings.getLang('file_code_10215'));
      } else if (from === 'notification' && errorCode === '10212') {
        // 通知栏点击进入，文件不存在，则直接提示, 再跳转首页
        handleBackToHome(Strings.getLang('file_code_10212'));
      } else {
        handleTttError(err);
      }
    },
  });

  /**
   * 本地更新文件详情（不请求接口）
   */
  const updateFileDetailLocal = (
    updater: (
      prev: RecordTransferResultDetail | undefined
    ) => RecordTransferResultDetail | undefined
  ) => {
    mutateFileDetail(prev => {
      const next = updater(prev);
      if (next) {
        fileDetailRef.current = next;
      }
      return next;
    });
  };

  return {
    fileDetail,
    getFileDetail,
    refreshFileDetail,
    updateFileDetailLocal,
    fileDetailRef,
    handleBackToHome,
    markAsLeaving,
  };
};
