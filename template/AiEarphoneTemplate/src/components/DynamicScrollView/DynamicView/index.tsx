import React, { useState, useRef, useEffect } from 'react';
import { usePageInstance, View } from '@ray-js/ray';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { defaultProps, IProps } from './props';

const classPrefix = 'rayui-recycle-dynamic-view';

const Template: React.FC<IProps> = props => {
  const {
    className,
    style,
    children,
    chunkId,
    wrapperId,
    rootMargin,
    renderSkeleton,
    scrollHeight,
    chunkIndex,
    immediateShow = false,
  } = props;

  const [height, setHeight] = useState(0);
  // 如果immediateShow为true，则立即显示内容；否则等待IntersectionObserver触发
  const [showChunk, setShowChunk] = useState(immediateShow);

  // 新增: 延迟展示相关
  const pendingShowRef = useRef(immediateShow);
  const debounceShowRef = useRef<ReturnType<typeof debounce>>();
  const SCROLL_IDLE_DELAY = 100; // ms 滚动空闲判定

  const chunkObserverRef = useRef(null);
  const page = usePageInstance();

  useEffect(() => {
    // 创建防抖函数
    debounceShowRef.current = debounce(() => {
      setShowChunk(pendingShowRef.current);
    }, SCROLL_IDLE_DELAY);

    startObserverChunk();

    return () => {
      try {
        if (chunkObserverRef.current) chunkObserverRef.current.disconnect();
      } catch {
      }
      chunkObserverRef.current = null;
      debounceShowRef.current?.cancel();
    };
  }, []);

  const startObserverChunk = () => {
    try {
      chunkObserverRef.current = page.createIntersectionObserver();
      chunkObserverRef.current
        .relativeTo(`#${wrapperId}`, {
          bottom: rootMargin,
          top: rootMargin,
          // threshold: [0, 0.25, 0.5, 0.75, 1],
        })
        .observe(`#${chunkId}`, res => {
          const { intersectionRatio, boundingClientRect } = res;

          if (intersectionRatio <= 0) {
            // 离开：立即缓存高度并隐藏，取消等待的显示
            setHeight(boundingClientRect.height);
            if (pendingShowRef.current) setShowChunk(false);
            pendingShowRef.current = false;
            debounceShowRef.current?.cancel();
          } else {
            // 进入：不立即渲染，记录意图并等待滚动停止
            pendingShowRef.current = true;
            debounceShowRef.current?.();
          }
        });
    } catch {
    }
  };

  return (
    <View
      id={chunkId}
      className={clsx(classPrefix, className)}
      style={{ minHeight: `${height}px`, ...style }}
    >
      {showChunk ? <>{children}</> : renderSkeleton ? <>{renderSkeleton(Number(height))}</> : null}
    </View>
  );
};

Template.defaultProps = defaultProps;
Template.displayName = 'RecycleDynamicView';

export default React.memo(Template);
