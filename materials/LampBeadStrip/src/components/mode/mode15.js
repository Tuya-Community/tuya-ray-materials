/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:28:35
 * @Description:
 */
import { arrayFill } from '../utils';

/** 乱闪 */
const mode = (colors, option, closeRgb) => {
  const numberRange = [8, 10, 15, 18];
  const closeColors = arrayFill(20, closeRgb);
  const colorAnimation = arrayFill(20, '')
    .map(() => {
      const lightNum = numberRange[Math.ceil(Math.random() * (numberRange.length - 1))];
      const lightArr = [...closeColors];
      arrayFill(lightNum, '').forEach(() => {
        const color = colors[Math.round(Math.random() * (colors.length - 1))];
        const lightIndexList = lightArr
          .map((item, index) => (item !== closeRgb ? null : index))
          .filter(item => item !== null);
        const randomIndex = Math.random() * (lightIndexList.length - 1);
        const index = Math.round(randomIndex);
        const lightIndex = lightIndexList[index];
        lightArr[lightIndex] = color;
      });
      return arrayFill(3, lightArr);
    })
    .flat(1);
  return {
    colorList: colorAnimation,
    length: colorAnimation.length,
  };
};

export default mode;
