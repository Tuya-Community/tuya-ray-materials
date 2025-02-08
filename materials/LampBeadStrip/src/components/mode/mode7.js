/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:26:02
 * @Description:
 */
import { arrayFill, splitArray } from '../utils';

/** 飘落 */
const mode = (colors, option, closeRgb) => {
  const { direction, segmented } = option || {};
  const arrList = arrayFill(20, closeRgb);
  // 全段
  if (!segmented) {
    const allColor = colors
      .map(item => {
        let count = 0;
        const currColorList = new Array(5).fill('').map(() => {
          const list = new Array(21 - count).fill('').map((_, index) => {
            const currList = [...arrList.slice(0, 20 - count), ...arrayFill(count, item)];
            const currIndex = index - 4;
            currIndex >= 0 && (currList[currIndex] = item);
            currIndex + 1 >= 0 && (currList[currIndex + 1] = item);
            currIndex + 2 >= 0 && (currList[currIndex + 2] = item);
            currIndex + 3 >= 0 && (currList[currIndex + 3] = item);
            if (direction) return currList.reverse();
            return currList;
          });
          count += 4;
          return list;
        });
        return [...currColorList, arrayFill(6, arrayFill(20, item))];
      })
      .flat(2);
    return {
      colorList: allColor,
      length: allColor.length,
    };
  }
  // 分段
  let colorList = colors.length === 5 ? colors : arrayFill(5, colors).flat(1);
  const colorSplit = splitArray(colorList, 5);
  const allColor = colorSplit
    .map(colorItemList => {
      let count = 0;
      const currColorList = new Array(5).fill('').map((_, colorIndex) => {
        const currColor = colorItemList[colorIndex];
        const list = new Array(21 - count).fill('').map((__, index) => {
          const currList = [
            ...arrList.slice(0, 20 - count),
            new Array(colorIndex)
              .fill('')
              .map((___, ind) => arrayFill(4, colorItemList[ind]))
              .reverse(),
          ].flat(2);
          const currIndex = index - 4;
          currIndex >= 0 && (currList[currIndex] = currColor);
          currIndex + 1 >= 0 && (currList[currIndex + 1] = currColor);
          currIndex + 2 >= 0 && (currList[currIndex + 2] = currColor);
          currIndex + 3 >= 0 && (currList[currIndex + 3] = currColor);
          if (direction) return currList.reverse();
          return currList;
        });
        count += 4;
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
