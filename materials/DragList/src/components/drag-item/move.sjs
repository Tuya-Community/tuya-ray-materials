// 用来排序的数组
let listRef = {
  value: [],
};
let startPo = { x: 0, y: 0 }; // 记录当前拖动元素的开始的位置
let canDrag = false; // 是否可以拖动
let timer; // 长按定时器

const setStyle = (ownerInstance, style) => {
  const dom = queryComponent(ownerInstance, `.ray-drag-list-item`);
  dom.setStyle(style);
};

const getProperty = (e, key) => {
  const { getDataset } = e.instance;
  const data = getDataset();
  return data[key];
};

const propObserver = fatherId =>
  function (newValue = []) {
    if (canDrag || !fatherId) return;
    listRef.value[fatherId] = newValue.map((item, index) => ({ ...item, indexNumDrag: index }));
  };

const getListNode = function (id, keyId, fatherId) {
  let _data = listRef.value[fatherId].find(item => item[keyId] === id);
  return _data;
};

const queryComponent = function (ownerInstance, selector) {
  const instance = ownerInstance?.selectComponent(selector);
  return instance;
};

function intersectionRange(range1, range2) {
  // 确定交区间的起始和结束
  const start = Math.max(range1[0], range2[0]); // 起始为两区间中较大者
  const end = Math.min(range1[1], range2[1]); // 结束为两区间中较小者

  // 只有当起始小于结束时表示有交区间
  if (start <= end) {
    return [start, end];
  } else {
    return [0, 0]; // 表示区间不重叠，返回null或处理方式视具体需求而定
  }
}

const touchStart = function (e, ownerInstance) {
  const duration = getProperty(e, 'duration') || 0;
  timer = setTimeout(() => {
    ownerInstance.callMethod('handleTouchStart');
    const { pageY, pageX } = e.touches[0];
    startPo.y = pageY;
    startPo.x = pageX;
    ownerInstance.callMethod('handleVibrateShort', 'heavy');
    timer && clearTimeout(timer);
    canDrag = true;
    setStyle(ownerInstance, {
      transition: 'none',
    });
  }, duration);
};

const touchmove = fatherId =>
  function (e, ownerInstance) {
    if (!canDrag) {
      timer && clearTimeout(timer);
      return;
    }
    const { getDataset } = e.instance;
    const data = getDataset();
    const keyId = data.keyid;
    const multiple = data.multiple;
    const currDom = getListNode(data.id, keyId, fatherId);
    const { pageY, pageX } = e.touches[0];
    let offsetY = pageY - startPo.y;
    let offsetX = pageX - startPo.x;
    // 当前拖动的项
    const currDomBottom = currDom.rect.bottom + offsetY;
    const currDomTop = currDom.rect.top + offsetY;
    const currDomLeft = currDom.rect.left + offsetX;
    const currDomRight = currDom.rect.right + offsetX;
    // 排序在移动节点之前
    let beforeMode = true;
    // 多列情况
    if (multiple) {
      listRef.value[fatherId].forEach((v, index) => {
        const otherRect = v.rect;
        const otherHeight = otherRect.height;
        const midY = intersectionRange(
          [otherRect.top + otherRect.offsetY, otherRect.bottom + otherRect.offsetY],
          [currDomTop, currDomBottom]
        );
        const isCover = Math.abs(midY[0] - midY[1]) / otherHeight > 0.7; // 是否覆盖
        if (
          currDomLeft < otherRect.left + otherRect.offsetX - 5 &&
          isCover &&
          currDom.indexNumDrag > index
        ) {
          currDom.indexNumDrag = index - 0.5;
        }
        if (
          currDomRight > otherRect.right + otherRect.offsetX + 5 &&
          isCover &&
          currDom.indexNumDrag < index
        ) {
          currDom.indexNumDrag = index + 0.5;
        }
      });
      listRef.value[fatherId].forEach((v, index) => {
        if (v[keyId] === currDom[keyId]) {
          v.rect.offsetY = offsetY;
          v.rect.offsetX = offsetX;
          beforeMode = false;
          return;
        }
        const otherRect = v.rect;
        const isMoved = !!otherRect.offsetY || !!otherRect.offsetX;
        // 小于了
        if (
          currDom.indexNumDrag < index &&
          ((!isMoved && beforeMode) || (isMoved && !beforeMode))
        ) {
          const preRect = listRef.value[fatherId][index + 1]?.rect;
          const otherOffsetX = !isMoved ? preRect.left - otherRect.left : 0;
          const otherOffsetY = !isMoved ? preRect.top - otherRect.top : 0;
          otherRect.offsetX = otherOffsetX;
          otherRect.offsetY = otherOffsetY;
          ownerInstance.callMethod('movingChangeSort', {
            [keyId]: v[keyId],
            offsetX: otherOffsetX,
            offsetY: otherOffsetY,
            style: {
              transform: `translateY(${otherOffsetY}px) translateX(${otherOffsetX}px)`,
              transition: 'transform 0.5s',
            },
          });
          ownerInstance.callMethod('handleVibrateShort', 'heavy');
        }

        // 大于了
        if (
          currDom.indexNumDrag > index &&
          ((!isMoved && !beforeMode) || (isMoved && beforeMode))
        ) {
          const preRect = listRef.value[fatherId][index - 1]?.rect;
          const otherOffsetX = !isMoved ? preRect.left - otherRect.left : 0;
          const otherOffsetY = !isMoved ? preRect.top - otherRect.top : 0;
          otherRect.offsetX = otherOffsetX;
          otherRect.offsetY = otherOffsetY;
          ownerInstance.callMethod('movingChangeSort', {
            [keyId]: v[keyId],
            offsetX: otherOffsetX,
            offsetY: otherOffsetY,
            style: {
              transform: `translateY(${otherOffsetY}px) translateX(${otherOffsetX}px)`,
              transition: 'transform 0.5s',
            },
          });
          ownerInstance.callMethod('handleVibrateShort', 'heavy');
        }
      });
    } else {
      listRef.value[fatherId].forEach((v, index) => {
        if (v[keyId] === currDom[keyId]) {
          v.rect.offsetY = offsetY;
          v.rect.offsetX = offsetX;
          beforeMode = false;
          return;
        }
        const otherRect = v.rect;
        const otherHeight = otherRect.height;
        if (
          currDomBottom > otherRect.bottom - otherHeight / 2 - 5 + otherRect.offsetY &&
          ((!beforeMode && !otherRect.offsetY) || (beforeMode && otherRect.offsetY))
        ) {
          const preRect = listRef.value[fatherId][index - 1]?.rect;
          // 下超了
          const otherOffsetY = !otherRect.offsetY ? preRect.top - otherRect.top : 0;
          otherRect.offsetY = otherOffsetY;
          ownerInstance.callMethod('movingChangeSort', {
            [keyId]: v[keyId],
            offsetY: otherOffsetY,
            style: {
              transform: `translateY(${otherOffsetY}px)`,
              transition: 'transform 0.5s',
            },
          });
          ownerInstance.callMethod('handleVibrateShort', 'heavy');
        }
        if (
          currDomTop < otherRect.top + otherHeight / 2 + 5 + otherRect.offsetY &&
          ((beforeMode && !otherRect.offsetY) || (!beforeMode && otherRect.offsetY))
        ) {
          const afterRect = listRef.value[fatherId][index + 1]?.rect;
          // 上超了
          const otherOffsetY = !otherRect.offsetY ? afterRect.top - otherRect.top : 0;
          otherRect.offsetY = otherOffsetY;
          ownerInstance.callMethod('movingChangeSort', {
            [keyId]: v[keyId],
            offsetY: otherOffsetY,
            style: {
              transform: `translateY(${otherOffsetY}px)`,
              transition: 'transform 0.5s',
            },
          });
          ownerInstance.callMethod('handleVibrateShort', 'heavy');
        }
      });
    }
    // 当前拖动数据
    setStyle(ownerInstance, {
      transform: `translateY(${offsetY}px) ${multiple ? `translateX(${offsetX}px)` : ''}`,
      'z-index': '10',
      position: 'relative',
    });
  };

const touchend = fatherId =>
  function (e, ownerInstance) {
    timer && clearTimeout(timer);
    if (!canDrag) {
      ownerInstance.callMethod('moveCanceled');
      return;
    }
    const { getDataset } = e.instance;
    const data = getDataset();
    const keyId = data.keyid;
    const multiple = data.multiple;
    const id = data.id;
    const oldIdMap = listRef.value[fatherId].map(item => item[keyId]);
    ownerInstance.callMethod('handleVibrateShort', 'heavy');
    let currItem = {};
    const newIdMap = [];
    let _list = [];
    if (multiple) {
      _list = [...listRef.value[fatherId]]
        .sort((a, b) => {
          return a.indexNumDrag - b.indexNumDrag;
        })
        .map(item => {
          const { rect, indexNumDrag, ...rest } = item;
          const currId = item[keyId];
          newIdMap.push(currId);
          if (currId === id) {
            currItem = item;
          }
          return { ...rest };
        });
    } else {
      _list = [...listRef.value[fatherId]]
        .sort((a, b) => {
          const aTop = a.rect.top + a.rect.offsetY;
          const bTop = b.rect.top + b.rect.offsetY;
          return aTop - bTop;
        })
        .map(item => {
          const { rect, indexNumDrag, ...rest } = item;
          const currId = item[keyId];
          newIdMap.push(currId);
          if (currId === id) {
            currItem = item;
          }
          return { ...rest };
        });
    }
    // 未变化
    if (JSON.stringify(oldIdMap) === JSON.stringify(newIdMap)) {
      setStyle(ownerInstance, {
        transform: 'none',
        transition: 'transform 0.2s',
        'z-index': '1',
      });
      listRef.value[fatherId].map((item, index) => {
        item.rect.offsetY = 0;
        item.rect.offsetX = 0;
        item.indexNumDrag = index;
      });
    } else {
      const newIndex = newIdMap.findIndex(item => item === id);
      const otherOffsetY = listRef.value[fatherId][newIndex].rect.top - currItem.rect.top;
      const otherOffsetX = listRef.value[fatherId][newIndex].rect.left - currItem.rect.left;
      setStyle(ownerInstance, {
        transform: `translateY(${otherOffsetY}px) translateX(${otherOffsetX}px)`,
        transition: 'transform 0.2s',
        'z-index': '1',
      });
    }
    canDrag = false;
    ownerInstance.callMethod('moveEnd', _list);
  };

export default {
  propObserver: propObserver,
  touchmove: touchmove,
  touchend: touchend,
  touchStart: touchStart,
};
