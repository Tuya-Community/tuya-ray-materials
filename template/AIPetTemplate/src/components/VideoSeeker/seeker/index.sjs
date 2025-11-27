const utils = require('./utils.sjs');

let isTouching = false;

/**
 * 基于触摸事件计算偏移量 translateX 值
 */
const calcXFromTouch = (evt, ownerInstance) => {
  const seekerInst = ownerInstance.selectComponent('#video-seeker');
  const { offsetLeft, offsetRight } = seekerInst.getDataset();
  const pageX = evt.changedTouches[0].pageX;
  const x = utils.inMaxMin(offsetLeft, offsetRight, pageX) - offsetLeft;
  return x;
};

/**
 * 基于触摸事件计算时长进度及百分比
 */
const calcProgressFromTouch = (evt, ownerInstance) => {
  const seekerInst = ownerInstance.selectComponent('#video-seeker');
  const { duration, offsetLeft, offsetRight } = seekerInst.getDataset();
  const x = calcXFromTouch(evt, ownerInstance);
  const progress = utils.calcPosition(x, 0, offsetRight - offsetLeft, 0, duration);
  const percent = utils.calcPosition(x, 0, offsetRight - offsetLeft, 0, 100);
  return [progress, percent];
};

const setSeekerTranslateXFromTouch = (evt, ownerInstance) => {
  const indicatorInst = ownerInstance.selectComponent('.video-seeker__indicator');
  const targetX = calcXFromTouch(evt, ownerInstance);
  indicatorInst.setStyle({
    transform: `translateX(${targetX}px)`,
  });
  return targetX;
};

const onTouchStart = (evt, ownerInstance) => {
  const x = setSeekerTranslateXFromTouch(evt, ownerInstance);
  const [progress, percent] = calcProgressFromTouch(evt, ownerInstance);
  const detail = { x, progress, percent };
  ownerInstance.triggerEvent('onBeforeChange', detail);
};

const onTouchMove = (evt, ownerInstance) => {
  const x = setSeekerTranslateXFromTouch(evt, ownerInstance);
  const [progress, percent] = calcProgressFromTouch(evt, ownerInstance);
  const detail = { x, progress, percent };
  ownerInstance.triggerEvent('onChange', detail);
};

const onTouchEnd = (evt, ownerInstance) => {
  const x = setSeekerTranslateXFromTouch(evt, ownerInstance);
  const [progress, percent] = calcProgressFromTouch(evt, ownerInstance);
  const detail = { x, progress, percent };
  ownerInstance.triggerEvent('onAfterChange', detail);
};

let eventChannel;

const onReady = (newValue, oldValue, ownerInstance) => {
  if (!eventChannel) {
    eventChannel = ownerInstance.eventChannel;
    eventChannel.on('videoTimeUpdate', data => {
      const seekerInst = ownerInstance.selectComponent('#video-seeker');
      const { seekerWidth, duration } = seekerInst.getDataset();
      const { currentTime } = data;
      const targetX = utils.calcPosition(currentTime, 0, duration, 0, seekerWidth);
      const indicatorInst = ownerInstance.selectComponent('.video-seeker__indicator');
      indicatorInst.setStyle({ transform: `translateX(${targetX}px)` });
    });
  }
};

module.exports = {
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onReady,
};
