/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:28:53
 * @Description:
 */
import { arrayFill, getListByIndex } from '../utils';

/** 开合 */
const mode = (colors, option, closeRgb) => {
  const { expand } = option || {};
  const closeColors = arrayFill(20, closeRgb);
  const colorAnimation = colors
    .map((item, index) => {
      const leftColor = item;
      const rightColor = getListByIndex(colors, index + 1);
      const listClose = arrayFill(11, '').map((_, ind) => {
        const leftColors = arrayFill(ind, leftColor);
        const currList = [...closeColors];
        currList.splice(0, ind, ...leftColors);
        if (expand) {
          const rightNum = 10 - ind;
          const rightColors = arrayFill(rightNum, rightColor);
          currList.splice(currList.length - rightNum, rightNum, ...rightColors);
        } else {
          const rightColors = arrayFill(ind, rightColor);
          currList.splice(currList.length - ind, ind, ...rightColors);
        }
        return currList;
      });
      const listOpen = arrayFill(11, '').map((_, indexs) => {
        const currIndex = 10 - indexs;
        const leftColors = arrayFill(currIndex, leftColor);
        const currList = [...closeColors];
        currList.splice(0, currIndex, ...leftColors);
        if (expand) {
          const rightColorExpand = getListByIndex(colors, index + 2);
          const rightColors = arrayFill(indexs, rightColorExpand);
          currList.splice(currList.length - indexs, indexs, ...rightColors);
        } else {
          const rightColors = arrayFill(currIndex, rightColor);
          currList.splice(currList.length - currIndex, currIndex, ...rightColors);
        }
        return currList;
      });
      return [listClose, listOpen].flat(1);
    })
    .flat(1);
  return {
    colorList: colorAnimation,
    length: colorAnimation.length,
  };
};

export default mode;
