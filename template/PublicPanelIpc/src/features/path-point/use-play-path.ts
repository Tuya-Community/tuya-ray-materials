import { useRef, useEffect, useState } from 'react';
import { usePageEvent } from '@ray-js/ray';
import { playPath } from './play-path';

export function usePlayPath() {
  // const [pathPlaying, setPathPlaying] = useState(false);
  const [running, setRunning] = useState(false);
  const hand = useRef<ReturnType<typeof playPath>>();
  if (!hand.current) {
    hand.current = playPath();
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

  const startPlay = async (pathId: number) => {
    setRunning(true);
    await hand.current.start(pathId);
    setRunning(false);
  };
  const endPay = async (pathId: number) => {
    await hand.current.stop(pathId);
    setRunning(false);
  };
  return {
    startPlay,
    endPay,
    running,
  };
}
