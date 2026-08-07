import React, { FC, useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView } from '@ray-js/components';
import { router, setNavigationBarBack, usePageEvent } from '@ray-js/ray';
import { useSelector, useDispatch } from 'react-redux';
import { useRequest } from 'ahooks';

import { getDomClientRect } from '@/utils/dom';
import { RecordType, selectAudioFileByKey, updateRecordTask } from '@/redux/modules/audioFileSlice';
import { useAsrTransferQueue } from '@/hooks/useAsrTransferQueue';
import { handleTttError } from '@/utils/code';
import { tttGetRecordTransferRealTimeResult } from '@/api/ttt';
import { parseRealTimerResult } from '@/utils/recording';
import { usePageReShow } from '@/hooks/usePageReShow';
import Strings from '@/i18n';

import styles from './index.module.less';

interface IProps {
  deviceId: string;
  activeType?: string;
  isSplitScreen?: boolean; // 是否开启分屏
  scrollHeight?: number;
  recordType?: RecordType;
  onCallEnd?: () => void;
}

// activeType 到 channel 的映射
const activeTypeChannelMap: Record<string, number> = {
  left: 0,
  right: 1,
};

const DualChannelASRList: FC<IProps> = props => {
  const { deviceId, activeType, isSplitScreen, scrollHeight = 450, recordType, onCallEnd } = props;
  const dispatch = useDispatch();
  const task = useSelector(selectAudioFileByKey('task'));
  const [scrollTop, setScrollTop] = useState(0);
  const [isCallEnd, setIsCallEnd] = useState(false); // 通话是否结束

  // New state for scroll control
  const [stopScroll] = useState(false);
  const lastScrollTopRef = useRef(0);
  const prevContentHeightRef = useRef(0);
  // 保持最新的 activeType，避免事件回调闭包读取到旧值
  const activeTypeRef = useRef(activeType);
  const recordTypeRef = useRef(recordType);
  useEffect(() => {
    activeTypeRef.current = activeType;
    recordTypeRef.current = recordType;
  }, [activeType, recordType]);

  // 使用队列 hooks
  const { textList, pushEvent, resetTextList, loadMorePrev, loadMoreNext, hasMore } =
    useAsrTransferQueue();

  // 获取实时转写结果
  const { run: getRecordTransferRealTimeResult } = useRequest(tttGetRecordTransferRealTimeResult, {
    manual: true,
    onSuccess: res => {
      const list = parseRealTimerResult(res);
      if (list?.length) {
        resetTextList(list);
      }
    },
  });

  const handleRecordFinishEvent = d => {
    console.warn('====onRecordFinishEvent===', d);
    if (d.deviceId !== deviceId) return;
    const { code } = d;
    if (code === 0) return; // 0为正常结束
    handleTttError(d, true);
    dispatch(updateRecordTask());

    // Recording 页面 TopBar 设置了 navigationBar 为 custom，会拦截系统返回，需先恢复 system
    setNavigationBarBack({ type: 'system' });
    // 与 showToast 分离一帧，避免 toast 与 navigateBack 竞态导致跳转被吞
    setTimeout(() => {
      router.back();
    }, 0);
  };

  // 直接 pushEvent 入队，由 useAsrTransferQueue 统一处理
  const handleRecordTransferRealTimeRecognizeStatusUpdateEvent = d => {
    const { errorCode, channel } = d;
    if (errorCode === 10002 || errorCode === '10002') {
      ty.showToast({ title: Strings.getLang('error_not_supported'), icon: 'error' });
      destroyEvent();
      setTimeout(() => {
        router.back();
      }, 0);
      return;
    }
    // 通话翻译电话挂断，弹出提示框
    if (recordTypeRef.current === RecordType.CallTranslation && errorCode === 10022) {
      destroyEvent();
      setIsCallEnd(true);
      return;
    }
    // 设备离线，不处理
    if (errorCode === 10083) return;

    if (!handleTttError(d, true)) {
      return;
    }
    // 只入队，具体处理交由 useRealTimeTextQueue
    // 兼容 activeType 传递 channel：left -> 0, right -> 1，否则使用原 channel
    const finalChannel =
      activeTypeRef.current && activeTypeChannelMap[activeTypeRef.current] !== undefined
        ? activeTypeChannelMap[activeTypeRef.current]
        : channel;

    pushEvent({
      ...d,
      channel: finalChannel,
    });
  };

  // 监听 textList 变化，处理高度保持
  // useEffect(() => {
  //   if (isPreLoadingRef.current) {
  //     // 稍微延时等待渲染
  //     const timer = setTimeout(async () => {
  //       let height = 0;
  //       textList?.forEach(item => {
  //         height += (item?.text?.length / 50) * 30 + 20 * 2 + 50;
  //       });
  //       setScrollTop(height);
  //       isPreLoadingRef.current = false;
  //     }, 100);

  //     return () => clearTimeout(timer);
  //   }
  // }, [textList, isSplitScreen]);

  // 设置scrollTop, 滚动到最底部
  const rafIdRef = useRef<number>(0 as unknown as number);
  const pendingScrollTopRef = useRef<number | null>(null);
  const handleScrollToBottom = useCallback(() => {
    // 使用递增的方式，确保每次都能触发滚动到底部
    lastScrollTopRef.current += 10000;
    pendingScrollTopRef.current = lastScrollTopRef.current;
    if (!rafIdRef.current) {
      // @ts-ignore
      const raf = ((cb: any) => setTimeout(cb, 16)) as any;
      rafIdRef.current = raf(() => {
        if (pendingScrollTopRef.current != null) {
          setScrollTop(pendingScrollTopRef.current);
          pendingScrollTopRef.current = null;
        }
        rafIdRef.current = 0 as unknown as number;
      });
    }
  }, []);

  useEffect(() => {
    if (stopScroll || !textList?.length) return;
    // 如果还有下一页（处于历史记录中），不自动滚动到底部
    // if (hasMore.next) return;

    handleScrollToBottom();
  }, [textList, handleScrollToBottom, hasMore.next]);

  const handleLoadMorePrev = useCallback(async () => {
    // console.log('isPreLoadingRef.current::', isPreLoadingRef.current)
    // if (isPreLoadingRef.current) return;
    if (!hasMore.prev) return;

    // isPreLoadingRef.current = true;

    // 获取当前内容列表高度
    try {
      const id = isSplitScreen ? 'split-left-wrapper' : 'single-content-wrapper';
      const rect = await getDomClientRect(id);
      // console.log('滚动区域：：：：：', rect);
      if (rect) {
        prevContentHeightRef.current = rect.height;
      }
    } catch (e) {
      console.warn('getDomClientRect error', e);
    }

    loadMorePrev();
  }, [loadMorePrev, hasMore.prev, isSplitScreen]);

  const handleOnScrollToLower = useCallback(() => {
    // setStopScroll(false);
    if (hasMore.next) {
      loadMoreNext();
    }
  }, [hasMore.next, loadMoreNext]);

  // TODO：如果滚动到了中间，阅读模式下，不自动滚动
  // const handleOnScroll = useMemo(
  //   () =>
  //     throttle(e => {
  //       const { scrollTop, scrollHeight } = e.detail;
  //       const containerHeight = props.scrollHeight || contentHeight;
  //       const clientHeight = isSplitScreen ? (contentHeight - 29) / 2 : containerHeight;

  //       const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
  //       if (isAtBottom) {
  //         setStopScroll(false);
  //       } else {
  //         if (scrollTop < scrollHeight) {
  //           setStopScroll(true);
  //         }
  //       }
  //     }, 100),
  //   [contentHeight, props.scrollHeight, isSplitScreen]
  // );

  const destroyEvent = () => {
    // @ts-ignore
    ty.wear.offRecordTransferFinishEvent();
    // @ts-ignore
    ty.wear.offRecordTransferRealTimeRecognizeStatusUpdateEvent();
  };

  // 通话翻译结束通话提示
  useEffect(() => {
    if (isCallEnd && recordType === RecordType.CallTranslation) {
      onCallEnd?.();
      setIsCallEnd(false);
    }
  }, [isCallEnd, recordType, onCallEnd]);

  usePageEvent('onShow', () => {
    ty.wear.onRecordTransferFinishEvent(handleRecordFinishEvent);
    ty.wear.onRecordTransferRealTimeRecognizeStatusUpdateEvent(
      handleRecordTransferRealTimeRecognizeStatusUpdateEvent
    );
  });

  // 页面重新显示，获取历史实时转写结果
  usePageReShow(() => {
    if (!task?.recordId) return;
    getRecordTransferRealTimeResult({
      recordId: task?.recordId,
    });
  });

  // 页面隐藏，移除事件监听
  usePageEvent('onHide', () => {
    destroyEvent();
  });

  useEffect(() => {
    return () => {
      destroyEvent();
    };
  }, []);

  return (
    <View className={styles.container}>
      <View className={styles.content}>
        {isSplitScreen ? (
          <View
            className={styles.splitScreenBox}
            style={{
              height: `${scrollHeight}px`,
            }}
          >
            <ScrollView
              className={styles.sliptScreenScrollTop}
              // @ts-ignore
              hideScrollbar
              style={{
                height: `${(scrollHeight - 29) / 2}px`,
              }}
              refresherTriggered={false}
              scrollY
              scrollTop={scrollTop}
              onScrollToUpper={handleLoadMorePrev}
              upperThreshold={50}
              onScrollToLower={handleOnScrollToLower}
              // onScroll={handleOnScroll}
            >
              <View id="split-right-wrapper">
                {textList
                  .filter(item => item.channel !== 0)
                  .map(({ text, id }, index) => {
                    if (!text) return null;
                    const textArr = text.split('\n');
                    return (
                      <View key={id} className={styles.rightTextBox}>
                        <Text id={`faceToface-t1-${index}`} className={styles.originText}>
                          {textArr[0] || ''}
                        </Text>
                        <Text id={`faceToface-b1-${index}`} className={styles.transText}>
                          {textArr[1] || ''}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </ScrollView>
            {textList?.length > 0 && <View className={styles.splitLine} />}
            <ScrollView
              className={styles.sliptScreenScrollBtm}
              // @ts-ignore
              hideScrollbar
              style={{
                height: `${(scrollHeight - 29) / 2}px`,
              }}
              refresherTriggered={false}
              scrollY
              scrollTop={scrollTop}
              onScrollToUpper={handleLoadMorePrev}
              upperThreshold={50}
              onScrollToLower={handleOnScrollToLower}
              // onScroll={handleOnScroll}
            >
              <View id="split-left-wrapper">
                {textList
                  .filter(item => item.channel === 0)
                  .map(({ text, id }, index) => {
                    if (!text) return null;
                    const textArr = text.split('\n');
                    return (
                      <View key={id} className={styles.leftTextBox}>
                        <Text id={`faceToface-t1-${index}`} className={styles.originText}>
                          {textArr[0] || ''}
                        </Text>
                        <Text id={`faceToface-b1-${index}`} className={styles.transText}>
                          {textArr[1] || ''}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </ScrollView>
          </View>
        ) : (
          <ScrollView
            className={styles.scroll}
            // @ts-ignore
            hideScrollbar
            style={{
              height: `${scrollHeight}px`,
            }}
            refresherTriggered={false}
            scrollY
            scrollTop={scrollTop}
            onScrollToUpper={handleLoadMorePrev}
            upperThreshold={100}
            onScrollToLower={handleOnScrollToLower}
            // onScroll={handleOnScroll}
          >
            <View id="single-content-wrapper">
              {textList.map(({ channel, text, id }, index) => {
                if (!text) return null;
                const textArr = text.split('\n');
                const isCallTranslation = recordType === RecordType.CallTranslation;
                if (isCallTranslation ? channel === 1 : channel === 0) {
                  return (
                    <View key={id} className={styles.leftTextBox}>
                      <Text id={`faceToface-t-${index}`} className={styles.originText}>
                        {textArr[0] || ''}
                      </Text>
                      <Text id={`faceToface-b-${index}`} className={styles.transText}>
                        {textArr[1] || ''}
                      </Text>
                    </View>
                  );
                }
                return (
                  <View key={id} className={styles.rightTextBox}>
                    <Text id={`faceToface-t-${index}`} className={styles.originText}>
                      {textArr[0] || ''}
                    </Text>
                    <Text id={`faceToface-b-${index}`} className={styles.transText}>
                      {textArr[1] || ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default React.memo(DualChannelASRList);
