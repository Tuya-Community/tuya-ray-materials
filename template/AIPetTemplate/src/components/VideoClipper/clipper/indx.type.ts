export interface DetailHandler {
  /**
   * 当前触发的 handler 标识
   */
  tag: 'leftHandler' | 'rightHandler';
  /**
   * 裁减开始时间，单位秒
   */
  clipStartTime: number;
  /**
   * 裁减结束时间，单位秒
   */
  clipEndTime: number;
  /**
   * 当前播放器定位进度，单位秒
   */
  progress: number;
}

export interface DetailBg {
  /**
   * 当前播放器轨道偏移的进度位置，单位秒
   */
  clipMovedTime: number;
  /**
   * 当前播放器定位进度，单位秒
   */
  progress: number;
}

export interface DetailIndicator {
  /**
   * 当前播放器定位进度，单位秒
   */
  progress: number;
}
