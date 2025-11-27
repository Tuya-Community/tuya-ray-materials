import { clearVideoThumbnailsAsync, fetchVideoThumbnailsAsync } from '@/api/nativeApi';
import { normalizeFilePath } from '@/utils';
import Render from './index.rjs';

let render;

Component({
  properties: {
    // Video 实例 id，用于监听视频的播放进度
    videoId: {
      type: String,
      value: '',
    },
    // 根节点自定义样式
    style: {
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
          this.initSeeker();
        }
      },
    },
    // 视频缩略图数量
    thumbnailCount: {
      type: Number,
      value: 7,
    },
    // 视频缩略图宽度，单位 rpx
    thumbnailWidth: {
      type: Number,
      value: 112,
    },
    // 视频缩略图高度，单位 rpx
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
    // 视频播放进度条宽度
    seekerWidth: 343,
    // 视频播放进度条指示器宽度
    indicatorWidth: 4,
    // 视频缩略图列表
    thumbImages: [],
    // 视频开始播放时间
    startTime: '00:00',
    // 视频结束播放时间
    endTime: '01:00',
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

    initSeeker() {
      render = new Render(this);
      render.init(this.data.videoId);
      const realPath = normalizeFilePath(this.data.src);
      Promise.all([
        this.getRectAsync('#video-seeker'),
        this.getRectAsync('.video-seeker__indicator'),
        fetchVideoThumbnailsAsync({
          filePath: realPath,
          startTime: 0,
          endTime: Math.floor(this.data.duration * 1000),
          thumbnailCount: this.data.thumbnailCount,
          thumbnailWidth: this.data.thumbnailWidth * 3,
          thumbnailHeight: this.data.thumbnailHeight * 3,
        }),
      ])
        .then(([seekerRect, indicatorRect, thumbnailsRes]) => {
          this.setData({
            isReady: true,
            seekerWidth: seekerRect.width,
            indicatorWidth: indicatorRect.width,
            offsetLeft: seekerRect.left,
            offsetRight: seekerRect.right,
            thumbImages: thumbnailsRes?.thumbnailsPath ?? [],
          });
        })
        .catch(err => {
          console.log('=== initSeeker err', err);
        });
    },
  },
});
