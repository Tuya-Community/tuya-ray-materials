/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:27:45
 * @Description:
 */
import { arrayFill, generateGradientColors } from '../utils';

/** 反弹 */
const mode = (colors, option, closeRgb) => {
  const { expand } = option || {};
  const closeColors = arrayFill(20, closeRgb);
  const colorList = colors % 2 === 0 ? colors : arrayFill(2, colors).flat(1);
  let direction = 'right';
  let isFirst = true;
  const colorAnimation = colorList
    .map((item, index) => {
      const currColors = !expand
        ? arrayFill(5, item)
        : generateGradientColors([item, colorList[index + 1] || colorList[0]], 5);
      const colorRoadList = arrayFill(isFirst ? 16 : 15, '').map((_, ind) => {
        const currList = [...closeColors];
        currList.splice(isFirst ? ind : ind + 1, 5, ...currColors);
        return direction === 'right' ? currList : currList.reverse();
      });
      isFirst = false;
      direction = direction === 'right' ? 'left' : 'right';
      return colorRoadList;
    })
    .flat(1);
  return {
    colorList: colorAnimation,
    length: colorAnimation.length,
  };
};

export default mode;
