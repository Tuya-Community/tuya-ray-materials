export default {
  type: 'light', // light or dark or custom string
  global: {
    brand: 'var(--color-bg-f8f8f8)', // 品牌色（主题色）
    bgColor: 'var(--color-bg-f8f8f8)', // 背景色
    fontSizeBase: 1, // 字体基准比例
    dividerColor: 'var(--color-border-base)', // 分隔线颜色
    success: 'var(--color-success-00c800)', // 成功颜色
    warning: 'var(--color-warning-faae17)', // 警告颜色
    error: 'var(--color-error-f4182c)', // 失败
    mask: 'var(--color-bg-overlay)', // 遮罩颜色
    text: {
      light: 'var(--color-gray-333)', // 字体在 light 下的颜色
      dark: 'var(--color-white-solid)', // 字体在 dark 下的颜色
    },
  },
  brickButton: {
    bgColor: 'var(--color-success)',
  },
  slider: {
    light: {
      trackRadius: 2, // 滑块圆角
      trackHeight: 4, // 滑块高度
      minimumTrackTintColor: 'var(--color-red-ff0000)', // 最小值颜色
      maximumTrackTintColor: 'var(--color-border-base)', // 最大值颜色
      thumbSize: 24, // 滑块圆的尺寸
      thumbRadius: 14, // 滑块圆的圆角
      thumbTintColor: 'var(--color-white-solid)', // 滑块的颜色
    },
    dark: {
      trackRadius: 2,
      trackHeight: 4,
      minimumTrackTintColor: 'var(--color-red-ff0000)',
      maximumTrackTintColor: 'var(--color-bg-white-transparent-3)',
      thumbSize: 24,
      thumbRadius: 14,
      thumbTintColor: 'var(--color-white-solid)',
    },
  },
};
