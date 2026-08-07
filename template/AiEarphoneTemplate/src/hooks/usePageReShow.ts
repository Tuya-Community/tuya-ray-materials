/*
 * @Author: hkc
 * @Date: 2025-12-12 11:21:29
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-12 11:21:37
 * @Description: 页面重新显示钩子, 首次显示时不执行
 */
import { usePageEvent } from '@ray-js/ray';
import { useRef } from 'react';

export function usePageReShow(fn: (...arg: any) => any) {
  const isMounted = useRef(false);
  usePageEvent('onShow', () => {
    if (isMounted.current) fn();
    isMounted.current = true;
  });
}
