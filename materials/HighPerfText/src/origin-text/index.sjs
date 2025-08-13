const queryComponent = (ownerInstance, instanceId, selector) => {
  const root = ownerInstance.selectComponent(`#${instanceId}`);
  return selector ? root.selectComponent(selector) : root;
};

const getProps = (ownerInstance, instanceId) => {
  const root = queryComponent(ownerInstance, instanceId);
  return root ? root.getDataset() : {};
};

const getText = (ownerInstance, instanceId, val) => {
  const props = getProps(ownerInstance, instanceId);

  const valuestart = props.valuestart;
  const valuescale = props.valuescale;
  const fixnum = props.fixnum;
  const min = props.min;
  const max = props.max;

  let ret = val;
  if (typeof fixnum === 'number') {
    ret = valuestart + ret * valuescale;
    console.log('🚀 ~ index ~ valuestart:', valuestart, valuescale);
    ret = Number(ret).toFixed(fixnum);
  }

  return Math.min(max, Math.max(min, ret));
};

module.exports = {
  setVal: instanceId => (newVal, oldVal, ownerInstance) => {
    const textNode = ownerInstance.selectComponent(`#${instanceId}`);

    const defval = getProps(ownerInstance, instanceId).defval;

    if (textNode) {
      if (defval) {
        textNode.setStyle({
          '--text': `"${getText(ownerInstance, instanceId, defval)}"`,
        });
      }
    }
  },
  init(newVal, oldVal, ownerInstance) {
    const instanceId = newVal;
    const textNode = ownerInstance.selectComponent(`#${instanceId}`);
    const eventName = getProps(ownerInstance, instanceId).eventname;

    const defval = getProps(ownerInstance, instanceId).defval;
    const checkEventInstanceId = getProps(ownerInstance, instanceId).checkeventinstanceid;

    if (textNode && eventName) {
      if (defval) {
        textNode.setStyle({
          '--text': `"${getText(ownerInstance, instanceId, defval)}"`,
        });
      }

      ownerInstance.eventChannel.on(eventName, res => {
        if (checkEventInstanceId) {
          if (res.instanceId === instanceId) {
            textNode.setStyle({
              '--text': `"${getText(ownerInstance, instanceId, res.value)}"`,
            });
          }
        } else {
          textNode.setStyle({
            '--text': `"${getText(ownerInstance, instanceId, res.value)}"`,
          });
        }
      });
    }
  },
};
