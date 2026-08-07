/*
 * @Author: hkc
 * @Date: 2026-01-22 20:49:56
 * @Description:
 * @LastEditTime: 2026-03-20 11:33:02
 * @LastEditors: hkc
 */
import React, { memo } from 'react';
import { ScrollView } from '@ray-js/ray';
import clsx from 'clsx';
import { getRandomColor } from '../RecycleView/utils';
import DynamicView from './DynamicView';
import { defaultProps, IProps } from './props';

const classPrefix = 'rayui-recycle-dynamic-view-list';

const Template = <T,>(props: IProps<T>) => {
  const {
    // data,
    renderItem,
    renderTop,
    renderBottom,
    rootMargin,
    debug,
    wrapperId,
    className,
    style,
    renderSkeleton,
    renderList,
    renderListStartIndex = 0,
    scrollHeight,
    onScroll,
    contentClassName,
    ...scrollViewProps
  } = props;

  return (
    <ScrollView
      {...scrollViewProps}
      id={wrapperId}
      className={clsx(classPrefix, className)}
      style={{
        height: `${scrollHeight}px`,
        ...style,
      }}
      onScroll={onScroll}
      // @ts-ignore
    >
      {renderTop && renderTop()}
      {renderList?.map((chunk, chunkIndex) => {
        // 计算全局chunk索引，确保每个chunk的ID唯一且不变
        const globalChunkIndex = renderListStartIndex + chunkIndex;

        // 如果是第一个chunk且renderListStartIndex > 0，说明是通过下拉刷新加载的，应该立即显示内容
        const isUpperLoadedChunk = chunkIndex === 0 && renderListStartIndex > 0;

        return (
          <DynamicView
            className={contentClassName}
            key={`${wrapperId}_chunk_${globalChunkIndex}`}
            chunkId={`${wrapperId}_chunk_${globalChunkIndex}`}
            chunkIndex={chunkIndex}
            rootMargin={Math.round(rootMargin)}
            debug={debug}
            style={{
              ...(debug ? { border: `2px solid ${getRandomColor()}` } : {}),
            }}
            renderSkeleton={renderSkeleton}
            wrapperId={wrapperId}
            scrollHeight={scrollHeight}
            immediateShow={isUpperLoadedChunk}
          >
            {chunk?.map((item, index) => renderItem(item, chunkIndex, index))}
          </DynamicView>
        );
      })}
      {renderBottom && renderBottom()}
    </ScrollView>
  );
};

Template.defaultProps = defaultProps;
Template.displayName = 'RecycleDynamicViewList';

export default memo(Template);
