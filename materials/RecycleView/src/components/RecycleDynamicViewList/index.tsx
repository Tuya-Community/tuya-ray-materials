/* eslint-disable react/no-array-index-key */
import React, { memo } from 'react';
import { ScrollView } from '@ray-js/ray';
import clsx from 'clsx';
import { getRandomColor } from '../../utils';
import RecycleView from '../RecycleDynamicView';
import { defaultProps, IProps } from './props';

const classPrefix = 'rayui-recycle-dynamic-view-list';

const Template = <T,>(props: IProps<T>) => {
  const {
    data,
    renderItem,
    renderTop,
    renderBottom,
    rootMargin,
    debug,
    wrapperId,
    className,
    style,
    ...scrollViewProps
  } = props;

  return (
    // @ts-ignore
    <ScrollView
      id={wrapperId}
      className={clsx(classPrefix, className)}
      style={style}
      {...scrollViewProps}
    >
      {renderTop && renderTop()}
      {data.map((chunk, chunkIndex) => (
        <RecycleView
          key={`${wrapperId}_chunk_${chunkIndex}`}
          chunkId={`${wrapperId}_chunk_${chunkIndex}`}
          rootMargin={rootMargin}
          debug={debug}
          style={debug ? { border: `2px solid ${getRandomColor()}` } : {}}
        >
          {chunk.map((item, index) => renderItem(item, chunkIndex, index))}
        </RecycleView>
      ))}
      {renderBottom && renderBottom()}
    </ScrollView>
  );
};

Template.defaultProps = defaultProps;
Template.displayName = 'RecycleDynamicViewList';

export default memo(Template);
