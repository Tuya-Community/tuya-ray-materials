import { generateGradientColors, getListByIndex, arrayFill } from '../utils';

/** 渐变 */
const mode = (colors, option, closeRgb) => {
  const { segmented } = option || {};
  let allColor = [];
  colors.forEach((element, index) => {
    const afterColor = colors[index + 1] || colors[0];
    const colorList = generateGradientColors([element, afterColor], 10);
    allColor = [...allColor, ...colorList];
  });
  if (!segmented) {
    const colorList = allColor.map(item => arrayFill(20, item));
    return {
      colorList,
      length: colorList.length,
    };
  }
  const colorList = allColor.map((_, index) => {
    return [
      ...arrayFill(4, allColor[index]),
      ...arrayFill(4, getListByIndex(allColor, index + 10)),
      ...arrayFill(4, getListByIndex(allColor, index + 20)),
      ...arrayFill(4, getListByIndex(allColor, index + 30)),
      ...arrayFill(4, getListByIndex(allColor, index + 40)),
    ];
  });
  return {
    colorList,
    length: colorList.length,
  };
};

export default mode;
