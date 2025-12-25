/* eslint-disable no-shadow */
export type TMusicData = {
  musicName: string;
  id: number;
  checked: boolean;
  dpCode: string;
  dpId: number;
  musicIconUrl: string;
  musicData: string;
  musicIconDisplaySize: string;
  musicIconDisplayType: number;
  musicNameRosettaKey: string;
  sort: number;
};

export enum EMusicDpCode {
  music_data = 'music_data',
  // 如果设备中定义的音乐 dp code 不存在，在这里添加 设备的音乐dp code
  // TODO: xxx = xxx
}

export enum ELocalMusicDp {
  // 设备本地音乐
  dreamlightmic_music_data = 'dreamlightmic_music_data',
  // 如果设备中定义的音乐 dp code 不存在，在这里添加 设备的音乐dp code，注意区分本地或 App 音乐
  // TODO: xxx = xxx
}

export type MusicConfig = {
  /**
   * 音乐律动配置 ID
   */
  id: number;
  /**
   * 音乐律动模式，0：跳转，1：渐变
   */
  mode: 0 | 1;
  /**
   * 音乐律动颜色配置
   */
  colorArea: Array<{
    area: [number, number];
    hue: number;
    saturation: number;
    value: number;
  }>;
};
