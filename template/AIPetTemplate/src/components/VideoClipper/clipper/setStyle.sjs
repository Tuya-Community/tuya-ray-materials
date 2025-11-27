// DOM 样式操作

const calc = require('./calc.sjs');
const boundary = require('./boundary.sjs');
const shared = require('./shared-data.sjs');

/**
 * 重置定位器的 translateX 值，和 LeftHandler 对齐
 */
const setIndicatorXWithLeftHandler = ownerInstance => {
  const leftHandlerX = shared.getInstValue(ownerInstance, 'leftHandlerX');
  // const [left] = boundary.getIndicatorBoundary(ownerInstance);
  const indicatorInst = ownerInstance.selectComponent('.video-clipper__indicator');
  indicatorInst.setStyle({ transform: `translateX(${leftHandlerX + 16}px)` });
  shared.setInstValue(ownerInstance, 'indicatorStartX', 0);
};

// const leftHandlerBoundary = boundary.getLeftHandlerBoundary(ownerInstance);

// TODO: remove it
let handlerStartX = 0;
let handlerEndX = 311;

const setLeftHandlerTranslateXFromTouch = (evt, ownerInstance) => {
  const {
    clipMinTime,
    clipMaxTime,
    clipStartTime,
    clipEndTime,
    clipTimes,
    clipWidth,
    clipTrackWidth,
  } = shared.getVideoClipperDataset(ownerInstance);
  const [, boundaryRight] = boundary.getClipperBoundary(ownerInstance);
  const handlerTag = evt.currentTarget.dataset.tag;
  const handlerInst = ownerInstance.selectComponent(`.video-clipper__handler-${handlerTag}`);
  const textInst = ownerInstance.selectComponent(
    `.video-clipper__time-${handlerTag === 'right' ? 'end' : 'start'}`
  );
  const targetX = calc.calcHandlerXByTouch(evt, ownerInstance);
  const movedTime = calc.calcMovedTimeByX(targetX, 'leftHandler', ownerInstance);
  const handleWidth = (clipWidth - clipTrackWidth) / 2;

  const maxMovedTime = clipEndTime - clipMinTime;

  if (movedTime >= maxMovedTime) {
    const detail = {
      progress: maxMovedTime,
      clipStartTime: maxMovedTime,
      clipEndTime,
    };
    return detail;
  }
  handlerStartX = targetX;
  handlerInst.setStyle({ transform: `translateX(${targetX}px)` });
  textInst.setStyle({ transform: `translateX(${targetX}px)` });
  shared.setInstValue(ownerInstance, 'leftHandlerX', targetX);
  const indicatorInst = ownerInstance.selectComponent('.video-clipper__indicator');
  indicatorInst.setStyle({ transform: `translateX(${targetX + handleWidth}px)` });
  shared.setInstValue(ownerInstance, 'indicatorStartX', 0);
  const overlayInst = ownerInstance.selectComponent('.video-clipper__overlay-left');
  const targetWidth = calc.calcOverlayWidthFromTouch(evt, ownerInstance);
  overlayInst.setStyle({ width: `${targetWidth}px` });
  const detail = {
    progress: movedTime,
    clipStartTime: movedTime,
    clipEndTime: clipEndTime,
  };
  return detail;
};

const setRightHandlerTranslateXFromTouch = (evt, ownerInstance) => {
  const {
    clipMinTime,
    clipMaxTime,
    clipStartTime,
    clipEndTime,
    clipTimes,
    clipWidth,
    clipTrackWidth,
  } = shared.getVideoClipperDataset(ownerInstance);
  const [, boundaryRight] = boundary.getClipperBoundary(ownerInstance);
  const handlerTag = evt.currentTarget.dataset.tag;
  const handlerInst = ownerInstance.selectComponent('.video-clipper__handler-right');
  const textInst = ownerInstance.selectComponent('.video-clipper__time-end');
  const targetX = calc.calcHandlerXByTouch(evt, ownerInstance);
  const movedTime = calc.calcMovedTimeByX(targetX, 'rightHandler', ownerInstance);
  const handleWidth = (clipWidth - clipTrackWidth) / 2;

  const minMovedTime = clipStartTime + clipMinTime;

  if (movedTime <= minMovedTime) {
    const detail = {
      progress: clipStartTime,
      clipStartTime,
      clipEndTime: minMovedTime,
    };
    return detail;
  }
  handlerEndX = targetX;
  shared.setInstValue(ownerInstance, 'rightHandlerX', targetX);
  const indicatorInst = ownerInstance.selectComponent('.video-clipper__indicator');
  const leftHandlerX = shared.getInstValue(ownerInstance, 'leftHandlerX');
  indicatorInst.setStyle({ transform: `translateX(${leftHandlerX + handleWidth}px)` });
  shared.setInstValue(ownerInstance, 'indicatorStartX', 0);
  handlerInst.setStyle({ transform: `translateX(${targetX}px)` });
  textInst.setStyle({ transform: `translateX(${targetX}px)` });

  const overlayInst = ownerInstance.selectComponent('.video-clipper__overlay-right');
  const targetWidth = calc.calcOverlayWidthFromTouch(evt, ownerInstance);
  overlayInst.setStyle({ width: `${targetWidth}px` });
  const detail = {
    progress: clipStartTime,
    clipStartTime,
    clipEndTime: movedTime,
  };
  return detail;
};

const setIndicatorShow = ownerInstance => {
  const indicatorInst = ownerInstance.selectComponent('.video-clipper__indicator');
  indicatorInst.setStyle({
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: '0px 0px 5px #888',
  });
};

const setIndicatorHide = ownerInstance => {
  const indicatorInst = ownerInstance.selectComponent('.video-clipper__indicator');
  indicatorInst.setStyle({ backgroundColor: 'rgba(255, 255, 255, 0)', boxShadow: 'none' });
};

module.exports = {
  setIndicatorXWithLeftHandler,
  setLeftHandlerTranslateXFromTouch,
  setRightHandlerTranslateXFromTouch,
  setIndicatorShow,
  setIndicatorHide,
};
