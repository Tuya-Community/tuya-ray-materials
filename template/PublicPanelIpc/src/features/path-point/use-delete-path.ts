import { useRef, useEffect } from 'react';
import { usePageEvent } from '@ray-js/ray';
import { deletePath } from './delete-path';

export function useDeletePath() {
  const hand = useRef<ReturnType<typeof deletePath>>();
  if (!hand.current) {
    hand.current = deletePath();
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
