import React from 'react';
import { IItem } from './props';
// import { transformRpxToPx } from '../utils';

/**
 * set visible range for recycle-view
 * @param overScanCount the overscan count above or below offset
 */
export function useVisibleRange(overScanCount: number): [number, number, (offset: number) => void] {
  // 合并为单个 state，setRange 只触发一次 re-render（React 17 小程序环境不自动批处理 setState）
  const [range, setRangeState] = React.useState(() => ({
    start: -overScanCount,
    end: 2 * overScanCount,
  }));

  const setRange = React.useCallback(
    (offset: number) => {
      const ns = offset - overScanCount;
      const ne = offset + 2 * overScanCount;
      // 可见范围未变化时跳过 setState，避免触发无效 re-render
      setRangeState(prev => (prev.start === ns && prev.end === ne ? prev : { start: ns, end: ne }));
    },
    [overScanCount]
  );

  return [range.start, range.end, setRange];
}

/**
 * get size map array include height and offsetTop, in addition it will add __index__ to data
 * @param data raw data to get size map array
 */
export const useSizeData = (data: IItem[]) => {
  return React.useMemo(() => {
    let offsetTop = 0;
    return data.map(({ height }) => {
      offsetTop += height;
      return {
        height,
        offsetTop: offsetTop - height,
      };
    });
  }, [data]);
};
