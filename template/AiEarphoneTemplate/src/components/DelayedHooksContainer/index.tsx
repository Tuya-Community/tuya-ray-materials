import React, { useCallback } from 'react';
import { showToast } from '@ray-js/ray';
import { useRecordStatus } from '@/hooks/useRecordStatus';
import { useRoutePush } from '@/hooks/useRoutePush';
import { useSwitchConfig } from '@/hooks/useSwitchConfig';
import { useMenuButtonBounding } from '@/hooks/useMenuButtonBounding';
import { useThemeChange } from '@/hooks/useThemeChange';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useDpDataChange } from '@/hooks/useDpDataChange';
import { useDeviceInfoSync } from '@/hooks/useDeviceInfoSync';
import { useAgentInfo } from '@/hooks/useAgentInfo';
import { useSupportLangList } from '@/hooks/useSupportLangList';
import { useRecordTask } from '@/hooks/useRecordTask';
import { useAppInfo } from '@/hooks/useAppInfo';
import { useFileMergeStatus } from '@/hooks/useFileMergeStatus';
import { useAppDispatch } from '@/redux';
import { updateRecordTransferResultList } from '@/redux/modules/audioFileSlice';
import Strings from '@/i18n';
import type { FileMergeStatusEvent } from '@/api/ttt.interface';
import { getMergeErrorMsg } from '@/utils/file';
import { useAiNoteCardStatus } from '@/hooks/useAiNoteCardStatus';
import { usePartialRecordUpdate } from '@/hooks/usePartialRecordUpdate';
import { useOfflineFilesProgress } from '@/hooks/useOfflineFilesProgress';
import { useMqttChannel } from '@/hooks/useMqttChannel';

/**
 * 延迟加载的应用级别 hooks 容器组件
 * 注意：此组件仅用于调用 hooks，不渲染任何 UI。
 * 我们返回一个空的 Fragment。
 */
const DelayedHooksContainer: React.FC = () => {
  // 应用级别的配置
  useSwitchConfig();
  useMenuButtonBounding();
  useThemeChange();
  useAppInfo();
  // 用户
  useUserInfo();

  // 支持的语言列表
  useSupportLangList();

  // Agent
  useAgentInfo();

  // 设备
  useDeviceInfoSync();
  useDpDataChange();

  // 录音
  useRecordTask();
  useRecordStatus();

  // 路由
  useRoutePush();

  // 合并录音状态全局监听
  const dispatch = useAppDispatch();
  const handleGlobalMergeStatus = useCallback(
    (event: FileMergeStatusEvent) => {
      if (event.status === 2) {
        // 合并成功：提示并刷新首页文件列表
        showToast({ title: Strings.getLang('merge_success'), icon: 'none' });
        dispatch(updateRecordTransferResultList({ source: 'global_merge_success' }));
      } else if (event.status === 3) {
        // 异常结束，根据错误码显示对应提示
        showToast({
          title: getMergeErrorMsg(event.errorCode),
          icon: 'none',
        });
      }
    },
    [dispatch]
  );
  useFileMergeStatus(handleGlobalMergeStatus);
  // AI 笔记卡片状态
  useAiNoteCardStatus();

  // 全局唯一的"文件局部刷新"事件入口（首页/详情页统一通过 emitter 订阅）
  usePartialRecordUpdate();

  // 全局唯一的离线文件传输进度事件入口（首页/传输页统一通过 emitter 订阅）
  useOfflineFilesProgress();

  // 全局 MQTT 消息通道监听（协议号 8500）
  useMqttChannel();

  return <></>;
};

export default DelayedHooksContainer;
