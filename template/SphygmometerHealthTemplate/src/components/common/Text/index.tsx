import { ComponentProps } from 'react';
import { Text as RayText } from '@ray-js/ray';
import clsx from 'clsx';

import styles from './index.module.less';

type TextProps = ComponentProps<typeof RayText>;

interface Props extends TextProps {
  numberOfLines?: number;
  size?: string;
  color?: string;
}

const Text = ({
  numberOfLines = 100,
  size,
  color,
  children,
  style,
  className,
  ...otherProps
}: Props) => {
  return (
    <RayText
      {...otherProps}
      className={clsx(
        {
          [styles.oneLineEllipsis]: numberOfLines === 1,
          [styles.multipleLinesEllipsis]: numberOfLines > 1,
        },
        className
      )}
      style={{ WebkitLineClamp: numberOfLines, fontSize: size, color, ...style }}
    >
      {children}
    </RayText>
  );
};

export default Text;
