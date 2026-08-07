/*
 * @Author: hkc
 * @Date: 2025-12-18 17:00:19
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-18 17:03:04
 * @Description: 应用重新显示钩子, 首次显示时不执行
 */
import { useAppEvent } from '@ray-js/ray';
import { useRef } from 'react';

export function useAppReShow(fn: (...arg: any) => any) {
  const isMounted = useRef(false);
  useAppEvent('onShow', () => {
    if (isMounted.current) fn();
    isMounted.current = true;
  });
}
