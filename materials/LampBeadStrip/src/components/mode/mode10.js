/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:24:06
 * @Description:
 */
import { arrayFill } from '../utils';

/** 流水 */
const mode = (colors, option, closeRgb) => {
  const { direction } = option || {};
  let numList = [];
  switch (colors.length) {
    case 2:
      numList = arrayFill(colors.length, 15);
      break;
    case 3:
      numList = arrayFill(colors.length, 10);
      break;
    case 4:
    case 5:
      numList = arrayFill(colors.length, 6);
      break;
    case 6:
    case 7:
    case 8:
      numList = arrayFill(colors.length, 5);
      break;
    default:
      break;
  }
  const allColor = numList.map((item, index) => arrayFill(item, colors[index])).flat(1);
  const colorList = allColor.map((_, index) => {
    const list = [...allColor.slice(index), ...allColor.slice(0, index)];
    return direction ? list : list.reverse();
  });
  return {
    colorList,
    length: colorList.length,
  };
};

export default mode;
