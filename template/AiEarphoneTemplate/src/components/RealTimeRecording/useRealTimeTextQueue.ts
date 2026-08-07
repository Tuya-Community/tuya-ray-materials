import { useRef, useState, useEffect, useCallback } from 'react';
import { isJsonString } from '@/utils';

export interface RealTimeTextItem {
  id: string;
  text: string;
}

const PAGE_SIZE = 30;

export function useRealTimeTextQueue(isPaused = false) {
  // const MAX_ITEMS = 200; // 🎯 性能优化：最多保留 200 条，超出时移除最旧的数据和 DOM
  const [preText, setPreText] = useState<string>(''); // 上一轮的文本
  const [textList, setTextList] = useState<RealTimeTextItem[]>([]);
  const [hasMore, setHasMore] = useState({ prev: false, next: false });

  const queueRef = useRef<any[]>([]);
  const textMapRef = useRef<Map<string, string>>(new Map()); // 🎯 使用 Map 提升查找性能
  const orderRef = useRef<string[]>([]); // 🎯 维护 ID 顺序，避免全量重建
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rangeRef = useRef({ start: 0, end: 0 }); // 可视区域范围
  const lockScrollRef = useRef(false);

  const setLockScroll = useCallback((locked: boolean) => {
    lockScrollRef.current = locked;
  }, []);

  // 更新展示列表
  const updateTextList = useCallback(() => {
    const { start, end } = rangeRef.current;
    const sliceIds = orderRef.current.slice(start, end);

    const newList = sliceIds.map(id => ({
      id,
      text: textMapRef.current.get(id) || ''
    }));

    setTextList(prev => {
      // 尝试复用对象
      // 判断长度若小于prev，则复用对象，避免吞句
      if (newList.length < prev.length) {
        return prev;
      }

      return newList.map(item => {
        const prevItem = prev.find(p => p.id === item.id);
        if (prevItem && prevItem.text === item.text) {
          return prevItem;
        }
        return item;
      });
    });

    setHasMore({
      prev: start > 0,
      next: end < orderRef.current.length
    });
  }, []);

  // 加载上一页
  const loadMorePrev = useCallback(() => {
    const { start, end } = rangeRef.current;
    if (start <= 0) return;
    const newStart = Math.max(0, start - PAGE_SIZE);
    // 保持 end 不变，向上扩展？或者平移？这里选择向上扩展，让用户看到更多历史
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

  // 消费队列 - 优化：只处理变化的项，避免全量重建 + 限制最大条数
  const consumeQueue = useCallback(() => {
    if (queueRef.current.length === 0) return;
    const changedIds = new Set<string>();
    const oldTotal = orderRef.current.length;

    while (queueRef.current.length) {
      const d = queueRef.current.shift();
      const { requestId, text, translateText } = d;

      if (!requestId || (!text && !translateText)) continue;

      const prevAll = textMapRef.current.get(requestId) || '';
      const [prevOriginal = '', prevTranslation = ''] = prevAll.split('\n');

      // 更新原文
      const currentOriginal = (text && text.trim()) ? text : prevOriginal;

      // 更新翻译
      let currentTranslation = prevTranslation;
      if (translateText && translateText.trim()) {
        // 处理翻译文本格式
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
      if (newText !== prevAll) {
        textMapRef.current.set(requestId, newText);
        changedIds.add(requestId);

        // 维护顺序：新 ID 加入顺序表
        if (!orderRef.current.includes(requestId)) {
          orderRef.current.push(requestId);
        }
      }
    }

    if (changedIds.size > 0) {
      const newTotal = orderRef.current.length;

      // 自动跟随逻辑：如果之前在底部，且没有锁定滚动，则保持在底部
      if (rangeRef.current.end === oldTotal && !lockScrollRef.current) {
        rangeRef.current.end = newTotal;

        // 实时更新时，如果超过一页，移除顶部数据保持窗口大小（避免实时渲染过多）
        // 用户可以通过加载上一页查看历史
        if (rangeRef.current.end - rangeRef.current.start > PAGE_SIZE) {
          rangeRef.current.start = rangeRef.current.end - PAGE_SIZE;
        }
      }

      if (!isPaused) {
        updateTextList();
      }
    }
  }, [updateTextList, isPaused]);

  // 监听暂停状态解除，立即更新一次
  useEffect(() => {
    if (!isPaused) {
      updateTextList();
    }
  }, [isPaused, updateTextList]);

  // 定时消费
  useEffect(() => {
    timerRef.current = setInterval(consumeQueue, 350);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [consumeQueue]);

  // 入队方法
  const pushEvent = useCallback((d: any) => {
    queueRef.current.push(d);
  }, []);

  // 重置
  const resetTextList = useCallback((list: RealTimeTextItem[]) => {
    textMapRef.current.clear();
    orderRef.current = [];

    // 不再移除旧数据，保留所有
    list.forEach(item => {
      textMapRef.current.set(item.id, item.text);
      orderRef.current.push(item.id);
    });

    const total = list.length;
    // 初始只显示最后 PAGE_SIZE 条
    const start = Math.max(0, total - PAGE_SIZE);
    rangeRef.current = { start, end: total };

    updateTextList();
    setPreText('');
  }, [updateTextList]);

  // 清空
  const clear = useCallback(() => {
    queueRef.current = [];
    textMapRef.current.clear();
    orderRef.current = [];
    rangeRef.current = { start: 0, end: 0 };
    setTextList([]);
    setPreText('');
  }, []);

  return {
    textList,
    preText,
    pushEvent,
    resetTextList,
    setPreText,
    clear,
    loadMorePrev,
    loadMoreNext,
    hasMore,
    setLockScroll,
    jumpToBottom,
  };
}
