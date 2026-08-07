import { useLayoutEffect, useRef } from 'react';
import { tttOperateRecordingFloat } from '@/api/ttt';
import { usePageEvent, router } from '@ray-js/ray';

/**
 * 控制app录音中悬浮球显示的 hook
 * 规则：在首页和录音页不显示悬浮球,其他页面显示悬浮球
 */
export const useAppFloatCtrl = (isVisible: boolean) => {
  usePageEvent('onShow', () => {
    // 页面显示时，根据传入的参数控制悬浮球显示或隐藏
    tttOperateRecordingFloat({ isVisible });
  })

  return tttOperateRecordingFloat;
};
