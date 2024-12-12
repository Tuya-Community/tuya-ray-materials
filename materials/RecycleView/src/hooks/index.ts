/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { IItem } from '../components/RecycleView/props';
// import { transformRpxToPx } from '../utils';

/**
 * set visible range for recycle-view
 * @param overScanCount the overscan count above or below offset
 */
export function useVisibleRange(overScanCount: number): [number, number, (offset: number) => void] {
  const [start, setStart] = React.useState(0 - overScanCount);
  const [end, setEnd] = React.useState(0 + 2 * overScanCount);

  const setRange = React.useCallback(
    (offset: number) => {
      setStart(offset - overScanCount);
      setEnd(offset + 2 * overScanCount);
    },
    [setStart, setEnd]
  );

  return [start, end, setRange];
}

/**
 * get size map array include height and offsetTop, in addition it will add __index__ to data
 * @param data raw data to get size map array
 */
export const useSizeData = (data: IItem[]) => {
  return React.useMemo(() => {
    let offsetTop = 0;
    return data.map(({ height }, index) => {
      offsetTop += height;
      data[index].__index__ = index;
      return {
        height,
        offsetTop: offsetTop - height,
      };
    });
  }, [data.length]);
};

/**
 * set scroll top according to scrollTopByIndex prop (prior to scrollTop prop)
 */
// export function useScrollTop({
//   scrollTopByIndex = 0,
//   sizeData,
//   scrollTop = 0,
//   headerHeight,
// }: {
//   scrollTopByIndex?: number;
//   sizeData: ReturnType<typeof useSizeData>;
//   headerHeight: number;
//   scrollTop?: number;
// }) {
//   return React.useMemo(() => {
//     if (scrollTopByIndex !== undefined) {
//       scrollTop = transformRpxToPx(sizeData[scrollTopByIndex].offsetTop + headerHeight);
//     }
//     return scrollTop || 0;
//   }, [scrollTopByIndex, sizeData, scrollTop, headerHeight]);
// }
