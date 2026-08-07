import React from 'react';
import { Image } from '@ray-js/ray';
import { getImageThemeClass } from '@/res';
import clsx from 'clsx';
import { useSelector } from '@/redux';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';

interface ThemedImageProps {
  /** 图片资源名称（res 对象中的 key），用于自动获取主题适配类名 */
  imageName?: string;
  /** 图片源地址 */
  src: string | (() => string);
  /** 自定义类名 */
  className?: string;
  /** 其他 Image 组件的 props */
  [key: string]: any;
}

/**
 * 带主题适配的 Image 组件
 * 根据图片类型自动在暗黑模式下应用相应的滤镜效果
 *
 * @example
 * // 使用图片名称自动适配
 * <ThemedImage imageName="homeIcon" src={Res.homeIcon} className={styles.icon} />
 *
 * // 手动指定主题类型
 * <ThemedImage src={Res.homeIcon} className={clsx(styles.icon, 'img-theme-bw')} />
 */
const ThemedImage: React.FC<ThemedImageProps> = ({ imageName, src, className, ...restProps }) => {
  // 订阅 theme，theme 变化时强制刷新图片
  const theme = useSelector(selectSystemInfoByKey('theme'));
  const themeClass = imageName ? getImageThemeClass(imageName) : '';
  // 用 theme 作为 key，确保切换主题时图片组件会重渲染
  return (
    <Image
      key={theme || 'light'}
      src={typeof src === 'function' ? src() : src}
      className={clsx(className, themeClass)}
      {...restProps}
    />
  );
};

export default React.memo(ThemedImage);
