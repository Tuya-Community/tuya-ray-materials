import { useRef, useEffect, useState } from 'react';
import { usePageEvent } from '@ray-js/ray';
import { playPoint } from './play-point';

export function usePlayPoint() {
  // const [pointPlaying, setPointPlaying] = useState(false);
  const [running, setRunning] = useState(false);
  const hand = useRef<ReturnType<typeof playPoint>>();
  if (!hand.current) {
    hand.current = playPoint();
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

  const startPlay = async (pathId: number, id: number) => {
    setRunning(true);
    await hand.current.start(pathId, id);
    setRunning(false);
  };
  const endPay = async (pathId: number, id: number) => {
    await hand.current.stop(pathId, id);
    setRunning(false);
  };
  return {
    startPlay,
    endPay,
    running,
  };
}
