const queryComponent = (ownerInstance, instanceId, selector) => {
  const root = ownerInstance.selectComponent(`#${instanceId}`);
  return selector ? root.selectComponent(selector) : root;
};

const getProps = (ownerInstance, instanceId) => {
  const root = queryComponent(ownerInstance, instanceId);
  return root ? root.getDataset() : {};
};

const getRoundValue = (ownerInstance, instanceId, val) => {
  const min = getProps(ownerInstance, instanceId).min;
  const max = getProps(ownerInstance, instanceId).max;

  return Math.min(max, Math.max(min, +val));
};

const getMathTypeFunc = (ownerInstance, instanceId) => {
  const mathtype = getProps(ownerInstance, instanceId).mathtype || 'round';
  const fixnum = getProps(ownerInstance, instanceId).fixnum || 1;

  if (mathtype === 'origin') {
    return n => {
      return n;
    };
  }

  if (mathtype === 'fix') {
    return n => {
      const ret = Number(n).toFixed(fixnum);
      return ret;
    };
  }

  if (mathtype === 'none') {
    return _ => getRoundValue(ownerInstance, instanceId, _);
  }

  if (mathtype in Math) {
    return n => {
      const ret = Math[mathtype](n);
      return getRoundValue(ownerInstance, instanceId, ret);
    };
  } else {
    console.log(`mathtype 不支持 ${mathtype}, 兜底为 round`);
    return n => {
      const ret = Math.round(n);
      return getRoundValue(ownerInstance, instanceId, ret);
    };
  }
};

const createStyle = (ownerInstance, instanceId, cssVal) => {
  const str = String(cssVal);
  const mathtype = getProps(ownerInstance, instanceId).mathtype || 'round';
  if (mathtype === 'fix' && +cssVal === 0) {
    return {
      '--perf-text1-op': '0',
      '--perf-text-value2': `${0}`,
    };
  }

  if (str.includes('.')) {
    const [ch1, ch2] = str.split('.');
    const prefixShow = cssVal >= 0 ? 'none' : 'inline';
    return {
      '--perf-text-prefix-show': `${prefixShow}`,
      '--perf-text-value': `${Math.abs(+ch1)}`,
      '--perf-text-value2': `${Math.abs(+ch2)}`,
      '--perf-text1-op': '1',
    };
  }

  return {
    '--perf-text-value': `${cssVal}`,
  };
};

module.exports = {
  setVal: instanceId => (newVal, oldVal, ownerInstance) => {
    const textNode = ownerInstance.selectComponent(`#${instanceId}`);

    const valueStart = getProps(ownerInstance, instanceId).valuestart || 0;
    const valueScale = getProps(ownerInstance, instanceId).valuescale || 1;
    const defval = getProps(ownerInstance, instanceId).defval;

    const mathFunc = getMathTypeFunc(ownerInstance, instanceId) || Math.round;

    if (textNode) {
      if (defval) {
        const cssVal = mathFunc(valueStart + defval * valueScale);
        textNode.setStyle(createStyle(ownerInstance, instanceId, cssVal));
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

    const mathFunc = getMathTypeFunc(ownerInstance, instanceId) || Math.round;

    if (textNode && eventName) {
      if (defval) {
        const cssVal = mathFunc(valueStart + defval * valueScale);
        textNode.setStyle(createStyle(ownerInstance, instanceId, cssVal));
      }

      ownerInstance.eventChannel.on(eventName, res => {
        if (checkEventInstanceId) {
          if (res.instanceId === instanceId) {
            const cssVal = mathFunc(valueStart + res.value * valueScale);
            textNode.setStyle(createStyle(ownerInstance, instanceId, cssVal));
          }
        } else {
          const cssVal = mathFunc(valueStart + res.value * valueScale);
          textNode.setStyle(createStyle(ownerInstance, instanceId, cssVal));
        }
      });
    }
  },
};
