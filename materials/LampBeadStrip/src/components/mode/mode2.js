import { arrayFill } from '../utils';

/** 跳变 */
const mode = (colors, option, closeRgb) => {
  const { segmented } = option || {};
  if (!segmented) {
    let allColor = [];
    colors.forEach(element => {
      const colorList = arrayFill(8, element);
      allColor = [...allColor, ...colorList];
    });
    const colorList = allColor.map(item => arrayFill(20, item));
    return {
      colorList,
      length: colorList.length,
    };
  }
  let num = 0;
  let currColors = colors;
  switch (colors.length) {
    case 2:
      num = 10;
      currColors = arrayFill(2, colors).flat(1);
      break;
    case 3:
      num = 7;
      currColors = arrayFill(20, colors).flat(1);
      break;
    case 4:
      num = 5;
      currColors = arrayFill(2, colors).flat(1);
      break;
    case 5:
      num = 4;
      currColors = arrayFill(2, colors).flat(1);
      break;
    case 6:
      num = 5;
      currColors = arrayFill(2, colors).flat(1);
      break;
    case 7:
      num = 5;
      currColors = arrayFill(4, colors).flat(1);
      break;
    case 8:
      num = 5;
      break;
    default:
      break;
  }
  const allColorList = currColors.map(item => arrayFill(num, item)).flat(1);
  const colorList = arrayFill(allColorList.length / num, '')
    .map((_, index) => {
      const endIndex = index * num + 20;
      if (endIndex >= allColorList.length) return [];
      const list = allColorList.slice(index * num, index * num + 20).reverse();
      return arrayFill(8, list);
    })
    .flat(1);
  return {
    colorList,
    length: colorList.length,
  };
};

export default mode;
