import Res from '@/res';

/**
 * CDN 图片 → CSS 变量映射
 * 在 app 根节点注入为 CSS 自定义属性，使 less 文件可通过 var(--xxx) 引用 CDN 图片
 *
 * 新增图片时只需在此处添加一行映射即可
 *
 */
type CdnImageResolver = () => string;

const CDN_IMAGE_MAP: Record<string, CdnImageResolver> = {
  '--cdn-img-active': () => Res.activeImg,
  '--cdn-img-card-transfer-banner': () => Res.cardTransferEstablishBannerImg,
  '--cdn-img-connect-wifi-bg': () => Res.connectWifiBgImg,
};

let _cachedStyle: Record<string, string> | null = null;

/**
 * 清理 CDN 图片 CSS 变量缓存
 * 主题切换后应调用，确保重新计算最新主题图片地址
 */
export const invalidateCdnImageStyleCache = () => {
  _cachedStyle = null;
};

/**
 * 获取 CDN 图片的内联 CSS 变量 style 对象
 * 结果会被缓存，多次调用不会重复计算
 * @note 设备面板壳不能用 View 包 children，页面根节点可自行 style={getCdnImageStyle()}
 */
export const getCdnImageStyle = (): Record<string, string> => {
  if (_cachedStyle) {
    return _cachedStyle;
  }

  const style: Record<string, string> = {};
  for (const [varName, cdnUrl] of Object.entries(CDN_IMAGE_MAP)) {
    style[varName] = `url(${cdnUrl()})`;
  }

  _cachedStyle = style;
  return style;
};

/**
 * 将 CDN 图片 CSS 变量注入到 document 根节点（HTML/iframe 运行时）
 * 设备面板 App 不再用 View 包裹 children，改由此方式提供全局 var(--cdn-img-*)
 * @return none
 */
export const applyCdnImageVars = (): void => {
  const style = getCdnImageStyle();
  try {
    const root =
      typeof document !== 'undefined' ? document.documentElement || document.body : null;
    if (!root?.style?.setProperty) {
      return;
    }
    Object.entries(style).forEach(([varName, value]) => {
      root.style.setProperty(varName, value);
    });
  } catch {
  }
};
