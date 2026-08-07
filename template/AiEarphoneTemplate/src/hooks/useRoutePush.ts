import { useEffect, useCallback } from 'react';
import { router, getCurrentPages } from '@ray-js/ray';
import { registerChannel, onReceiveMessage } from '@ray-js/api';

// 路由推送类型常量
const PUSH_TYPE = {
  RECORD_TRANSCRIBE: 'RecordTranscribe',
  AUDIO_RECORD_INTERRUPTION: 'AudioRecordInterruption',
  AudioRecordQuickStartRouter: 'AudioRecordQuickStart',
  AudioRecordShareImport: 'AudioRecordShareImport',
} as const;

type PushRouteInfoParams = {
  pushType: string;
  recordId: string;
  tab: string;
  extraInfo: string;
};

/**
 * 处理路由推送的 hook
 */
export const useRoutePush = () => {
  // 处理路由推送事件
  const handleRoutePush = useCallback((res: PushRouteInfoParams) => {
    const { pushType } = res || {};

    let extraInfo: Record<string, string> = {};
    try {
      extraInfo = res?.extraInfo ? JSON.parse(res.extraInfo) : {};
    } catch {
      // extraInfo 解析失败,忽略
    }
    const utmParams = [
      extraInfo.utm_source ? `utm_source=${extraInfo.utm_source}` : '',
      extraInfo.utm_medium ? `utm_medium=${extraInfo.utm_medium}` : '',
    ]
      .filter(Boolean)
      .join('&');

    switch (pushType) {
      case PUSH_TYPE.RECORD_TRANSCRIBE: {
        // 跳转到详情页（转录记录）
        const { recordId, tab } = res || {};
        const detailUrl = `/detail?tab=${tab}&recordId=${recordId}${
          utmParams ? `&${utmParams}` : ''
        }`;
        router.push(detailUrl);
        break;
      }
      case PUSH_TYPE.AUDIO_RECORD_INTERRUPTION:
      case PUSH_TYPE.AudioRecordQuickStartRouter: {
        // 跳转到录音模式页（录音中断）
        const pages = getCurrentPages();
        const curPage = pages[pages.length - 1].route;
        if (curPage !== 'pages/recordingMode/index') {
          const recordUrl = `/recordingMode${utmParams ? `?${utmParams}` : ''}`;
          router.push(recordUrl);
        }
        break;
      }
      case PUSH_TYPE.AudioRecordShareImport: {
        // 其他 App 分享音频导入时，若不在首页则跳转到首页
        const pages = getCurrentPages();
        const curPage = pages[pages.length - 1].route;
        if (curPage !== 'pages/home/index' && curPage !== '/') {
          const homeUrl = `/${utmParams ? `?${utmParams}` : ''}`;
          router.replace(homeUrl);
        }
        break;
      }
      default:
        // 未知的推送类型，不做处理
        break;
    }
  }, []);

  useEffect(() => {
    // 注册通道
    registerChannel({
      eventName: 'router_to_detail',
    });

    // 监听事件
    onReceiveMessage(res => {
      if (res?.event) {
        const { tab, recordId } = res.event || ({} as any);
        router.push(`/detail?tab=${tab}&recordId=${recordId}`);
      }
    });

    // 监听路由推送事件
    // @ts-ignore
    ty.wear?.onPushRouteInfoEvent?.(handleRoutePush);

    return () => {
      // @ts-ignore
      ty.wear?.offPushRouteInfoEvent?.(handleRoutePush);
    };
  }, [handleRoutePush]);
};
