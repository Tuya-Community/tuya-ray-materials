const queryComponent = (ownerInstance, instanceId, selector) => {
  const root = ownerInstance.selectComponent(`#${instanceId}`);
  return selector ? root.selectComponent(selector) : root;
};

const getProps = (ownerInstance, instanceId) => {
  const root = queryComponent(ownerInstance, instanceId);
  return root ? root.getDataset() : {};
};

const getMathTypeFunc = (ownerInstance, instanceId) => {
  const mathtype = getProps(ownerInstance, instanceId).mathtype || 'round';

  if(mathtype in Math) {
    return Math[mathtype]
  } else {
    console.log(`mathtype 不支持 ${mathtype}, 兜底为 round`)
    return Math.round
  }
}

module.exports = {
  setVal: instanceId => (newVal, oldVal, ownerInstance) => {
    const textNode = ownerInstance.selectComponent(`#${instanceId}`);

    const valueStart = getProps(ownerInstance, instanceId).valuestart || 0;
    const valueScale = getProps(ownerInstance, instanceId).valuescale || 1;
    const defval = getProps(ownerInstance, instanceId).defval;

    const mathFunc = getMathTypeFunc(ownerInstance, instanceId) || Math.round

    if (textNode) {
      if (defval) {
        textNode.setStyle({
          '--perf-text-value': `${mathFunc(valueStart + defval * valueScale)}`,
        });
      }
    }
  },
  init(newVal, oldVal, ownerInstance) {
    const instanceId = newVal;
    const textNode = ownerInstance.selectComponent(`#${instanceId}`);
    const eventName = getProps(ownerInstance, instanceId).eventname;

    const valueStart = getProps(ownerInstance, instanceId).valuestart || 0;
    const valueScale = getProps(ownerInstance, instanceId).valuescale || 1;
    const defval = getProps(ownerInstance, instanceId).defval;
    const checkEventInstanceId = getProps(ownerInstance, instanceId).checkeventinstanceid;

    const mathFunc = getMathTypeFunc(ownerInstance, instanceId) || Math.round

    if (textNode && eventName) {
      if (defval) {
        textNode.setStyle({
          '--perf-text-value': `${mathFunc(valueStart + defval * valueScale)}`,
        });
      }

      ownerInstance.eventChannel.on(eventName, res => {
        if (checkEventInstanceId) {
          if (res.instanceId === instanceId) {
            textNode.setStyle({
              '--perf-text-value': `${mathFunc(valueStart + res.value * valueScale)}`,
            });
          }
        } else {
          textNode.setStyle({
            '--perf-text-value': `${mathFunc(valueStart + res.value * valueScale)}`,
          });
        }
      });
    }
  },
};
