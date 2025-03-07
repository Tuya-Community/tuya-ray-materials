import React, { ComponentProps, FC } from 'react';
import { Text as RayText } from '@ray-js/ray';
import clsx from 'clsx';

import styles from './index.module.less';

type TextProps = ComponentProps<typeof RayText>;

interface Props extends TextProps {
  numberOfLines?: number;
  width?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  color?: string;
  display?: 'inline' | 'block' | 'inline-block';
}

/**
 * 带自动省略功能的文本组件，需要同时设置 width
 */
const Text: FC<Props> = ({
  numberOfLines,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  children,
  display,
  style,
  className,
  ...otherProps
}) => {
  return (
    <RayText
      className={clsx(
        {
          [styles.oneLineEllipsis]: numberOfLines === 1,
          [styles.multipleLinesEllipsis]: numberOfLines > 1,
        },
        className
      )}
      style={{
        WebkitLineClamp: numberOfLines,
        width,
        fontSize,
        fontWeight,
        lineHeight,
        color,
        display,
        ...style,
      }}
      {...otherProps}
    >
      {children}
    </RayText>
  );
};

export default Text;
