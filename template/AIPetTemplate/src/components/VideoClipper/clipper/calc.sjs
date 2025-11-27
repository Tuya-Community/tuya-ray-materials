// 计算逻辑均位于此

const utils = require('./utils.sjs');
const boundary = require('./boundary.sjs');
const shared = require('./shared-data.sjs');

/**
 * 基于触摸事件计算左右裁减器偏移量 translateX 值
 */
const calcHandlerXByTouch = (evt, ownerInstance) => {
  const handlerTag = evt.currentTarget.dataset.tag;
  const seekerInst = ownerInstance.selectComponent('#video-clipper');
  const { offsetLeft, offsetRight } = seekerInst.getDataset();
  const pageX = evt.changedTouches[0].pageX - offsetLeft;
  const [boundaryLeft, boundaryRight] = boundary.getLeftHandlerBoundary(ownerInstance);
  const x = utils.inMaxMin(boundaryLeft, boundaryRight, pageX);
  return handlerTag === 'right' ? -(boundaryRight - x) : x;
};

/**
 * 基于触摸事件计算左右遮罩的宽度
 */
const calcOverlayWidthFromTouch = (evt, ownerInstance) => {
  const handlerTag = evt.currentTarget.dataset.tag;
  const seekerInst = ownerInstance.selectComponent('#video-clipper');
  const { offsetLeft, offsetRight } = seekerInst.getDataset();
  const pageX = evt.changedTouches[0].pageX;
  const [boundaryLeft, boundaryRight] = boundary.getClipperBoundary(ownerInstance);
  // const x = utils.calcPosition(pageX, 0, offsetRight, boundaryLeft, boundaryRight);
  const width = utils.inMaxMin(boundaryLeft, boundaryRight, pageX);
  return handlerTag === 'right' ? boundaryRight - width : width - offsetLeft;
};

/**
 * 基于偏移的 translateX 值计算对应偏移时长进度
 *
 * clipTrackWidth: 一屏裁剪器轨道宽度，默认 311 px
 * clipMaxTime: 一屏裁剪器最大时长，默认 15 秒
 *
 * 即假设 moveX 滑动了 311px，则代表滑动了 15 秒
 */
const calcMovedTimeByX = (x, target, ownerInstance) => {
  const { clipTrackWidth, clipMaxTime } = shared.getVideoClipperDataset(ownerInstance);
  let moveX = x;
  if (target === 'bg') {
    /**
     * x > 0，表示向右移动，x 为正值
     * x < 0，表示向左移动，x 为负值
     */
    moveX = Math.abs(x);
  }
  if (target === 'leftHandler') {
    const [boundaryLeft, boundaryRight] = boundary.getLeftHandlerBoundary(ownerInstance);
    moveX = utils.calcPosition(x, boundaryLeft, boundaryRight, 0, clipTrackWidth);
  }
  if (target === 'rightHandler') {
    const [boundaryLeft, boundaryRight] = boundary.getRightHandlerBoundary(ownerInstance);
    moveX = utils.calcPosition(x, boundaryLeft, boundaryRight, 0, clipTrackWidth);
  }
  const movedTime = (moveX / clipTrackWidth) * clipMaxTime;
  return movedTime;
};

module.exports = {
  calcHandlerXByTouch,
  calcOverlayWidthFromTouch,
  calcMovedTimeByX,
};
