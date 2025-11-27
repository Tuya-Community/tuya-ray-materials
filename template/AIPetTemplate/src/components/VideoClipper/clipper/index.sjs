const calc = require('./calc.sjs');
const utils = require('./utils.sjs');
const event = require('./event.sjs');
const boundary = require('./boundary.sjs');
const setStyle = require('./setStyle.sjs');
const shared = require('./shared-data.sjs');

const HandlerTouchEvent = event.TouchEvent();

const onHandlerTouchStart = HandlerTouchEvent.start((evt, ownerInstance) => {
  /**
   * 因为裁剪左右两边的时长是向下取整的，即在视频时长为 3.3s 时，开始和结束时间为 0-3s
   * 所以假设在视频时长为 3.3s 时，视频最短裁减时长为 3s 时，不允许拖动裁剪条
   */
  const { clipMinTime, duration } = shared.getVideoClipperDataset(ownerInstance);
  if (Math.floor(duration) <= clipMinTime) return;
  const handlerTag = evt.currentTarget.dataset.tag;
  let detail = { tag: handlerTag };
  setStyle.setIndicatorHide(ownerInstance);
  if (handlerTag === 'left') {
    detail = {
      ...detail,
      ...setStyle.setLeftHandlerTranslateXFromTouch(evt, ownerInstance),
    };
  }
  if (handlerTag === 'right') {
    detail = {
      ...detail,
      ...setStyle.setRightHandlerTranslateXFromTouch(evt, ownerInstance),
    };
  }
  ownerInstance.callMethod('onHandlerStart', detail);
});

const onHandlerTouchMove = HandlerTouchEvent.move((evt, ownerInstance) => {
  const { clipMinTime, duration } = shared.getVideoClipperDataset(ownerInstance);
  if (Math.floor(duration) <= clipMinTime) return;
  const handlerTag = evt.currentTarget.dataset.tag;
  let detail = { tag: handlerTag };
  if (handlerTag === 'left') {
    detail = {
      ...detail,
      ...setStyle.setLeftHandlerTranslateXFromTouch(evt, ownerInstance),
    };
  }
  if (handlerTag === 'right') {
    detail = {
      ...detail,
      ...setStyle.setRightHandlerTranslateXFromTouch(evt, ownerInstance),
    };
  }
  ownerInstance.callMethod('onHandlerMove', detail);
});

const onHandlerTouchEnd = HandlerTouchEvent.end((evt, ownerInstance) => {
  const { clipMinTime, duration } = shared.getVideoClipperDataset(ownerInstance);
  if (Math.floor(duration) <= clipMinTime) return;
  const handlerTag = evt.currentTarget.dataset.tag;
  setStyle.setIndicatorShow(ownerInstance);
  let detail = { tag: handlerTag };
  if (handlerTag === 'left') {
    detail = {
      ...detail,
      ...setStyle.setLeftHandlerTranslateXFromTouch(evt, ownerInstance),
    };
  }
  if (handlerTag === 'right') {
    detail = {
      ...detail,
      ...setStyle.setRightHandlerTranslateXFromTouch(evt, ownerInstance),
    };
  }
  ownerInstance.callMethod('onHandlerEnd', detail);
});

const BgTouchEvent = event.TouchEvent();

const onBgTouchStart = BgTouchEvent.start((evt, ownerInstance) => {
  const pageX = evt.changedTouches[0].pageX;
  const bgInst = ownerInstance.selectComponent('.video-clipper__bg');
  bgInst.setStyle({ transition: 'none' });
  setStyle.setIndicatorHide(ownerInstance);
  setStyle.setIndicatorXWithLeftHandler(ownerInstance);
  const { clipMovedTime, clipStartTime } = shared.getVideoClipperDataset(ownerInstance);
  const detail = { clipMovedTime, progress: clipMovedTime + clipStartTime };
  ownerInstance.callMethod('onBgStart', detail);
});

let bgStartX = 0; // 背景缩略图触摸起始位置，用于计算累计横向偏移量（deltaX）

const onBgTouchMove = BgTouchEvent.move((evt, ownerInstance) => {
  const pageX = evt.changedTouches[0].pageX;
  const deltaX = evt.changedTouches[0].deltaX + bgStartX;
  const [minX, maxX] = boundary.getThumbBgBoundary(ownerInstance);
  const { clipStartTime } = shared.getVideoClipperDataset(ownerInstance);
  let targetX = utils.inMaxMin(minX, maxX, deltaX);

  // 由于移动时长必须在 min max 之内，所以 targetX 请勿移动到后面
  const clipMovedTime = calc.calcMovedTimeByX(targetX, 'bg', ownerInstance);

  if (targetX <= minX) {
    // console.log('=== outof right bound');
    targetX = minX - (minX - deltaX) * 0.1;
  }
  if (targetX >= maxX) {
    // console.log('=== outof left bound');
    targetX = maxX + (deltaX - maxX) * 0.1;
  }

  const bgInst = ownerInstance.selectComponent('.video-clipper__bg');
  bgInst.setStyle({ transform: `translateX(${targetX}px)` });
  setStyle.setIndicatorXWithLeftHandler(ownerInstance);
  const detail = { clipMovedTime, progress: clipMovedTime + clipStartTime };
  ownerInstance.callMethod('onBgMove', detail);
});

const onBgTouchEnd = BgTouchEvent.end((evt, ownerInstance) => {
  const pageX = evt.changedTouches[0].pageX;
  const deltaX = evt.changedTouches[0].deltaX + bgStartX;
  const [minX, maxX] = boundary.getThumbBgBoundary(ownerInstance);
  const { clipStartTime } = shared.getVideoClipperDataset(ownerInstance);
  const targetX = utils.inMaxMin(minX, maxX, deltaX);
  bgStartX = targetX;
  const bgInst = ownerInstance.selectComponent('.video-clipper__bg');
  bgInst.setStyle({
    transition: 'transform 0.2s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // AI 给的模拟 spring 效果，还不错
    transform: `translateX(${targetX}px)`,
  });
  setStyle.setIndicatorShow(ownerInstance);
  setStyle.setIndicatorXWithLeftHandler(ownerInstance);
  const clipMovedTime = calc.calcMovedTimeByX(targetX, 'bg', ownerInstance);
  const detail = { clipMovedTime, progress: clipMovedTime + clipStartTime };
  ownerInstance.callMethod('onBgEnd', detail);
});

let isIndicatorTouching = false;

const IndicatorTouchEvent = event.TouchEvent();

const onIndicatorTouchStart = IndicatorTouchEvent.start((evt, ownerInstance) => {
  isIndicatorTouching = true;
  const indicatorStartX = shared.getInstValue(ownerInstance, 'indicatorStartX') || 0;
  const deltaX = evt.changedTouches[0].deltaX + indicatorStartX;
  const [left, right] = boundary.getIndicatorBoundary(ownerInstance);
  const targetX = utils.inMaxMin(left, right, deltaX + left);
  const { clipStartTime, clipEndTime, clipMovedTime } =
    shared.getVideoClipperDataset(ownerInstance);
  const movedTime = utils.calcPosition(targetX, left, right, clipStartTime, clipEndTime);
  const progress = clipMovedTime + movedTime;
  const detail = { progress };
  ownerInstance.callMethod('onIndicatorStart', detail);
});

const onIndicatorTouchMove = IndicatorTouchEvent.move((evt, ownerInstance) => {
  const indicatorStartX = shared.getInstValue(ownerInstance, 'indicatorStartX') || 0;
  const deltaX = evt.changedTouches[0].deltaX + indicatorStartX;
  const [left, right] = boundary.getIndicatorBoundary(ownerInstance);
  const targetX = utils.inMaxMin(left, right, deltaX + left);
  const { clipStartTime, clipEndTime, clipMovedTime } =
    shared.getVideoClipperDataset(ownerInstance);
  const movedTime = utils.calcPosition(targetX, left, right, clipStartTime, clipEndTime);
  const indicatorInst = ownerInstance.selectComponent('.video-clipper__indicator');
  const progress = clipMovedTime + movedTime;
  indicatorInst.setStyle({ transform: `translateX(${targetX}px)` });
  const detail = { progress };
  ownerInstance.callMethod('onIndicatorMove', detail);
});

const onIndicatorTouchEnd = IndicatorTouchEvent.end((evt, ownerInstance) => {
  isIndicatorTouching = false;
  const indicatorStartX = shared.getInstValue(ownerInstance, 'indicatorStartX') || 0;
  const deltaX = evt.changedTouches[0].deltaX + indicatorStartX;
  const [left, right] = boundary.getIndicatorBoundary(ownerInstance);
  const targetX = utils.inMaxMin(left, right, deltaX + left);
  const { clipStartTime, clipEndTime, clipMovedTime } =
    shared.getVideoClipperDataset(ownerInstance);
  const movedTime = utils.calcPosition(targetX, left, right, clipStartTime, clipEndTime);
  const indicatorInst = ownerInstance.selectComponent('.video-clipper__indicator');
  const progress = clipMovedTime + movedTime;
  indicatorInst.setStyle({ transform: `translateX(${targetX}px)` });
  shared.setInstValue(ownerInstance, 'indicatorStartX', targetX - left);
  const detail = { progress };
  ownerInstance.callMethod('onIndicatorEnd', detail);
});

let eventChannel;

const onReady = (newValue, oldValue, ownerInstance) => {
  if (!eventChannel) {
    eventChannel = ownerInstance.eventChannel;
    eventChannel.on('videoTimeUpdate', data => {
      const { currentTime } = data;
      const { clipStartTime, clipEndTime, clipMovedTime } =
        shared.getVideoClipperDataset(ownerInstance);
      const [left, right] = boundary.getIndicatorBoundary(ownerInstance);
      const targetX = utils.calcPosition(
        currentTime - clipMovedTime,
        clipStartTime,
        clipEndTime,
        left,
        right
      );
      const indicatorInst = ownerInstance.selectComponent('.video-clipper__indicator');
      indicatorInst.setStyle({ transform: `translateX(${targetX}px)` });
    });
  }
};

const noop = () => {};

module.exports = {
  onHandlerTouchStart,
  onHandlerTouchMove,
  onHandlerTouchEnd,
  onBgTouchStart,
  onBgTouchMove,
  onBgTouchEnd,
  onIndicatorTouchStart,
  onIndicatorTouchMove,
  onIndicatorTouchEnd,
  onReady,
  noop,
};
