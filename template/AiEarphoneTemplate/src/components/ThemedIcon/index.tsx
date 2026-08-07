import React from 'react';
import { Icon } from '@ray-js/smart-ui';
import { getImageThemeClass } from '@/res';
import clsx from 'clsx';

interface ThemedIconProps {
  /** 图标资源名称（res 对象中的 key），用于自动获取主题适配类名 */
  iconName?: string;
  /** 图标资源（Icon 组件的 name 属性） */
  name: any;
  /** 图标大小 */
  size?: number;
  /** 图标颜色 */
  color?: string;
  /** 自定义类名 */
  className?: string;
  /** 其他 Icon 组件的 props */
  [key: string]: any;
}

/**
 * 带主题适配的 Icon 组件
 * 根据图标类型自动在暗黑模式下应用相应的滤镜效果
 * 
 * @example
 * // 使用图标名称自动适配
 * <ThemedIcon iconName="rightIcon" name={rightIcon} className={styles.icon} />
 * 
 * // 手动指定主题类型
 * <ThemedIcon name={rightIcon} className={clsx(styles.icon, 'img-theme-bw')} />
 */
const ThemedIcon: React.FC<ThemedIconProps> = ({
  iconName,
  name,
  size,
  color,
  className,
  ...restProps
}) => {
  // 如果提供了 iconName，自动获取主题适配类名
  const themeClass = iconName ? getImageThemeClass(iconName) : '';
  
  return (
    <Icon
      name={name}
      size={size}
      color={color}
      className={clsx(className, themeClass)}
      {...restProps}
    />
  );
};

export default ThemedIcon;
