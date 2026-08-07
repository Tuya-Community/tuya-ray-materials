import { useState, useRef, useEffect } from 'react';
import { createInnerAudioContext } from '@ray-js/ray';
import { PlayStatus } from '../enum';

/**
 * 音频播放器管理Hook
 * 负责管理音频播放状态、播放进度和音频上下文
 *
 * @returns {Object} 音频播放器状态和控制方法
 * @property {boolean} playerShow - 播放器显示状态
 * @property {Function} setPlayerShow - 设置播放器显示状态
 * @property {PlayStatus} playStatus - 播放状态
 * @property {Function} setPlayStatus - 设置播放状态
 * @property {number} currentPlaySecond - 当前播放秒数
 * @property {Function} setCurrentPlaySecond - 设置当前播放秒数
 * @property {any} audioContext - 音频上下文对象
 */
export const useAudioPlayer = () => {
  const [playerShow, setPlayerShow] = useState(false);
  const [playStatus, setPlayStatus] = useState(PlayStatus.Initial);
  const [currentPlaySecond, setCurrentPlaySecond] = useState<number>();
  const audioContextRef = useRef<any>(null);

  useEffect(() => {
    // 创建内部 audio 上下文 InnerAudioContext 对象
    audioContextRef.current = createInnerAudioContext();

    // 清理函数：组件卸载时销毁音频上下文
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.destroy?.();
      }
    };
  }, []);

  return {
    playerShow,
    setPlayerShow,
    playStatus,
    setPlayStatus,
    currentPlaySecond,
    setCurrentPlaySecond,
    audioContext: audioContextRef.current,
  };
};
