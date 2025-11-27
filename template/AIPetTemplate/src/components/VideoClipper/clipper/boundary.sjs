// 边界计算逻辑

const shared = require('./shared-data.sjs');

/**
 * 获取左侧裁剪器的左右滑动 translateX 边界值
 */
const getLeftHandlerBoundary = ownerInstance => {
  const clipperInst = ownerInstance.selectComponent('#video-clipper');
  const { clipWidth, clipTrackWidth } = clipperInst.getDataset();
  const handleWidth = (clipWidth - clipTrackWidth) / 2;
  return [0, clipWidth - handleWidth];
};

/**
 * 获取右侧裁剪器的左右滑动 translateX 边界值
 */
const getRightHandlerBoundary = ownerInstance => {
  const clipperInst = ownerInstance.selectComponent('#video-clipper');
  const { clipWidth, clipTrackWidth } = clipperInst.getDataset();
  const handleWidth = (clipWidth - clipTrackWidth) / 2;
  return [-(clipWidth - handleWidth), 0];
};

/**
 * 获取定位器的左右滑动 translateX 边界值
 */
const getIndicatorBoundary = ownerInstance => {
  const clipperInst = ownerInstance.selectComponent('#video-clipper');
  const { indicatorWidth, clipWidth, clipTrackWidth } = clipperInst.getDataset();
  const handleWidth = (clipWidth - clipTrackWidth) / 2;
  const [left, right] = getLeftHandlerBoundary(ownerInstance);
  const leftHandlerX = shared.getInstValue(ownerInstance, 'leftHandlerX') || left;
  const rightHandlerX = shared.getInstValue(ownerInstance, 'rightHandlerX') || 0;
  return [leftHandlerX - left + handleWidth, rightHandlerX + right - indicatorWidth];
};

/**
 * 获取裁剪器的左右滑动 translateX 边界值
 */
const getClipperBoundary = ownerInstance => {
  const clipperInst = ownerInstance.selectComponent('#video-clipper');
  const { offsetLeft, offsetRight, clipHandlerWidth } = clipperInst.getDataset();
  const clipperBoundary = [offsetLeft, offsetRight - clipHandlerWidth];
  return clipperBoundary;
};

/**
 * 获取背景缩略图的左右滑动 translateX 边界值
 */
const getThumbBgBoundary = (ownerInstance, isMove = false) => {
  const clipperInst = ownerInstance.selectComponent('#video-clipper');
  const bgInst = ownerInstance.selectComponent('.video-clipper__bg');
  const { totalThumbnailsWidth } = bgInst.getDataset();
  const { clipTrackWidth, clipHandlerWidth } = clipperInst.getDataset();
  return [-(totalThumbnailsWidth - clipTrackWidth), 0];
};

module.exports = {
  getLeftHandlerBoundary,
  getRightHandlerBoundary,
  getIndicatorBoundary,
  getClipperBoundary,
  getThumbBgBoundary,
};
