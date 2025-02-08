/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:24:33
 * @Description:
 */
import { arrayFill } from '../utils';

/** 彩虹 */
const mode = (colors, option, closeRgb) => {
  const { direction } = option || {};
  let colorList = colors;
  switch (colors.length) {
    case 2:
    case 4:
    case 6:
    case 8:
      colorList = arrayFill(5, colors).flat(1);
      break;
    case 3:
    case 7:
      colorList = arrayFill(10, colors).flat(1);
      break;
    case 5:
      colorList = arrayFill(2, colors).flat(1);
      break;
    default:
      break;
  }
  const allColor = colorList.map(item => arrayFill(4, item)).flat(1);
  const colorAnimation = allColor.map((_, index) => {
    const endIndex = index + 20;
    const endColor =
      endIndex > allColor.length - 1 ? allColor.slice(0, endIndex - allColor.length + 1) : [];
    const list = [...allColor.slice(index, index + 20), ...endColor];
    return direction ? list : list.reverse();
  });
  return {
    colorList: colorAnimation,
    length: colorAnimation.length,
  };
};

export default mode;
