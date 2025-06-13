import { useRef, useEffect } from 'react';
import { usePageEvent } from '@ray-js/ray';
import { updatePathName } from './update-path-name';

export function useUpdatePathName() {
  const hand = useRef<ReturnType<typeof updatePathName>>();
  if (!hand.current) {
    hand.current = updatePathName();
  }
  useEffect(() => {
    return () => {
      hand.current.end();
    };
  }, []);
  usePageEvent('onUnload', () => {
    hand.current.end();
  });
  return hand.current;
}
