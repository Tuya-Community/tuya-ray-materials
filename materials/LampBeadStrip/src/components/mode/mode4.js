/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:23:35
 * @Description:
 */
import { splitNumber, arrayFill } from '../utils';

/** 闪烁 */
const mode = (colors, option, closeRgb) => {
  const { segmented } = option || {};
  const rangeNum = 7;
  if (!segmented) {
    const colorList = colors
      .map(item => [
        ...arrayFill(rangeNum, arrayFill(20, item)),
        ...arrayFill(rangeNum, arrayFill(20, closeRgb)),
      ])
      .flat(1);
    return {
      colorList,
      length: colorList.length,
    };
  }
  const segmentArr = splitNumber(20, colors.length);
  const partColor = segmentArr
    .map((num, index) => {
      return arrayFill(num, colors[index]);
    })
    .flat(1);
  const colorList = [
    ...arrayFill(rangeNum, partColor),
    ...arrayFill(rangeNum, arrayFill(20, closeRgb)),
  ];
  return {
    colorList,
    length: colorList.length,
  };
};
export default mode;
