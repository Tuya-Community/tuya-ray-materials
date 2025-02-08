/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:26:55
 * @Description:
 */
import { arrayFill } from '../utils';

/** 飘动 */
const mode = (colors, option, closeRgb) => {
  const { direction } = option || {};
  const colorList = arrayFill(2, colors).flat(1);
  const colorAllList = colorList
    .map(item => [...arrayFill(5, item), ...arrayFill(5, closeRgb)])
    .flat(1);
  const loopColorList = [...colorAllList, ...colorAllList.slice(0, 19)];
  const colorAnimation = loopColorList
    .map((_, index) => {
      if (index + 19 > loopColorList.length - 1) return [];
      const list = loopColorList.slice(index, index + 20);
      return direction ? list : list.reverse();
    })
    .filter(item => item.length);
  return {
    colorList: colorAnimation,
    length: colorAnimation.length,
  };
};

export default mode;
