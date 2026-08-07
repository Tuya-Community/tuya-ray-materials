/*
 * @Author: hkc
 * @Date: 2025-09-08 10:33:45
 * @LastEditors: hkc
 * @LastEditTime: 2025-10-17 11:57:09
 * @Description:
 */
import Res from '@/res';

// 播放状态
export enum PlayStatus {
  Initial = 'initial', // 初始状态
  Play = 'play', // 播放中
  Pause = 'pause', // 已暂停
  Resume = 'resume', // 恢复播放
}

// 播放速度
export enum PlaybackRate {
  slow = 0.5,
  normal = 1,
  fast = 2,
}

// 播放速度列表
export const playbackRateList = [
  {
    value: PlaybackRate.slow,
    icon: Res.slowRateImg,
    iconName: 'slowRateImg',
  },
  {
    value: PlaybackRate.normal,
    icon: Res.normalRateImg,
    iconName: 'normalRateImg',
  },
  {
    value: PlaybackRate.fast,
    icon: Res.fastRateImg,
    iconName: 'fastRateImg',
  },
];

// 转写模式
export enum TransferType {
  File, // 文件转写
  Realtime, // 实时转写
}

// 文件同步状态
export enum FileSyncStatus {
  Initial, // 未同步
  Syncing, // 上传中
  Success, // 上传成功
  Fail, // 上传失败
}

// 说话人颜色枚举
export enum SpeakerColor {
  Speaker0 = '#FF9A3C',
  Speaker1 = '#14B031',
  Speaker2 = '#515AFF',
  Speaker3 = '#F71BB5',
  Speaker4 = '#1BB2F7',
  Speaker5 = '#A25104',
  Speaker6 = '#0B02AC',
  Speaker7 = '#FF5555',
  Speaker8 = '#0078B0',
  Speaker9 = '#00B0AA',
}
