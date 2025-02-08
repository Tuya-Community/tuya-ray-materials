/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:24:56
 * @Description:
 */
import { arrayFill } from '../utils';

/** 流星 */
const mode = (colors, option, closeRgb) => {
  const { direction, expand } = option || {};
  let allColor = [];
  let currIndex = 0;
  colors.forEach(item => {
    if (!expand) {
      // 流星
      const closeList = arrayFill(19, closeRgb);
      const colorList = arrayFill(5, item);
      allColor = [...allColor, ...closeList, ...colorList];
    } else if (expand === 1) {
      // 流星雨
      const closeList = arrayFill(7, closeRgb);
      const colorList = arrayFill(5, item);
      allColor = [...allColor, ...closeList, ...colorList, ...closeList, ...colorList];
    } else {
      // 幻彩流星
      const currColor = colors[currIndex];
      const afterColor = colors[currIndex + 1];
      if (!currColor) return;
      const closeList = arrayFill(7, closeRgb);
      const colorList = arrayFill(5, currColor);
      const afterColorList = afterColor ? arrayFill(5, afterColor) : [];
      currIndex += 2;
      allColor = [
        ...allColor,
        ...closeList,
        ...colorList,
        ...(afterColor ? closeList : []),
        ...afterColorList,
      ];
    }
  });
  const colorList = allColor.map((_, index) => {
    const endIndex = index + 20;
    const endColor =
      endIndex > allColor.length - 1 ? allColor.slice(0, endIndex - allColor.length + 1) : [];
    const list = [...allColor.slice(index, index + 20), ...endColor];
    return direction ? list : list.reverse();
  });
  return {
    colorList,
    length: colorList.length,
  };
};

export default mode;
