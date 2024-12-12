import React, { useState, useRef, useEffect } from 'react';
import { usePageInstance, View } from '@ray-js/ray';
import clsx from 'clsx';
import { defaultProps, IProps } from './props';

const classPrefix = 'rayui-recycle-dynamic-view';

const Template: React.FC<IProps> = props => {
  const { className, style, children, chunkId, wrapperId, rootMargin, debug } = props;

  const [height, setHeight] = useState(0);
  const [showChunk, setShowChunk] = useState(true);

  const chunkObserverRef = useRef(null);
  const page = usePageInstance();

  useEffect(() => {
    startObserverChunk();

    return () => {
      try {
        if (chunkObserverRef.current) chunkObserverRef.current.disconnect();
      } catch (error) {
        console.warn(error);
      }
      chunkObserverRef.current = null;
    };
  }, []);

  const startObserverChunk = () => {
    try {
      chunkObserverRef.current = page.createIntersectionObserver();
      chunkObserverRef.current
        .relativeTo(`#${wrapperId}`, { bottom: rootMargin, top: rootMargin })
        .observe(`#${chunkId}`, res => {
          const { intersectionRatio, intersectionRect } = res;
          debug && console.log(`${chunkId} observe res =>`, res);

          if (intersectionRatio === 0 && intersectionRect?.y === 0) {
            setHeight(res.boundingClientRect.height);
            setShowChunk(false);
            debug && console.log(`${chunkId}超出预定范围`);
          } else {
            setShowChunk(true);
            setHeight(0);
            debug && console.log(`${chunkId}进入预定范围`);
          }
        });
    } catch (error) {
      console.warn('error', error);
    }
  };

  return (
    <View
      id={chunkId}
      className={clsx(classPrefix, className)}
      style={{ minHeight: `${height}px`, ...style }}
    >
      {showChunk && <View>{children}</View>}
    </View>
  );
};

Template.defaultProps = defaultProps;
Template.displayName = 'RecycleDynamicView';

export default Template;
