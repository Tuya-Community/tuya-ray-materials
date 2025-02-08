/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:26:29
 * @Description:
 */
import { arrayFill } from '../utils';

/** 追光 */
const mode = (colors, option, closeRgb) => {
  const { direction } = option || {};
  const allColor = colors.map(item => arrayFill(20, item)).flat(1);
  const colorList = allColor.map((_, index) => {
    const endIndex = index + 20;
    const endColor =
      endIndex > allColor.length - 1 ? allColor.slice(0, endIndex - allColor.length + 1) : [];
    const list = [...allColor.slice(index, index + 20), ...endColor];
    return !direction ? list.reverse() : list;
  });
  return {
    colorList,
    length: colorList.length,
  };
};

export default mode;
