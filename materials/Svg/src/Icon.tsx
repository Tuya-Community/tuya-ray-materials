/* eslint-disable react/no-unknown-property */
import React from 'react';
import clsx from 'clsx';
import Svg from './Svg';
import './index.less';
import { useRpx2Px } from './hooks/useRpx2Px';

export interface IconProps {
  /**
   * @description.zh 类名
   * @description.en class name
   */
  className?: string;
  /**
   * @description.zh 样式
   * @description.en Style
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 图标路径，支持多 path
   * @description.en Icon path，support multi path
   */
  d: string | string[];
  /**
   * @description.zh 图标大小
   * @description.en Icon path，support multi path
   * @default 23px
   */
  size?: string;
  /**
   * @description.zh 图标颜色，多 path 时支持多色，多色从 v0.2.0 版本开始支持
   * @description.en Icon  color，support multi color，multi color support from v0.2.0
   */
  color?: string | string[];
}

const classPrefix = 'ray-icon';

const Icon: React.FC<IconProps> = props => {
  const { style, className, d, size, color } = props;

  const rpx2px = useRpx2Px();

  return (
    <Svg
      className={clsx(classPrefix, className)}
      style={style}
      viewBox="0 0 1024 1024"
      width={rpx2px(size)}
      height={rpx2px(size)}
    >
      {Array.isArray(d) ? (
        (d as string[]).map((item, index) => (
          <path
            key={`${item}_${index}`}
            d={item}
            fill={Array.isArray(color) ? color[index] : color}
            fill-rule="evenodd"
          />
        ))
      ) : (
        <path d={d as string} fill={Array.isArray(color) ? color[0] : color} fill-rule="evenodd" />
      )}
    </Svg>
  );
};

Icon.displayName = 'Icon';

Icon.defaultProps = {
  size: '23px',
};

export default Icon;
