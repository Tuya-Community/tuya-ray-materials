/*
 * @Author: mjh
 * @Date: 2024-10-21 14:23:12
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-21 14:28:07
 * @Description:
 */
import { arrayFill, getListByIndex, findOverlapIndices, averageRGBColors } from '../utils';

/** 穿梭 */
const mode = (colors, option, closeRgb) => {
  const min = -1;
  const max = 20;
  let fastIndex = min;
  let fastColorIndex = 0;
  let fastDirection = 0;
  let slowIndex = max;
  let slowColorIndex = 1;
  let slowDirection = 1;
  let time = colors.length * 26 * 2 - 1;
  const closeList = arrayFill(20, closeRgb);
  const colorList = [];
  while (time >= 0) {
    const currCloseList = [...closeList];
    // fast
    let fastIndexArr = [];
    const fastColor = getListByIndex(colors, fastColorIndex);
    if (!fastDirection) {
      const fastStartIndex = fastIndex - 5 + 1;
      const fastEndIndex = fastIndex;
      fastIndexArr = [fastStartIndex, fastEndIndex];
      const fastColorNumber = 5 + fastStartIndex > 5 ? 5 : 5 + fastStartIndex;
      const fastColorList = arrayFill(fastColorNumber, fastColor);
      if (fastColorNumber > 0) {
        currCloseList.splice(
          fastStartIndex >= 0 ? fastStartIndex : 0,
          fastColorNumber,
          ...fastColorList
        );
      }
    } else {
      const fastStartIndex = fastIndex;
      const fastEndIndex = 5 + fastIndex - 1;
      fastIndexArr = [fastStartIndex, fastEndIndex];
      const fastColorNumber =
        fastStartIndex < 0 ? 5 + fastStartIndex : 20 - fastIndex > 5 ? 5 : 20 - fastIndex;
      const fastColorList = arrayFill(fastColorNumber, fastColor);
      if (fastColorNumber > 0) {
        currCloseList.splice(
          fastStartIndex >= 0 ? fastStartIndex : 0,
          fastColorNumber,
          ...fastColorList
        );
      }
    }

    // slow
    let slowIndexArr = [];
    const slowColor = getListByIndex(colors, slowColorIndex);
    if (slowDirection) {
      const slowStartIndex = slowIndex;
      const slowEndIndex = 5 + slowIndex - 1;
      slowIndexArr = [slowStartIndex, slowEndIndex];
      const slowColorNumber =
        slowStartIndex < 0 ? 5 + slowStartIndex : 20 - slowIndex > 5 ? 5 : 20 - slowIndex;
      const slowColorList = arrayFill(slowColorNumber, slowColor);
      if (slowColorNumber > 0) {
        currCloseList.splice(
          slowStartIndex >= 0 ? slowStartIndex : 0,
          slowColorNumber,
          ...slowColorList
        );
      }
    } else {
      const slowStartIndex = slowIndex - 5 + 1;
      const slowEndIndex = slowIndex;
      slowIndexArr = [slowStartIndex, slowEndIndex];
      const slowColorNumber = 5 + slowStartIndex > 5 ? 5 : 5 + slowStartIndex;
      const slowColorList = arrayFill(slowColorNumber, slowColor);
      if (slowColorNumber > 0) {
        currCloseList.splice(
          slowStartIndex >= 0 ? slowStartIndex : 0,
          slowColorNumber,
          ...slowColorList
        );
      }
    }

    // 合并逻辑
    const staggerList = findOverlapIndices(fastIndexArr, slowIndexArr);
    if (staggerList.length) {
      const averageColor = averageRGBColors([fastColor, slowColor]);
      currCloseList.splice(
        staggerList[0],
        staggerList.length,
        ...arrayFill(staggerList.length, averageColor)
      );
    }
    if (!fastDirection) {
      fastIndex += 2;
    } else {
      fastIndex -= 2;
    }
    if (slowDirection) {
      slowIndex--;
    } else {
      slowIndex++;
    }
    if (!fastDirection && fastIndexArr[0] >= max) {
      fastColorIndex++;
      fastDirection = 1;
      fastIndex = max;
    }
    if (fastDirection && fastIndexArr[1] <= min) {
      fastColorIndex++;
      fastDirection = 0;
      fastIndex = min;
    }
    if (!slowDirection && slowIndexArr[0] === max) {
      slowColorIndex++;
      slowDirection = 1;
      slowIndex = max;
    }
    if (slowDirection && slowIndexArr[1] === min) {
      slowColorIndex++;
      slowDirection = 0;
      slowIndex = min;
    }
    time--;
    colorList.push(currCloseList);
  }
  return {
    colorList,
    length: colorList.length,
  };
};

export default mode;
