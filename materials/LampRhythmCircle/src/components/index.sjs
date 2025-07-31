/*
 * @Author: mjh
 * @Date: 2025-06-25 15:45:38
 * @LastEditors: mjh
 * @LastEditTime: 2025-07-01 14:11:36
 * @Description:
 */
const utils = require('./utils.sjs');

const listIdMap = {};

const activeLimit = {
  pre: 0,
  cur: 0,
  next: 0,
};

const activeCenterPos = { x: 0, y: 0 };

const changeList = (instanceId) => (list, old, ownerInstance) => {
  if (!listIdMap[instanceId]) {
    listIdMap[instanceId] = []
  }
  if (JSON.stringify(list || {}) === JSON.stringify(listIdMap[instanceId] || {})) return
  listIdMap[instanceId] = list || [];
  list.forEach((item, index) => {
    const angle = item.time * 0.25;
    utils.setStyle(
      ownerInstance,
      {
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      },
      `.ray-rhythm-row-${index}`
    );
    utils.setStyle(
      ownerInstance,
      {
        transform: `rotate(${-angle}deg)`,
      },
      `.ray-rhythm-circle-${index}`
    );
  })
};

const getCenter = ownerInstance => {
  const dom = utils.queryComponent(ownerInstance, `.ray-rhythm-container`);
  const domRect = dom.getBoundingClientRect();
  const centerX = (domRect.right - domRect.left) / 2 + domRect.left;
  const centerY = (domRect.bottom - domRect.top) / 2 + domRect.top;
  activeCenterPos.x = centerX;
  activeCenterPos.y = centerY;
};

const detailOffset = (currTimeAngle, prevAngle, nextAngle, angle, activeAngle, OFFSET_ANGLE) => {
  if (
    (currTimeAngle > prevAngle && currTimeAngle > nextAngle) ||
    (currTimeAngle < prevAngle && currTimeAngle < nextAngle)
  ) {
    const preMin = prevAngle + OFFSET_ANGLE;
    const nextMax = nextAngle - OFFSET_ANGLE;
    if (angle >= preMin || angle <= nextMax) {
      return angle;
    } else if (angle < preMin && angle > nextMax) {
      return activeAngle;
    } else if (angle <= preMin && angle >= prevAngle) {
      return preMin / 0.25;
    } else if (angle >= nextMax && angle <= nextAngle) {
      return nextMax / 0.25;
    } else {
      return angle;
    }
  } else if (currTimeAngle > prevAngle && currTimeAngle < nextAngle) {
    const preMin = prevAngle + OFFSET_ANGLE;
    const nextMax = nextAngle - OFFSET_ANGLE;
    if (angle >= preMin && angle <= nextMax) {
      return angle;
    } else if (angle < preMin || angle > nextMax) {
      return activeAngle;
    } else if (angle <= preMin && angle >= prevAngle) {
      return preMin / 0.25;
    } else if (angle >= nextMax && angle <= nextAngle) {
      return nextMax / 0.25;
    } else {
      return angle;
    }
  }
}

const touchStart = (instanceId) => (e, ownerInstance) => {
  getCenter(ownerInstance);
  const { index, disable } = utils.getState(e);
  if(disable) return
  const list = listIdMap[instanceId];
  const currItem = list[index];
  const sortList = [...list].sort((pre, cur) => pre.time - cur.time);
  const newIndex = sortList.findIndex(item => item === currItem);
  const pre = sortList[newIndex - 1 < 0 ? sortList.length - 1 : newIndex - 1];
  const next = sortList[newIndex + 1 >= sortList.length ? 0 : newIndex + 1];
  activeLimit.pre = pre.time * 0.25;
  activeLimit.cur = currItem.time * 0.25;
  activeLimit.next = next.time * 0.25;
  ownerInstance.callMethod('handleVibrateShort', 'heavy');
  ownerInstance.callMethod('getAnnulusImageData', {
    touchType: 'start',
    data: list,
    activeIndex: index,
  });
  utils.setStyle(
    ownerInstance,
    {
      filter: 'brightness(100%) grayscale(0%)',
    },
    `.ray-rhythm-circle-icon-${index}`
  );
};

const touchMove = (instanceId) => (e, ownerInstance) => {
  const { pageY, pageX } = e.touches[0];
  const angle = utils.calculateAngleFromBottom(activeCenterPos.x, activeCenterPos.y, pageX, pageY);
  const { index, min, disable } = utils.getState(e);
  if(disable) return
  const list = listIdMap[instanceId];
  const currItem = list[index];
  const prevAngle = activeLimit.pre;
  const nextAngle = activeLimit.next;
  const currTimeAngle = currItem.time * 0.25;
  const OFFSET_ANGLE = min * 0.25;
  activeLimit.cur = detailOffset(currTimeAngle, prevAngle, nextAngle, angle, activeLimit.cur, OFFSET_ANGLE)
  const time = activeLimit.cur / 0.25;
  const returnList = list.map((item, curIndex) => {
    if (curIndex === index) {
      return { ...item, time };
    }
    return { ...item };
  });
  ownerInstance.callMethod('getAnnulusImageData', {
    touchType: 'move',
    data: returnList,
    activeIndex: index,
  });
  utils.setStyle(
    ownerInstance,
    {
      transform: `translate(-50%, -50%) rotate(${activeLimit.cur}deg)`,
    },
    `.ray-rhythm-row-${index}`
  );
  utils.setStyle(
    ownerInstance,
    {
      transform: `rotate(${-activeLimit.cur}deg)`,
    },
    `.ray-rhythm-circle-${index}`
  );
};

const touchEnd = (instanceId) => (e, ownerInstance) => {
  const { index, disable, dark } = utils.getState(e);
  if(disable) return
  const list = listIdMap[instanceId];
  const time = Math.round(activeLimit.cur / 0.25);
  const returnList = list.map((item, curIndex) => {
    if (curIndex === index) {
      return { ...item, time };
    }
    return { ...item };
  });
  utils.setStyle(
    ownerInstance,
    {
      filter: dark ? 'brightness(200%) grayscale(100%)' : 'brightness(0%)',
    },
    `.ray-rhythm-circle-icon-${index}`
  );
  ownerInstance.callMethod('getAnnulusImageData', {
    touchType: 'end',
    data: returnList,
    activeIndex: index,
  });
};

const click = (instanceId) => (e, ownerInstance) => {
  const { disable } = utils.getState(e);
  if (disable) return
  getCenter(ownerInstance);
  const { pageY, pageX } = e.touches[0];
  const angle = utils.calculateAngleFromBottom(activeCenterPos.x, activeCenterPos.y, pageX, pageY);
  const list = listIdMap[instanceId];
  const angleOffsetList = list.map(item => {
    const currAngle = item.time * 0.25
    return Math.min(Math.abs(currAngle - angle), angle + 360 - currAngle, currAngle + 360 - angle)
  });
  const minOffset = Math.min(...angleOffsetList)
  const activeIndex = angleOffsetList.findIndex(item => item === minOffset)
  console.log(angleOffsetList, angle, activeIndex, '--angleOffsetList');
  if (!list[activeIndex].valid) return;
  const returnList = list.map((item, curIndex) => {
    if (curIndex === activeIndex) {
      return { ...item, time:  Math.round(angle / 0.25) };
    }
    return { ...item };
  });
  ownerInstance.callMethod('getAnnulusImageData', {
    touchType: 'end',
    data: returnList,
    activeIndex: activeIndex,
  });
}

module.exports = {
  touchStart,
  touchMove,
  touchEnd,
  changeList,
  click,
};
