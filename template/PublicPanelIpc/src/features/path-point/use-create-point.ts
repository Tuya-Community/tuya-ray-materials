import { useRef, useEffect } from 'react';
import { usePageEvent } from '@ray-js/ray';
import { createPoint } from './create-point';

export function useCreatePoint(pathId: number) {
  const hand = useRef<ReturnType<typeof createPoint>>();
  if (!hand.current) {
    hand.current = createPoint(pathId);
  }
  useEffect(() => {
    return () => {
      if (hand.current) {
        hand.current.end();
      }
    };
  }, []);
  usePageEvent('onUnload', () => {
    hand.current.end();
  });
  return hand.current;
}
