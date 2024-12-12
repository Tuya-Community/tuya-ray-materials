import React, { useRef } from 'react';
import { View, ScrollView } from '@ray-js/ray';
import { useVisibleRange, useSizeData } from '../../hooks';
import { IProps, IScrollProps, defaultProps } from './props';
import { throttle } from '../../utils';
import './index.less';

const DEFAULT_OVERSCAN_COUNT = 5;
const cssPrefix = 'ray-recycle-view_';

const isVisible = (start: number, end: number) => (_: any, index: number) =>
  index >= start && index <= end;

const RecycleView: React.FC<IProps & IScrollProps> = props => {
  const {
    data = [],
    overScanCount = DEFAULT_OVERSCAN_COUNT,
    placeholderImage,
    renderHeader,
    fixedHeader,
    defaultItemHeight,
    renderBottom,
    headerHeight = 0,
    bottomHeight = 0,
    renderItem,
    onScroll,
    lowerThreshold = 100,
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
  // 计算列表总高度
  const LIST_HEIGHT = React.useMemo(() => {
    const totalHeight = data.reduce((totalHeight, ele) => {
      const itemHeight = ele.height || defaultItemHeight;
      return totalHeight + itemHeight;
    }, 0);
    return totalHeight + headerHeight;
  }, [data.length, bottomHeight, defaultItemHeight]);

  const dataWithHeight = data.map((i, idx) => {
    return {
      __index__: i.__index__ ?? idx,
      ...i,
      height: i.height ?? defaultItemHeight,
    };
  });

  const sizeData = useSizeData(dataWithHeight);

  // 当前可见区域的数据
  const visibleData = React.useMemo(
    () => dataWithHeight.filter(isVisible(start, end)),
    [dataWithHeight, start, end]
  );

  const handleScroll = React.useMemo(
    () =>
      throttle(function (event: any) {
        const ratio = event.detail.scrollTop / event.detail.scrollHeight;

        const initialOffsetTop = headerHeight;
        const totalHeight = LIST_HEIGHT;

        let offset = 0;
        for (let i = 0; i < sizeData.length; i++) {
          const { offsetTop } = sizeData[i];
          const totalOffsetTop = initialOffsetTop + offsetTop;
          if (totalOffsetTop / totalHeight >= ratio) {
            offset = i;
            break;
          }
        }
        setRange(offset);
      }, 100),
    [headerHeight, LIST_HEIGHT, bottomHeight, sizeData]
  );

  React.useEffect(() => {
    return handleScroll.cancel;
  }, [handleScroll]);

  const innerBeforeHeight = (sizeData[start] && sizeData[start].offsetTop) || 0;
  const refreshTimerRef = useRef(null);
  const handleScrollToLower = ele => {
    if (refreshTimerRef.current) {
      return;
    }
    // 防止频繁触发
    refreshTimerRef.current = setTimeout(() => {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }, 500);
    props.onScrollToLower && props.onScrollToLower(ele);
  };

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
      {...scrollViewProps}
      scrollY={scrollY}
      lowerThreshold={lowerThreshold}
      scrollTop={0}
      onScroll={(e: any) => {
        handleScroll(e);
        onScroll && onScroll(e);
      }}
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
        }}
      >
        <View
          className={`${cssPrefix}content`}
          style={{
            top: `${fixedHeader ? headerHeight + innerBeforeHeight : innerBeforeHeight}px`,
          }}
        >
          {visibleData.map((item, index) => {
            const itemHeight = item.height || defaultItemHeight;
            const _item = {
              ...item,
              height: itemHeight,
            };
            return (
              <View
                key={item.__index__}
                style={{ height: `${itemHeight}px` }}
                className={`${cssPrefix}item ${cssPrefix}item-${index}`}
              >
                {renderItem(_item, index)}
              </View>
            );
          })}
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
