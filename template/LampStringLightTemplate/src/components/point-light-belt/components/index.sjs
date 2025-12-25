/*
 * @Author: mjh
 * @Date: 2024-09-14 13:55:50
 * @LastEditors: mjh
 * @LastEditTime: 2024-09-25 19:39:20
 * @Description:
 */
const getProps = (ownerInstance, instanceId) => {
  const root = queryComponent(ownerInstance, instanceId);
  return root ? root.getDataset() : {};
};
const queryComponent = (ownerInstance, instanceId, selector) => {
  const root = ownerInstance.selectComponent(`#${instanceId}`);
  return selector ? root.selectComponent(selector) : root;
};
const eventFunMap = {};

let currentInstantce = null;
const init = (newVal, oldVal, ownerInstance) => {
  const instanceId = newVal;
  currentInstantce = newVal;
  const textNode = ownerInstance.selectComponent(`#${instanceId}`);
  const { eventchannelname: eventChannelName, eventslidermovename: eventSliderMoveName } = getProps(
    ownerInstance,
    instanceId
  );
  if (textNode && eventChannelName) {
    eventFunMap[eventChannelName] &&
      ownerInstance.eventChannel.off(eventChannelName, eventFunMap[eventChannelName]);
    const currFun = res => {
      ownerInstance.callMethod('eventChannelChange', res);
    };
    eventFunMap[eventChannelName] = currFun;
    ownerInstance.eventChannel.on(eventChannelName, currFun);
  }

  // 监听滑块滚动
  if (textNode && eventSliderMoveName) {
    eventFunMap[eventSliderMoveName] &&
      ownerInstance.eventChannel.off(eventSliderMoveName, eventFunMap[eventSliderMoveName]);
    const currFun = res => {
      const { value } = res;

      const { length } = getProps(ownerInstance, instanceId);

      const row = Math.ceil(length / 6);
      // 一行 52，最后一行 30
      const scrollHeight = 104 * row - 22;
      const contentHeight = 390;
      const maxScrollTop = scrollHeight - contentHeight;
      // textNode 更新滑块位置
      const offset = ((100 - value) * maxScrollTop) / 100;
      textNode.setStyle({
        transform: `translateY(${-offset}rpx)`,
      });
      ownerInstance.callMethod('eventSliderMove', offset);
    };
    eventFunMap[eventSliderMoveName] = currFun;
    ownerInstance.eventChannel.on(eventSliderMoveName, currFun);
  }
};

const touchChange = (e, ownerInstance) => {
  const { pageX, pageY } = e.touches[0] || {};
  ownerInstance.callMethod('selectChange', pageX, pageY);
};

const touchEnd = (e, ownerInstance) => {
  ownerInstance.callMethod('selectChangeEnd');
};

const resetLampPosition = instanceId => (newVal, oldVal, ownerInstance) => {
  // 灯珠数量变化，组件需要回复到初始位置
  // console.log('lamp change', newVal, oldVal, instanceId)
  const textNode = ownerInstance.selectComponent(`#${instanceId}`);
  if (textNode) {
    textNode.setStyle({
      transform: `translateY(0)`,
    });
  }
  ownerInstance.callMethod('eventSliderMove', 0);
};

module.exports = {
  init,
  touchChange,
  touchEnd,
  resetLampPosition,
};
