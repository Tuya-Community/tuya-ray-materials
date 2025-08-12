import React, { useState } from 'react';
import { View } from '@ray-js/ray';
import { renderToString } from 'preact-render-to-string';
import { html } from 'htm/preact';
import clsx from 'clsx';
import { useDeepCompareEffect } from 'ahooks';
import { defaultProps, IProps } from './props';
import './index.less';

const classPrefix = 'ray-svg';

function Svg(props: IProps) {
  const { className, style, children, width, height, viewBox } = props;
  const [backgroundImage, setBackgroundImage] = useState('');

  useDeepCompareEffect(() => {
    const renderSvg = (...args) => {
      return renderToString(html.call(this, ...args));
    };
    const svg = renderSvg`<svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version="1.1">${children}</svg>`;
    const output = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    setBackgroundImage(output);
  }, [width, height, viewBox, children]);

  return (
    <>
      <View
        className={clsx(classPrefix, className)}
        style={{
          width,
          height,
          ...style,
        }}
      >
        <View
          className={`${classPrefix}-image`}
          style={{
            backgroundImage,
          }}
        />
      </View>
    </>
  );
}

Svg.defaultProps = defaultProps;
Svg.displayName = 'Svg';

export default Svg;
