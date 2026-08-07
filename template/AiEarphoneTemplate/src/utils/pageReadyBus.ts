import { useEffect } from 'react';
import { usePageEvent } from '@ray-js/ray';
import EventEmitter from './emitter';

type PageReadyEvent = 'page-ready';

type PageReadyPayload = { path?: string; time: number };

export const pageReadyBus = new EventEmitter<PageReadyEvent>();

/** 最近一次 page-ready（设备面板下 children 可能晚于页面 onReady 挂载，需粘性读取） */
let lastPageReady: PageReadyPayload | null = null;

/**
 * @brief Emit page ready and remember sticky state
 * @param path page path, e.g. /home
 * @return none
 */
export const emitPageReady = (path?: string) => {
  lastPageReady = { path, time: Date.now() };
  pageReadyBus.emit('page-ready', lastPageReady);
};

/**
 * @brief Get last emitted page-ready payload
 * @return last payload or null
 */
export const getLastPageReady = (): PageReadyPayload | null => lastPageReady;

/**
 * @brief Whether page-ready has been emitted for path (or any path if omitted)
 * @param path optional path to match
 * @return true if already emitted
 */
export const hasPageReadyEmitted = (path?: string): boolean => {
  if (!lastPageReady) {
    return false;
  }
  if (!path) {
    return true;
  }
  return lastPageReady.path === path;
};

/**
 * @brief Emit page-ready on native onReady, and on mount as fallback for device panel
 * @param path page path
 * @param onReady optional extra callback when native onReady fires
 * @return none
 * @note App may mount page children after the host page onReady already fired.
 */
export const useEnsurePageReady = (path: string, onReady?: () => void) => {
  usePageEvent('onReady', () => {
    onReady?.();
    emitPageReady(path);
  });

  useEffect(() => {
    emitPageReady(path);
  }, [path]);
};
