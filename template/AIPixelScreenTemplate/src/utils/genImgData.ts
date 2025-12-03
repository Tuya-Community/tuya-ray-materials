// 将 Uint8Array 转换为 base64 字符串
export function arrayBufferToBase64(buffer) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = new Uint8Array(buffer);
  let result = '';
  let i;

  for (i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;

    const bitmap = (a << 16) | (b << 8) | c;

    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    result += i + 1 < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
    result += i + 2 < bytes.length ? chars.charAt(bitmap & 63) : '=';
  }

  return result;
}

// 自定义颜色量化函数 - 将 RGBA 转成 256 色的索引色
export function quantizeColors(imageData) {
  const data = imageData.data;
  const colorMap = new Map();
  const colors = [];

  // 收集所有唯一颜色
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // 忽略完全透明的像素
    if (data[i + 3] === 0) continue;

    const colorKey = `${r},${g},${b}`;
    if (!colorMap.has(colorKey)) {
      colorMap.set(colorKey, colors.length);
      colors.push({ r, g, b, count: 1 });
    } else {
      colors[colorMap.get(colorKey)].count++;
    }
  }

  // 如果颜色数量超过 256，使用简单的颜色立方体方法减少颜色
  let palette = colors;
  if (colors.length > 256) {
    // 使用 6x6x6 = 216 色的 web 安全色调色板 + 40 个灰度色
    palette = [];

    // Web 安全色 (216 colors)
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          palette.push({
            r: Math.floor((r * 255) / 5),
            g: Math.floor((g * 255) / 5),
            b: Math.floor((b * 255) / 5),
          });
        }
      }
    }

    // 灰度色 (40 colors)
    for (let i = 0; i < 40; i++) {
      const gray = Math.floor((i * 255) / 39);
      palette.push({ r: gray, g: gray, b: gray });
    }
  }

  // 确保调色板不超过 256 色
  if (palette.length > 256) {
    palette = palette.slice(0, 256);
  }

  // GIF 格式要求：调色板颜色数量必须是 2 的幂（2, 4, 8, 16, 32, 64, 128, 256）
  const getNextPowerOfTwo = n => {
    if (n <= 2) return 2;
    if (n <= 4) return 4;
    if (n <= 8) return 8;
    if (n <= 16) return 16;
    if (n <= 32) return 32;
    if (n <= 64) return 64;
    if (n <= 128) return 128;
    return 256;
  };

  const requiredPaletteSize = getNextPowerOfTwo(palette.length);

  // 如果调色板颜色数量不足，用黑色填充到符合 2 的幂的数量
  while (palette.length < requiredPaletteSize) {
    palette.push({ r: 0, g: 0, b: 0 }); // 用黑色填充
  }

  // 创建调色板数组 (r,g,b 格式)
  const paletteArray = [];
  palette.forEach(color => {
    paletteArray.push(color.r, color.g, color.b);
  });

  // 创建 32 位调色板 (用于 GIF)
  const palette32 = palette.map(color => (color.r << 16) | (color.g << 8) | color.b);

  // 映射像素到最近的调色板颜色
  const indexedPixels = new Uint8Array(data.length / 4);
  for (let i = 0, pixelIndex = 0; i < data.length; i += 4, pixelIndex++) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];

    // 透明像素使用第一个颜色
    if (alpha === 0) {
      indexedPixels[pixelIndex] = 0;
      continue;
    }

    // 找到最近的颜色（只在原始颜色中查找，忽略填充的黑色）
    let minDistance = Infinity;
    let bestIndex = 0;
    const searchLength = Math.min(colors.length, palette.length);

    for (let j = 0; j < searchLength; j++) {
      const color = palette[j];
      const distance = Math.sqrt(
        Math.pow(r - color.r, 2) + Math.pow(g - color.g, 2) + Math.pow(b - color.b, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        bestIndex = j;
      }
    }

    indexedPixels[pixelIndex] = bestIndex;
  }

  return {
    indexedPixels,
    palette: palette32,
    paletteArray: new Uint8Array(paletteArray),
  };
}
