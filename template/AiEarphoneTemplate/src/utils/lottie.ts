/**
 * Lottie 动画颜色修改工具函数
 */

/**
 * 颜色格式类型
 */
type ColorFormat = 'hex' | 'rgb' | 'rgba';

/**
 * 检测颜色格式
 * @param color 颜色值（支持十六进制、RGB、RGBA）
 * @returns 颜色格式类型
 */
function detectColorFormat(color: string): ColorFormat {
  // 检测十六进制格式 (#ffffff, #fff)
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
    return 'hex';
  }
  // 检测 RGB 格式 (rgb(255, 255, 255))
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
    return 'rgb';
  }
  // 检测 RGBA 格式 (rgba(255, 255, 255, 1))
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(color)) {
    return 'rgba';
  }
  // 默认返回 hex，如果格式不正确会在转换时处理
  return 'hex';
}

/**
 * 将颜色转换为 Lottie 需要的 RGB 格式（0-1 范围）
 * @param color 颜色值（支持十六进制、RGB、RGBA）
 * @returns RGB 数组 [r, g, b]，值范围 0-1
 */
function colorToLottieRgb(color: string): [number, number, number] {
  const format = detectColorFormat(color);

  switch (format) {
    case 'hex': {
      // 处理十六进制颜色
      let hex = color.toLowerCase();
      // 处理简写形式 (#fff -> #ffffff)
      if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
      }
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    }
    case 'rgb':
    case 'rgba': {
      // 处理 RGB/RGBA 格式
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const r = parseInt(matches[0], 10) / 255;
        const g = parseInt(matches[1], 10) / 255;
        const b = parseInt(matches[2], 10) / 255;
        return [r, g, b];
      }
      break;
    }
    default:
      break;
  }

  // 如果格式不正确，返回默认颜色（黑色）
  console.warn(`无法解析颜色格式: ${color}，使用默认颜色`);
  return [0, 0, 0];
}

/**
 * 递归修改 Lottie JSON 中的所有填充颜色
 * @param layers Lottie 图层数组
 * @param rgb RGB 颜色值 [r, g, b]，值范围 0-1
 */
function updateLottieColors(layers: any[], rgb: [number, number, number]): void {
  layers.forEach(layer => {
    if (layer.shapes) {
      layer.shapes.forEach((shape: any) => {
        if (shape.it) {
          // 遍历形状组内的所有项
          shape.it.forEach((item: any) => {
            // 修改填充颜色 (ty: "fl" 表示填充)
            if (item.ty === 'fl' && item.c && item.c.k) {
              // 如果 c.k 是数组，直接修改
              if (Array.isArray(item.c.k)) {
                item.c.k = [rgb[0], rgb[1], rgb[2], 1];
              }
            }
          });
        }
        // 如果 shape 本身就是填充
        if (shape.ty === 'fl' && shape.c && shape.c.k) {
          if (Array.isArray(shape.c.k)) {
            shape.c.k = [rgb[0], rgb[1], rgb[2], 1];
          }
        }
      });
    }
  });
}

/**
 * 修改 Lottie 动画的颜色
 * @param lottieData Lottie JSON 数据对象
 * @param color 目标颜色（支持十六进制如 #3678e3、RGB 如 rgb(54, 120, 227)、RGBA 如 rgba(54, 120, 227, 1)）
 * @returns 修改后的 Lottie JSON 数据（深拷贝，不修改原对象）
 */
// 以 lottieData 引用为第一层键，颜色字符串为第二层键，缓存结果，避免重复遍历
const lottieColorCache: WeakMap<any, Map<string, any>> = new WeakMap();
export function modifyLottieColor(lottieData: any, color: string): any {
  if (!lottieData || !color) return lottieData;
  let colorMap = lottieColorCache.get(lottieData);
  if (!colorMap) {
    colorMap = new Map<string, any>();
    lottieColorCache.set(lottieData, colorMap);
  }
  const cached = colorMap.get(color);
  if (cached) return cached;

  // 深拷贝 Lottie 数据，避免修改原对象
  const modifiedLottie = JSON.parse(JSON.stringify(lottieData));

  // 将颜色转换为 Lottie 需要的 RGB 格式
  const rgb = colorToLottieRgb(color);

  // 修改所有图层的颜色
  if (modifiedLottie.layers && Array.isArray(modifiedLottie.layers)) {
    updateLottieColors(modifiedLottie.layers, rgb);
  }

  colorMap.set(color, modifiedLottie);
  return modifiedLottie;
}
