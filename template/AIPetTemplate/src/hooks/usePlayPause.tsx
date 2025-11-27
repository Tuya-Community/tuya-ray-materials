import { useCallback } from 'react';
import { useBoolean } from 'ahooks';
import { useDebounceState } from './useDebounceState';

export const usePlayPause = () => {
  const [isPlay, { setTrue: play, setFalse: pause }] = useBoolean();
  const [isVisible, { setImmediate, setDebounced }] = useDebounceState(true, 3000);

  /**
   * 切换播放状态后，立即切换暂停按钮，3秒后自动隐藏
   */
  const playFn = useCallback(() => {
    play();
    setDebounced(false);
  }, []);

  /**
   * 切换播放状态后，立即切换播放按钮，一直展示不隐藏
   */
  const pauseFn = useCallback(() => {
    pause();
    setImmediate(true);
  }, []);

  return {
    isPlay,
    isVisible,
    play: playFn,
    pause: pauseFn,
  };
};
