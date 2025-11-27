import { utils } from '@ray-js/panel-sdk';
import { normalizeFilePath } from '@/utils';
import { clearVideoThumbnailsAsync, fetchVideoThumbnailsAsync } from '@/api/nativeApi';
import Render from './index.rjs';
import { DetailHandler, DetailBg, DetailIndicator } from './indx.type';

let render;

Component({
  properties: {
    // Video 实例 id，用于监听视频的播放进度
    videoId: {
      type: String,
      value: '',
    },
    // 视频源地址
    src: {
      type: String,
      value: '#e9e9e9',
    },
    // 视频播放时长，单位秒
    duration: {
      type: Number,
      value: 0,
      // eslint-disable-next-line func-names
      observer: function (newVal, oldVal) {
        // 只有在 duration 首次变更后，触发更新
        if (oldVal === 0 && newVal > 0) {
          this.initClipperEnv();
        }
      },
    },
    // 视频剪切最小时长，单位秒
    clipMinTime: {
      type: Number,
      value: 3,
    },
    // 视频剪切最大时长，单位秒
    clipMaxTime: {
      type: Number,
      value: 15,
    },
    // 一屏下可展示的视频缩略图数量
    thumbnailCount: {
      type: Number,
      value: 7,
    },
    // 单个视频缩略图高度，单位 rpx
    thumbnailHeight: {
      type: Number,
      value: 102,
    },
  },

  data: {
    // 当前裁减器是否已经准备好，处于可操作性的状态
    isReady: false,
    // 视频播放进度条从左侧到屏幕最左侧的距离，用于计算拖动进度条时的偏移量
    offsetLeft: 0,
    // 视频播放进度条从左侧到屏幕最右侧的距离，用于计算拖动进度条时的偏移量
    offsetRight: 375,
    // 视频缩略图列表
    thumbImages: [],
    // 视频播放进度
    progress: 0,
    // 裁剪器宽度
    clipperWidth: 343,
    // 裁剪器缩略图背景宽度
    clipperTrackWidth: 311,
    // 裁减拖动器
    clipHandlerWidth: 16,
    // 视频缩略图宽度
    thumbnailWidth: 56,
    // 视频缩略图的总数
    totalThumbnails: 7,
    // 缩略图轨道宽度
    totalThumbnailsWidth: 311,
    // 定位器宽度
    indicatorWidth: 4,
    // 开始裁剪时间，由左侧 handler 拖动位置计算得出
    clipStartTime: 0,
    // 结束裁减时间，由右侧 handler 拖动位置计算得出
    clipEndTime: 15,
    // 视频剪切最大时长，单位秒，在这里存在的原因是因为需要确保小于 duration
    clipMaxTime: 15,
    // 偏移裁剪时间，由 bg track 拖动位置计算得出
    clipMovedTime: 0,
    // 当轨道拖动到指定的时间位置时，触发获取视频缩略图
    fetchingTimes: {},
  },

  observers: {
    clipStartTime(value) {
      render && render.updateStartTime(value);
    },
    clipEndTime(value) {
      render && render.updateEndTime(value);
    },
    clipMovedTime(value) {
      render && render.updateMovedTime(value);
    },
  },

  // lifetimes: {
  //   detached() {
  //     const videoName = normalizeFilePath(this.data.src);
  //     clearVideoThumbnailsAsync({ videoName }).catch(err =>
  //       console.log('clearVideoThumbnailsAsync fail', err)
  //     );
  //   },
  // },

  methods: {
    getRectAsync(selector: string) {
      return new Promise(resolve => {
        this.createSelectorQuery()
          .select(selector)
          .boundingClientRect(rect => resolve(rect))
          .exec();
      });
    },
    /**
     * 初始化裁减器所需要的各种变量
     */
    initClipperEnv() {
      // console.log('=== this.data.clipMaxTime', this.data.clipMaxTime);
      const { clipStartTime, clipMaxTime, duration, clipMovedTime } = this.data;
      const endTime = Math.min(clipMaxTime, duration);
      const maxTime = Math.min(clipMaxTime, duration);
      render = new Render(this);
      render.init(this.data.videoId, clipStartTime, endTime, clipMovedTime);
      // 确保裁减的结束时长和最大裁减时长的最大时长都不超过视频总时长
      this.setData({ clipEndTime: endTime, clipMaxTime: maxTime });
      Promise.all([
        this.getRectAsync('#video-clipper'),
        this.getRectAsync('.video-clipper__track'),
        this.getRectAsync('.video-clipper__indicator'),
        this.getRectAsync('.video-clipper__handler-left'),
      ]).then(([clipperRect, trackRect, indicatorRect, handlerRect]) => {
        const clipperTrackWidth = trackRect.width;
        const clipperInfo = this.getClipperInfo(clipperTrackWidth);
        this.setData({
          isReady: true,
          clipperTrackWidth,
          thumbnailWidth: clipperInfo.thumbnailWidth,
          totalPages: clipperInfo.totalPages,
          totalThumbnails: clipperInfo.totalThumbnails,
          totalThumbnailsWidth: clipperInfo.totalThumbnailsWidth,
          fetchingTimes: clipperInfo.fetchingTimes,
          clipperWidth: clipperRect.width,
          offsetLeft: clipperRect.left,
          offsetRight: clipperRect.right,
          indicatorWidth: indicatorRect.width,
          clipHandlerWidth: handlerRect.width,
        });
        this.fetchVideoThumbnails(0);
      });
    },

    /**
     * 获取视频缩略图
     *
     * @param {number} startTime - 视频缩略图的开始时间，单位秒
     */
    fetchVideoThumbnails(startTime = 0) {
      const {
        src,
        clipMaxTime,
        fetchingTimes,
        totalThumbnails,
        thumbnailCount,
        thumbnailWidth,
        thumbnailHeight,
        thumbImages,
      } = this.data;
      if (fetchingTimes[startTime] === 'fetching') {
        return;
      }
      if (fetchingTimes[startTime] === 'fetched') {
        return;
      }
      const realPath = normalizeFilePath(src);
      const sTime = Math.floor(startTime * 1000);
      const eTime = Math.min(
        sTime + Math.floor(clipMaxTime * 1000),
        Math.floor(this.data.duration * 1000)
      );
      const params = {
        filePath: realPath,
        startTime: sTime,
        endTime: eTime,
        thumbnailCount: Math.min(thumbnailCount, totalThumbnails - thumbImages.length),
        thumbnailWidth: thumbnailWidth * 3,
        thumbnailHeight: thumbnailHeight * 3,
      };
      this.setData({ fetchingTimes: { ...fetchingTimes, [startTime]: 'fetching' } });
      fetchVideoThumbnailsAsync(params)
        .then(res => {
          this.setData({ fetchingTimes: { ...fetchingTimes, [startTime]: 'fetched' } });
          if (res && res.thumbnailsPath) {
            this.setData({ thumbImages: [...this.data.thumbImages, ...res.thumbnailsPath] });
          }
        })
        .catch(err => {
          this.setData({ fetchingTimes: { ...fetchingTimes, [startTime]: 'pending' } });
        });
    },

    /**
     * 根据视频总时长和最大剪切时长计算视频缩略图数量
     */
    getClipperInfo(clipperWidth: number) {
      const { duration, clipMaxTime, thumbnailCount } = this.data;
      const isLessThanClipperMaxTime = duration < clipMaxTime;
      const thumbnailWidth = clipperWidth / thumbnailCount;
      let totalPages: number;
      let totalThumbnails: number;
      let totalThumbnailsWidth: number;
      let totalThumbnailsCeil: number;
      if (isLessThanClipperMaxTime) {
        totalPages = 1;
        totalThumbnails = thumbnailCount;
        totalThumbnailsWidth = clipperWidth;
        totalThumbnailsCeil = thumbnailCount;
      } else {
        totalPages = Math.ceil(duration / clipMaxTime);
        totalThumbnails = (clipperWidth * (duration / clipMaxTime)) / thumbnailWidth;
        totalThumbnailsWidth = thumbnailWidth * totalThumbnails;
        totalThumbnailsCeil = Math.ceil(totalThumbnails);
      }
      const fetchingTimes = {};
      for (let i = 0; i < totalPages; i++) {
        fetchingTimes[i * clipMaxTime] = 'pending';
      }
      return {
        thumbnailWidth,
        totalPages,
        totalThumbnails: totalThumbnailsCeil,
        totalThumbnailsWidth,
        fetchingTimes,
      };
    },

    formatDetail(data: {
      tag: string;
      clipMovedTime: number;
      clipStartTime: number;
      clipEndTime: number;
      progress: number;
    }) {
      const startTime = data.clipMovedTime + data.clipStartTime;
      const endTime = data.clipMovedTime + data.clipEndTime;
      return {
        tag: data.tag,
        progress: utils.inMaxMin(startTime, endTime, data.progress),
        clipTimes: [startTime, endTime],
      };
    },

    onHandlerStart(data: DetailHandler) {
      const detail = this.formatDetail({
        tag: data.tag,
        clipStartTime: data.clipStartTime,
        clipEndTime: data.clipEndTime,
        clipMovedTime: this.data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ clipStartTime: data.clipStartTime, clipEndTime: data.clipEndTime });
      this.triggerEvent('onBeforeChange', detail);
    },
    onHandlerMove(data: DetailHandler) {
      const detail = this.formatDetail({
        tag: data.tag,
        clipStartTime: data.clipStartTime,
        clipEndTime: data.clipEndTime,
        clipMovedTime: this.data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ clipStartTime: data.clipStartTime, clipEndTime: data.clipEndTime });
      this.triggerEvent('onChange', detail);
    },
    onHandlerEnd(data: DetailHandler) {
      const detail = this.formatDetail({
        tag: data.tag,
        clipStartTime: data.clipStartTime,
        clipEndTime: data.clipEndTime,
        clipMovedTime: this.data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ clipStartTime: data.clipStartTime, clipEndTime: data.clipEndTime });
      this.triggerEvent('onAfterChange', detail);
    },

    onBgStart(data: DetailBg) {
      const detail = this.formatDetail({
        tag: 'bg',
        clipStartTime: this.data.clipStartTime,
        clipEndTime: this.data.clipEndTime,
        clipMovedTime: data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ clipMovedTime: data.clipMovedTime });
      this.triggerEvent('onBeforeChange', detail);
    },
    onBgMove(data: DetailBg) {
      Object.keys(this.data.fetchingTimes).forEach(time => {
        if (
          data.clipMovedTime + this.data.clipMaxTime > time &&
          this.data.fetchingTimes[time] === 'pending'
        ) {
          this.fetchVideoThumbnails(+time);
        }
      });
      const detail = this.formatDetail({
        tag: 'bg',
        clipStartTime: this.data.clipStartTime,
        clipEndTime: this.data.clipEndTime,
        clipMovedTime: data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ clipMovedTime: data.clipMovedTime });
      this.triggerEvent('onChange', detail);
    },
    onBgEnd(data: DetailBg) {
      const detail = this.formatDetail({
        tag: 'bg',
        clipStartTime: this.data.clipStartTime,
        clipEndTime: this.data.clipEndTime,
        clipMovedTime: data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ clipMovedTime: data.clipMovedTime });
      this.triggerEvent('onAfterChange', detail);
    },

    onIndicatorStart(data: DetailIndicator) {
      const detail = this.formatDetail({
        tag: 'indicator',
        clipStartTime: this.data.clipStartTime,
        clipEndTime: this.data.clipEndTime,
        clipMovedTime: this.data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ progress: data.progress });
      this.triggerEvent('onBeforeChange', detail);
    },
    onIndicatorMove(data: DetailIndicator) {
      const detail = this.formatDetail({
        tag: 'indicator',
        clipStartTime: this.data.clipStartTime,
        clipEndTime: this.data.clipEndTime,
        clipMovedTime: this.data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ progress: data.progress });
      this.triggerEvent('onChange', detail);
    },
    onIndicatorEnd(data: DetailIndicator) {
      const detail = this.formatDetail({
        tag: 'indicator',
        clipStartTime: this.data.clipStartTime,
        clipEndTime: this.data.clipEndTime,
        clipMovedTime: this.data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ progress: data.progress });
      this.triggerEvent('onAfterChange', detail);
    },

    onPlayLoop(data: DetailIndicator) {
      const detail = this.formatDetail({
        tag: 'loop',
        clipStartTime: this.data.clipStartTime,
        clipEndTime: this.data.clipEndTime,
        clipMovedTime: this.data.clipMovedTime,
        progress: data.progress,
      });
      this.setData({ progress: data.progress });
      this.triggerEvent('onAfterChange', detail);
    },
  },
});
