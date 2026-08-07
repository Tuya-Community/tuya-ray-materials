import { useRef, useState, useEffect, useCallback } from 'react';
import { isJsonString } from '@/utils';

export interface RealTimeTextItem {
  id: string;
  text: string;
  channel?: number;
}

const PAGE_SIZE = 20;

export function useAsrTransferQueue() {
  const [textList, setTextList] = useState<RealTimeTextItem[]>([]);
  const [hasMore, setHasMore] = useState({ prev: false, next: false });

  const queueRef = useRef<any[]>([]);
  const textMapRef = useRef<Map<string, { text: string; channel?: number }>>(new Map());
  const orderRef = useRef<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rangeRef = useRef({ start: 0, end: 0 });
  const lockScrollRef = useRef(false);

  const setLockScroll = useCallback((locked: boolean) => {
    lockScrollRef.current = locked;
  }, []);

  // 更新展示列表
  const updateTextList = useCallback(() => {
    const { start, end } = rangeRef.current;
    const sliceIds = orderRef.current.slice(start, end);

    const newList = sliceIds.map(id => {
      const item = textMapRef.current.get(id);
      return {
        id,
        text: item?.text || '',
        channel: item?.channel,
      };
    });

    setTextList(prev => {
      // 尝试复用对象
      return newList.map(item => {
        const prevItem = prev.find(p => p.id === item.id);
        if (prevItem && prevItem.text === item.text && prevItem.channel === item.channel) {
          return prevItem;
        }
        return item;
      });
    });

    setHasMore({
      prev: start > 0,
      next: end < orderRef.current.length,
    });
  }, []);

  // 加载上一页
  const loadMorePrev = useCallback(() => {
    const { start, end } = rangeRef.current;
    if (start <= 0) return;
    const newStart = Math.max(0, start - PAGE_SIZE);
    rangeRef.current = { start: newStart, end };
    updateTextList();
  }, [updateTextList]);

  // 加载下一页
  const loadMoreNext = useCallback(() => {
    const { start, end } = rangeRef.current;
    const total = orderRef.current.length;
    if (end >= total) return;
    const newEnd = Math.min(total, end + PAGE_SIZE);
    rangeRef.current = { start, end: newEnd };
    updateTextList();
  }, [updateTextList]);

  // 强制跳到底部
  const jumpToBottom = useCallback(() => {
    const total = orderRef.current.length;
    const start = Math.max(0, total - PAGE_SIZE);
    rangeRef.current = { start, end: total };
    updateTextList();
  }, [updateTextList]);

  // 消费队列
  const consumeQueue = useCallback(() => {
    if (queueRef.current.length === 0) return;
    const changedIds = new Set<string>();
    const oldTotal = orderRef.current.length;

    while (queueRef.current.length) {
      const d = queueRef.current.shift();
      const { requestId, text, translateText, channel } = d;
      if (requestId && (text || translateText)) {
        // 支持 channel 逻辑
        let resolvedChannel = channel;
        if (typeof channel === 'undefined' && d.activeType) {
          resolvedChannel = d.activeType === 'left' ? 0 : d.activeType === 'right' ? 1 : undefined;
        }

        const prevObj = textMapRef.current.get(requestId) || { text: '' };
        const [prevOriginal = '', prevTranslation = ''] = prevObj?.text?.split('\n');

        // 更新原文
        const currentOriginal = text && text.trim() ? text : prevOriginal;

        // 更新翻译
        let currentTranslation = prevTranslation;
        if (translateText && translateText.trim()) {
          if (isJsonString(translateText)) {
            try {
              const parsed = JSON.parse(translateText);
              currentTranslation = Array.isArray(parsed)
                ? parsed.join('').replace(/\n/g, '')
                : String(parsed).replace(/\n/g, '');
            } catch {
              currentTranslation = translateText.replace(/\n/g, '');
            }
          } else {
            currentTranslation = translateText.replace(/\n/g, '');
          }
        }

        // 构建新文本
        const newText = currentTranslation
          ? `${currentOriginal}\n${currentTranslation}`
          : currentOriginal;

        // 检查是否需要更新
        if (newText !== prevObj?.text) {
          textMapRef.current.set(requestId, {
            text: newText,
            channel: resolvedChannel ?? prevObj.channel,
          });
          changedIds.add(requestId);

          if (!orderRef.current.includes(requestId)) {
            orderRef.current.push(requestId);
          }
        }
      }
    }

    if (changedIds.size > 0) {
      const newTotal = orderRef.current.length;

      // 自动跟随逻辑
      if (rangeRef.current.end === oldTotal && !lockScrollRef.current) {
        rangeRef.current.end = newTotal;
        if (rangeRef.current.end - rangeRef.current.start > PAGE_SIZE) {
          rangeRef.current.start = rangeRef.current.end - PAGE_SIZE;
        }
      }

      updateTextList();
    }
  }, [updateTextList]);

  useEffect(() => {
    timerRef.current = setInterval(consumeQueue, 200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [consumeQueue]);

  // 入队方法
  const pushEvent = useCallback((d: any) => {
    queueRef.current.push(d);
  }, []);

  // 重置
  const resetTextList = useCallback(
    (list: RealTimeTextItem[]) => {
      textMapRef.current.clear();
      orderRef.current = [];

      list.forEach(item => {
        textMapRef.current.set(item.id, { text: item.text, channel: item.channel });
        orderRef.current.push(item.id);
      });

      const total = list.length;
      const start = Math.max(0, total - PAGE_SIZE);
      rangeRef.current = { start, end: total };

      updateTextList();
    },
    [updateTextList]
  );

  // 清空
  const clear = useCallback(() => {
    queueRef.current = [];
    textMapRef.current.clear();
    orderRef.current = [];
    rangeRef.current = { start: 0, end: 0 };
    setTextList([]);
  }, []);

  return {
    textList,
    pushEvent,
    resetTextList,
    clear,
    loadMorePrev,
    loadMoreNext,
    hasMore,
    setLockScroll,
    jumpToBottom,
  };
}
