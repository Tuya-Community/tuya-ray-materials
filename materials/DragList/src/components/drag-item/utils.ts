/*
 * @Author: mjh
 * @Date: 2025-06-04 14:18:02
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-13 17:04:58
 * @Description:
 */
export function getRect(context: WechatMiniprogram.Component.TrivialInstance, selector: string) {
  return new Promise<WechatMiniprogram.BoundingClientRectCallbackResult>(resolve => {
    wx.createSelectorQuery()
      .in(context)
      .select(selector)
      .boundingClientRect()
      .exec((rect = []) => resolve(rect[0]));
  });
}

const unitKey = [
  'height',
  'width',
  'marginTop',
  'marginBottom',
  'marginRight',
  'marginLeft',
  'margin',
  'paddingTop',
  'paddingBottom',
  'paddingRight',
  'paddingLeft',
  'padding',
];
export function styleTools(styles) {
  if (typeof styles === 'string') {
    return styles;
  }

  if (Array.isArray(styles)) {
    return styles
      .filter(function (item) {
        return item != null && item !== '';
      })
      .map(function (item) {
        return styleTools(item);
      })
      .join(';');
  }

  if (typeof styles === 'object') {
    return Object.keys(styles)
      .filter(function (key) {
        return styles[key] != null && styles[key] !== '';
      })
      .map(function (key) {
        let value: string | number = styles[key];
        if (unitKey.includes(key) && typeof value === 'number') {
          value = `${value}rpx`;
        }
        return [key, [value]].join(':');
      })
      .join(';');
  }

  return styles || '';
}
