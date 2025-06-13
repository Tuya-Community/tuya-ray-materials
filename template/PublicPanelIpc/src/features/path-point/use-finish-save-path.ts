import { useRef, useEffect } from 'react';
import { usePageEvent } from '@ray-js/ray';
import { finishSavePath } from './finish-save-path';

export function useFinishSavePath() {
  const hand = useRef<ReturnType<typeof finishSavePath>>();
  if (!hand.current) {
    hand.current = finishSavePath();
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
