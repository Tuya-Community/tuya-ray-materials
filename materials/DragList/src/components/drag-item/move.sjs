// 用来排序的数组
let listRef = {
  value: [],
};
let startPo = { y: 0 }; // 记录当前拖动元素的开始的位置
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

const propObserver = function (newValue = []) {
  if (canDrag) return;
  listRef.value = newValue.map(item => ({ ...item }));
};

const resetX = function (id, keyId) {
  let _data = listRef.value.find(item => item[keyId] === id);
  return _data;
};

const queryComponent = function (ownerInstance, selector) {
  const instance = ownerInstance?.selectComponent(selector);
  return instance;
};

const touchStart = function (e, ownerInstance) {
  const duration = getProperty(e, 'duration') || 0;
  timer = setTimeout(() => {
    ownerInstance.callMethod('handleTouchStart');
    const { pageY } = e.touches[0];
    startPo.y = pageY;
    ownerInstance.callMethod('handleVibrateShort', 'heavy');
    timer && clearTimeout(timer);
    canDrag = true;
    setStyle(ownerInstance, {
      transition: 'none',
    });
  }, duration);
};

const touchmove = function (e, ownerInstance) {
  if (!canDrag) {
    timer && clearTimeout(timer);
    return;
  }
  const { getDataset } = e.instance;
  const data = getDataset();
  const keyId = data.keyid;
  const currDom = resetX(data.id, keyId);
  const { pageY } = e.touches[0];
  let offset = pageY - startPo.y;
  // 当前拖动的项
  const currDomBottom = currDom.rect.bottom + offset;
  const currDomTop = currDom.rect.top + offset;
  listRef.value.forEach((v, index) => {
    if (v[keyId] === currDom[keyId]) {
      v.rect.offset = offset;
      return;
    }
    const otherRect = v.rect;
    const otherHeight = otherRect.height;
    if (
      currDomBottom > otherRect.bottom - otherHeight / 2 - 5 + otherRect.offset &&
      currDomBottom < otherRect.bottom + otherRect.offset
    ) {
      const preRect = listRef.value[index - 1]?.rect;
      // 下超了
      const otherOffset = !otherRect.offset ? preRect.top - otherRect.top : 0;
      otherRect.offset = otherOffset;
      ownerInstance.callMethod('movingChangeSort', {
        [keyId]: v[keyId],
        offset: otherOffset,
        style: {
          transform: `translateY(${otherOffset}px)`,
          transition: 'transform 0.5s',
        },
      });
      ownerInstance.callMethod('handleVibrateShort', 'heavy');
    }
    if (
      currDomTop < otherRect.top + otherHeight / 2 + 5 + otherRect.offset &&
      currDomTop > otherRect.top + otherRect.offset
    ) {
      const afterRect = listRef.value[index + 1]?.rect;
      // 上超了
      const otherOffset = !otherRect.offset ? afterRect.top - otherRect.top : 0;
      otherRect.offset = otherOffset;
      ownerInstance.callMethod('movingChangeSort', {
        [keyId]: v[keyId],
        offset: otherOffset,
        style: {
          transform: `translateY(${otherOffset}px)`,
          transition: 'transform 0.5s',
        },
      });
      ownerInstance.callMethod('handleVibrateShort', 'heavy');
    }
  });
  // 当前拖动数据
  setStyle(ownerInstance, {
    transform: `translateY(${offset}px)`,
    'z-index': '10',
    position: 'relative',
  });
};

const touchend = function (e, ownerInstance) {
  timer && clearTimeout(timer);
  if (!canDrag) {
    ownerInstance.callMethod('moveCanceled');
    return;
  }
  const { getDataset } = e.instance;
  const data = getDataset();
  const keyId = data.keyid;
  const id = data.id;
  const oldIdMap = listRef.value.map(item => item[keyId]);
  ownerInstance.callMethod('handleVibrateShort', 'heavy');
  let currItem = {};
  const newIdMap = [];
  const _list = [...listRef.value]
    .sort((a, b) => {
      const aTop = a.rect.top + a.rect.offset;
      const bTop = b.rect.top + b.rect.offset;
      return aTop - bTop;
    })
    .map(item => {
      const { rect, ...rest } = item;
      const currId = item[keyId];
      newIdMap.push(currId);
      if (currId === id) {
        currItem = item;
      }
      return { ...rest };
    });
  if (JSON.stringify(oldIdMap) === JSON.stringify(newIdMap)) {
    setStyle(ownerInstance, {
      transform: `none`,
      transition: 'transform 0.2s',
    });
    listRef.value.map(item => (item.rect.offset = 0));
  } else {
    const otherOffset =
      listRef.value[newIdMap.findIndex(item => item === id)].rect.top - currItem.rect.top;
    setStyle(ownerInstance, {
      transform: `translateY(${otherOffset}px)`,
      transition: 'transform 0.2s',
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
  dataList: listRef.value,
};
