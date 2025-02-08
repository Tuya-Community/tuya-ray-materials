/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:27:13
 * @Description:
 */
import { arrayFill, splitArray } from '../utils';

/** 闪现 */
const mode = (colors, option, closeRgb) => {
  const { segmented } = option || {};
  const closeColors = arrayFill(4, closeRgb);
  // 全段
  if (!segmented) {
    const colorAnimation = colors
      .map(item => {
        let partCheckList = arrayFill(5, false);
        const partColors = arrayFill(4, item);
        const fillColors = arrayFill(6, '')
          .map((_, index) => {
            if (index) {
              const currIndexList = [];
              partCheckList.forEach((check, ind) => {
                !check && currIndexList.push(ind);
              });
              const checkIndex = Math.ceil(Math.random() * (currIndexList.length - 1));
              partCheckList[currIndexList[checkIndex]] = true;
            }
            const list = partCheckList.map(part => (part ? partColors : closeColors)).flat(1);
            return arrayFill(2, list);
          })
          .flat(1);
        fillColors.push(...arrayFill(3, arrayFill(20, item)));
        return fillColors;
      })
      .flat(1);
    return {
      colorList: colorAnimation,
      length: colorAnimation.length,
    };
  }
  // 分段
  let colorList = colors;
  switch (colors.length) {
    case 2:
    case 3:
    case 4:
    case 6:
    case 7:
    case 8:
      colorList = arrayFill(5, colors).flat(1);
      break;
    case 5:
      break;
    default:
      break;
  }
  const splitColorList = splitArray(colorList, 5);
  const colorAnimation = splitColorList
    .map(colorItemList => {
      let partCheckList = arrayFill(5, false);
      const fillColors = arrayFill(6, '')
        .map((_, index) => {
          if (index) {
            const currIndexList = [];
            partCheckList.forEach((item, ind) => {
              !item && currIndexList.push(ind);
            });
            const checkIndex = Math.ceil(Math.random() * (currIndexList.length - 1));
            partCheckList[currIndexList[checkIndex]] = true;
          }
          const list = partCheckList
            .map((item, indexs) => (item ? arrayFill(4, colorItemList[indexs]) : closeColors))
            .flat(1);
          return arrayFill(3, list);
        })
        .flat(1);
      fillColors.push(...arrayFill(4, fillColors[fillColors.length - 1]));
      return fillColors;
    })
    .flat(1);
  return {
    colorList: colorAnimation,
    length: colorAnimation.length,
  };
};
export default mode;
