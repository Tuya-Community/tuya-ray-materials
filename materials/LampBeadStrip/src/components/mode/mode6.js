/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:25:16
 * @Description:
 */
import { arrayFill, splitLight } from '../utils';

/** 堆积 */
const mode = (colors, option, closeRgb) => {
  const { direction, segmented } = option || {};
  const closeArrList = arrayFill(20, closeRgb);
  // 全段
  if (!segmented) {
    const allColor = colors
      .map(item => {
        let count = 0;
        const currColorList = new Array(20).fill('').map(() => {
          const list = new Array(21 - count).fill('').map((_, index) => {
            const currList = [...closeArrList.slice(0, 20 - count), ...arrayFill(count, item)];
            if (index) currList[index - 1] = item;
            if (direction) return currList.reverse();
            return currList;
          });
          count++;
          return list;
        });
        return currColorList;
      })
      .flat(2);
    return {
      colorList: allColor,
      length: allColor.length,
    };
  }
  // 分段
  const { arr, color } = splitLight(colors);
  const allColor = color
    .map(colorList => {
      let count = 0;
      const currItemColorList = arr.map((item, index) => arrayFill(item, colorList[index])).flat(1);
      const currColorList = new Array(20).fill('').map(() => {
        const list = new Array(21 - count).fill('').map((_, index) => {
          const currList = [
            ...closeArrList.slice(0, 20 - count),
            ...currItemColorList.slice(0, count).reverse(),
          ];
          if (index) currList[index - 1] = currItemColorList[count];
          if (direction) return currList.reverse();
          return currList;
        });
        count++;
        return list;
      });
      return currColorList;
    })
    .flat(2);
  return {
    colorList: allColor,
    length: allColor.length,
  };
};

export default mode;
