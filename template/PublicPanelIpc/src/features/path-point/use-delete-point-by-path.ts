import { useRef, useEffect } from 'react';
import { usePageEvent } from '@ray-js/ray';
import { deletePointByPath } from './delete-point-by-path';

export function useDeletePointByPath() {
  const hand = useRef<ReturnType<typeof deletePointByPath>>();
  if (!hand.current) {
    hand.current = deletePointByPath();
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
