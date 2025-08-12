/* eslint-disable @typescript-eslint/no-empty-function */

interface Music {
  id: number;
  trackId?: number;
  trackTitle?: string;
  artist?: string;
  playableCode?: string;
  coverUrlLarge?: string;
}

export interface MusicBtnItem {
  img: any;
  id: string;
  onPress: (music?: Music) => void;
}

export interface IProps {
  /**
   * @description.zh 类名
   * @description.en class name
   */
  className?: string;
  /**
   * @description.zh 样式
   * @description.en Style
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 当前音乐信息
   * @description.en Current music information
   */
  currentMusicInfo?: Music;
  /**
   * @description.zh 音乐列表
   * @description.en Music list
   */
  musicList?: Music[];
  /**
   * @description.zh 设备是否有音乐
   * @description.en Whether the device has music
   */
  deviceHasMusic?: boolean;
  /**
   * @description.zh 默认音乐名称
   * @description.en Default music name
   */
  defaultSoundName?: string;
  /**
   * @description.zh 是否正在播放
   * @description.en Is playing
   */
  isPlaying?: boolean;
  /**
   * @description.zh 是否显示播放列表
   * @description.en Whether to show the playlist
   */
  playListShow?: boolean;
  /**
   * @description.zh 点击播放按钮事件
   * @description.en Click play button event
   */
  onPlay?: (music: Music) => void;
  /**
   * @description.zh 点击暂停按钮事件
   * @description.en Click pause button event
   */
  onPause?: (music: Music) => void;
  /**
   * @description.zh 点击下一首按钮事件
   * @description.en Click the next button event
   */
  onNext?: () => void;
  /**
   * @description.zh 点击播放列表按钮事件
   * @description.en Click the playlist button event
   */
  onPlayListShow?: () => void;
}

export const defaultProps: IProps = {
  currentMusicInfo: {} as Music,
  deviceHasMusic: false,
  defaultSoundName: '',
  isPlaying: false,
  musicList: [],
  playListShow: false,
  onPlay: () => {},
  onPause: () => {},
  onNext: () => {},
  onPlayListShow: () => {},
};
