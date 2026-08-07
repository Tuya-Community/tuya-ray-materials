import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import { View, ScrollView } from '@ray-js/ray';
import { useVisibleRange, useSizeData } from './hooks';
import { IProps, IScrollProps, defaultProps } from './props';
import { throttle } from './utils';
import './index.less';

const DEFAULT_OVERSCAN_COUNT = 5;
const cssPrefix = 'ray-recycle-view_';

const RecycleView: React.FC<IProps & IScrollProps> = props => {
  const {
    data = [],
    renderEmpty,
    overScanCount = DEFAULT_OVERSCAN_COUNT,
    placeholderImage,
    wrapperStyle,
    renderHeader,
    fixedHeader,
    defaultItemHeight,
    renderBottom,
    renderExtraHeader,
    extraHeaderHeight = 0,
    headerHeight = 0,
    bottomHeight = 0,
    renderItem,
    onScroll,
    onItemClick,
    onItemLongPress,
    lowerThreshold = 100,
    scrollThrottleTime = 100,
    itemClass,
    ...scrollViewProps
  } = props;
  if (renderBottom && !bottomHeight) {
    throw new Error('renderBottom must be used with bottomHeight');
  }
  if (!renderBottom && bottomHeight) {
    throw new Error('bottomHeight must be used with renderBottom');
  }
  if (renderHeader && !headerHeight) {
    throw new Error('renderHeader must be used with headerHeight');
  }
  if (!renderHeader && headerHeight) {
    throw new Error('headerHeight must be used with renderHeader');
  }
  const [start, end, setRange] = useVisibleRange(overScanCount);

  // 计算列表总高度（不含 header/bottom，header 在 wrapper 外独立渲染）
  const LIST_HEIGHT = React.useMemo(() => {
    const totalHeight = data.reduce((acc, ele) => acc + (ele.height || defaultItemHeight), 0);
    return totalHeight;
  }, [data, defaultItemHeight]);

  const dataWithHeight = useMemo(
    () =>
      data.map((i, idx) => ({
        __index__: i.__index__ ?? idx,
        ...i,
        height: i.height ?? defaultItemHeight,
      })),
    [data, defaultItemHeight]
  );

  const sizeData = useSizeData(dataWithHeight);

  // 当前可见区域：slice O(visible) 替代 filter O(total)
  const visibleData = React.useMemo(
    () => dataWithHeight.slice(Math.max(0, start), Math.min(end + 1, dataWithHeight.length)),
    [dataWithHeight, start, end]
  );

  // dataWithHeight 的 ref 供事件代理 handler 读取，避免闭包捕获旧值
  const dataWithHeightRef = useRef(dataWithHeight);
  dataWithHeightRef.current = dataWithHeight;

  // 事件代理：整个 RecycleView 生命周期内只向 bridge 注册 2 条 handler（click + longpress）
  // 所有 item wrapper View 共享同一个函数引用，通过 dataset.idx 定位被点击的数据
  const handleItemClickDelegate = useCallback(
    (event: any) => {
      if (!onItemClick) return;
      const idx = Number(event?.origin?.currentTarget?.dataset?.idx);

      const item = dataWithHeightRef.current[idx];
      if (item) onItemClick(item);
    },
    [onItemClick]
  );

  const handleItemLongPressDelegate = useCallback(
    (event: any) => {
      if (!onItemLongPress) return;
      const idx = Number(event.currentTarget.dataset.idx);
      const item = dataWithHeightRef.current[idx];
      if (item) onItemLongPress(item);
    },
    [onItemLongPress]
  );

  // 用 ref 持有最新值，让 throttle 闭包读最新 sizeData/headerHeight
  // 而无需将它们列为 useMemo 依赖 —— 数据变化时不重建 throttle 实例
  const sizeDataRef = useRef(sizeData);
  sizeDataRef.current = sizeData;
  const headerHeightRef = useRef(headerHeight);
  headerHeightRef.current = headerHeight;

  const handleScroll = React.useMemo(
    () =>
      throttle(function handleScrollImpl(event: any) {
        const { scrollTop } = event.detail;
        const sd = sizeDataRef.current;
        const hh = headerHeightRef.current;

        // 二分查找：O(log N) 定位第一个可见 item，替代原来的 O(N) 线性扫描
        // 目标：找最后一个 offsetTop <= (scrollTop - headerHeight) 的 item 索引
        const target = Math.max(0, scrollTop - hh);
        let lo = 0;
        let hi = sd.length - 1;
        let offset = 0;
        while (lo <= hi) {
          // eslint-disable-next-line no-bitwise
          const mid = (lo + hi) >>> 1;
          if (sd[mid].offsetTop <= target) {
            offset = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
        setRange(offset);
      }, scrollThrottleTime),
    [scrollThrottleTime] // sizeData/headerHeight 通过 ref 读取，无需作为依赖
  );

  useEffect(() => {
    return handleScroll.cancel;
  }, [handleScroll]);

  const innerBeforeHeight = (sizeData[start] && sizeData[start].offsetTop) || 0;
  const scrollToLowerLockRef = useRef(false);
  const scrollToLowerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (scrollToLowerTimerRef.current) {
        clearTimeout(scrollToLowerTimerRef.current);
      }
    };
  }, []);

  // data 变化时（如加载更多后）解除锁，允许下一次触底加载
  useEffect(() => {
    if (scrollToLowerTimerRef.current) {
      clearTimeout(scrollToLowerTimerRef.current);
      scrollToLowerTimerRef.current = null;
    }
    scrollToLowerLockRef.current = false;
  }, [data?.length]);

  const handleScrollToLower = ele => {
    if (scrollToLowerLockRef.current) {
      return;
    }
    scrollToLowerLockRef.current = true;
    props.onScrollToLower?.(ele);
    // 300ms 后解锁，防止同一次触底被原生多次触发
    scrollToLowerTimerRef.current = setTimeout(() => {
      scrollToLowerTimerRef.current = null;
      scrollToLowerLockRef.current = false;
    }, 300);
  };

  // 稳定 onScroll 引用，避免每次 render 给 ScrollView 传新函数
  const handleScrollEvent = useCallback(
    (e: any) => {
      handleScroll(e);
      onScroll && onScroll(e);
    },
    [handleScroll, onScroll]
  );

  if (data && data.length !== 0) {
    data.forEach((item, index) => {
      if (item.height === undefined && defaultItemHeight === undefined) {
        throw new Error(
          `item ${index} must have height or defaultItemHeight property should be set`
        );
      }
    });
  }

  if (renderBottom && !bottomHeight) {
    throw new Error('renderBottom must be used with bottomHeight');
  }
  if (renderHeader && !headerHeight) {
    throw new Error('renderHeader must be used with headerHeight');
  }
  const scrollY = props.scrollY !== undefined ? props.scrollY : true;
  return (
    // @ts-ignore
    <ScrollView
      scrollTop={0}
      {...scrollViewProps}
      scrollY={scrollY}
      lowerThreshold={lowerThreshold}
      onScroll={handleScrollEvent}
      onScrollToLower={handleScrollToLower}
    >
      {renderHeader && (
        <View
          className={`${cssPrefix}header`}
          style={{ height: `${headerHeight}px`, position: fixedHeader ? 'fixed' : 'relative' }}
        >
          {renderHeader()}
        </View>
      )}
      <View
        className={`${cssPrefix}wrapper`}
        style={{
          height: `${LIST_HEIGHT}px`,
          background: placeholderImage ? `url("${placeholderImage}") repeat-y` : 'none',
          backgroundSize: placeholderImage && 'contain',
          ...wrapperStyle,
        }}
      >
        <View
          className={`${cssPrefix}content`}
          style={{
            top: `${fixedHeader ? headerHeight + innerBeforeHeight : innerBeforeHeight}px`,
          }}
        >
          {renderExtraHeader && renderExtraHeader()}
          {data?.length === 0 && renderEmpty ? (
            renderEmpty()
          ) : (
            <>
              {visibleData.map((item, index) => {
                const itemHeight = item.height || defaultItemHeight;
                return (
                  <View
                    key={item.__index__}
                    data-idx={item.__index__}
                    style={{ height: `${itemHeight}px` }}
                    className={`${cssPrefix}item ${cssPrefix}item-${item.__index__}${
                      itemClass ? ` ${itemClass}` : ''
                    }`}
                    onClick={onItemClick ? handleItemClickDelegate : undefined}
                    onLongPress={onItemLongPress ? handleItemLongPressDelegate : undefined}
                  >
                    {renderItem(item, index)}
                  </View>
                );
              })}
            </>
          )}
        </View>
      </View>
      {renderBottom && (
        <View className={`${cssPrefix}bottom`} style={{ height: `${bottomHeight}px` }}>
          {renderBottom()}
        </View>
      )}
    </ScrollView>
  );
};

RecycleView.defaultProps = defaultProps;
RecycleView.displayName = 'RecycleView';

export default RecycleView;
