import { useRef, useEffect } from 'react';
import { usePageEvent } from '@ray-js/ray';
import { createPath } from './create-path';

export function useCreatePath() {
  const hand = useRef<ReturnType<typeof createPath>>();
  if (!hand.current) {
    hand.current = createPath();
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
