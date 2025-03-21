// props
const THUMBS = ['start', 'end'];

const isNumber = n => /\d+/.test(n);
const getNumber = (n, def) => (isNumber(n) ? n : def);

// state by instanceId in sjs singleton instance
const getOst = (ownerInstance, instanceId) => {
  const ost = ownerInstance.getState() || {};
  return ost[instanceId] || {};
};
// set instance state
const setOstValue = (ownerInstance, instanceId, key, value) => {
  const ost = ownerInstance.getState() || {};
  const state = ost[instanceId] || {};
  state[key] = value;
  ost[instanceId] = state;
};

const isUndefined = val => typeof val === 'undefined';
const isNull = val => val === null;
/**
 * 值不存在
 */
const isNullOrUndefined = val => isNull(val) || isUndefined(val);
/**
 * 值存在
 */
const isNotNullOrUndefined = val => !isNullOrUndefined(val);

const isValuesInited = (ownerInstance, instanceId) => {
  return (
    isNotNullOrUndefined(getStart(ownerInstance, instanceId)) && getEnd(ownerInstance, instanceId)
  );
};

// hideBarOnFirstRender
// 判断第一次渲染和后续更新渲染

// watch props
const createPropObserver = prop => instanceId =>
  function (newValue, oldValue, ownerInstance) {
    const ost = getOst(ownerInstance, instanceId);
    const isUpdate = oldValue !== undefined;

    if (prop === 'start') {
      setStart(ownerInstance, instanceId, getNumber(newValue, null));
    }
    if (prop === 'watchstart' && isUpdate) {
      setStart(ownerInstance, instanceId, getNumber(newValue, null));
    }
    if (prop === 'end') {
      const end = convertOutValueToValue(ownerInstance, instanceId, getNumber(newValue, null));
      setEnd(ownerInstance, instanceId, end);
    }
    if (prop === 'watchend' && isUpdate) {
      setEnd(
        ownerInstance,
        instanceId,
        convertOutValueToValue(ownerInstance, instanceId, getNumber(newValue, null))
      );
    }

    setOstValue(ownerInstance, instanceId, '_startValueInPixels', null);
    setOstValue(ownerInstance, instanceId, '_endValueInPixels', null);

    if (!ost.rendered) {
      if (isValuesInited(ownerInstance, instanceId)) {
        setOstValue(ownerInstance, instanceId, 'rendered', true);
      }
    }

    const hideBarOnFirstRender = isHideBarOnFirstRender(ownerInstance, instanceId);

    if (hideBarOnFirstRender) {
      if (ost.rendered && isValuesInited(ownerInstance, instanceId)) {
        updateSlider(ownerInstance, instanceId);
      } else {
        hideBarThumbs(ownerInstance, instanceId);
      }
    } else {
      updateSlider(ownerInstance, instanceId);
    }
  };

// watch props
const updateObserver = instanceId =>
  function (newValue, oldValue, ownerInstance) {
    updateSlider(ownerInstance, instanceId);
  };

const getMin = (ownerInstance, instanceId) => {
  return getNumber(getProps(ownerInstance, instanceId).min, 0);
};

const getMax = (ownerInstance, instanceId) => {
  const max = getNumber(getProps(ownerInstance, instanceId).max, 100);
  const min = getMin(ownerInstance, instanceId);
  if (max > min) return max;
  return min + 100;
};

const getValueMin = (ownerInstance, instanceId) => {
  return getNumber(getProps(ownerInstance, instanceId).valuemin, 0);
};

const convertValueToOutValue = (ownerInstance, instanceId, value) => {
  const valueMin = getValueMin(ownerInstance, instanceId);
  const step = getStep(ownerInstance, instanceId);
  if (valueMin) {
    const max = getMax(ownerInstance, instanceId);
    const result = parseInt(valueMin + ((max - valueMin) / max) * value);
    // 这里处理step
    return Number(result / step).toFixed(0) * step;
  }
  return Number(value / step).toFixed(0) * step;
};

const convertOutValueToValue = (ownerInstance, instanceId, outValue) => {
  const valueMin = getValueMin(ownerInstance, instanceId);
  if (valueMin) {
    const max = getMax(ownerInstance, instanceId);
    return parseInt((outValue - valueMin) / ((max - valueMin) / max));
  }
  return outValue;
};

const getStep = (ownerInstance, instanceId) => {
  const step = getNumber(getProps(ownerInstance, instanceId).step, 1);
  return step === 0 ? 1 : step;
};
const getStart = (ownerInstance, instanceId) => {
  const ost = getOst(ownerInstance, instanceId);
  return ost._start;
};
const setStart = (ownerInstance, instanceId, value) => {
  setOstValue(ownerInstance, instanceId, '_start', setBoundries(ownerInstance, instanceId, value));
};
const getEnd = (ownerInstance, instanceId) => {
  const ost = getOst(ownerInstance, instanceId);
  return ost._end;
};
const setEnd = (ownerInstance, instanceId, value) => {
  setOstValue(ownerInstance, instanceId, '_end', setBoundries(ownerInstance, instanceId, value));
};
const getRangeValue = (ownerInstance, instanceId) => {
  return Math.abs(getEnd(ownerInstance, instanceId) - getStart(ownerInstance, instanceId));
};

const getProps = (ownerInstance, instanceId) => {
  const slider = queryComponent(ownerInstance, instanceId);
  return slider ? slider.getDataset() : {};
};

const isRangeMode = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  const isRangeMode = props.mode === 'range';
  return isRangeMode;
};

const isHideThumb = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.hidethumb;
};

const isHideThumbButton = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.hidethumbbutton;
};

const isShowSteps = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.showsteps;
};

const isHideBarOnFirstRender = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.hidebaronfirstrender;
};

const isVerticalMode = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return props.direction === 'vertical';
};

const isEnableTouch = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  if (isHideThumb(ownerInstance, instanceId)) {
    return true;
  }
  return !!props.enabletouch;
};

const isEnableTouchBar = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.enabletouchbar;
};

const getFormatter = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return props.formatterrenderformatter;
};

const getFormatterScale = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return props.formatterrenderscale;
};

const getFormatterStart = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return props.thumbstylerendervaluestart;
};

const getThumbWrapStyle = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return props.thumbwrapstyle;
};

const isFormatterValueReverse = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.thumbstylerendervaluereverse;
};

const isReverseMode = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.reverse && !isRangeMode(ownerInstance, instanceId);
};

const queryComponent = (ownerInstance, instanceId, selector) => {
  const root = ownerInstance.selectComponent(`#${instanceId}`);
  return selector ? root.selectComponent(selector) : root;
};
const queryComponentAll = (ownerInstance, instanceId, selector) => {
  const root = queryComponent(ownerInstance, instanceId);
  return selector ? root.selectAllComponents(selector) : [];
};

const getThumbWidth = (ownerInstance, instanceId, type = 'width') => {
  const thumbStart = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-start');
  const thumbStartWidth = thumbStart.getBoundingClientRect()[type];
  if (thumbStartWidth) {
    return thumbStartWidth;
  }
  const thumbEnd = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-end');
  const thumbEndWidth = thumbEnd.getBoundingClientRect()[type];
  if (thumbEndWidth) {
    return thumbEndWidth;
  }
};

function hideBarThumbs(ownerInstance, instanceId) {
  const thumbs = queryComponentAll(ownerInstance, instanceId, '.rayui-slider-thumb');
  const bar = queryComponent(ownerInstance, instanceId, '.rayui-slider-bar');

  thumbs.forEach(thumb => {
    thumb.setStyle({
      opacity: 0,
    });
  });

  bar.setStyle({
    opacity: 0,
  });
}

function updateSlider(ownerInstance, instanceId) {
  const ost = getOst(ownerInstance, instanceId);

  const ost_slider = queryComponent(ownerInstance, instanceId);
  setOstValue(ownerInstance, instanceId, 'slider', ost_slider);

  const ost_sliderRange = queryComponent(ownerInstance, instanceId, '.rayui-slider-bar');
  setOstValue(ownerInstance, instanceId, 'sliderRange', ost_sliderRange);

  if (ost_slider && ost_sliderRange) {
    const isRange = isRangeMode(ownerInstance, instanceId);
    const hideThumb = isHideThumb(ownerInstance, instanceId);
    const isVertical = isVerticalMode(ownerInstance, instanceId);
    const isRerverse = isReverseMode(ownerInstance, instanceId);
    const enableTouchBar = isEnableTouchBar(ownerInstance, instanceId);

    const thumbWidth = isVertical
      ? getThumbWidth(ownerInstance, instanceId, 'height')
      : getThumbWidth(ownerInstance, instanceId, 'width');

    const ost_thumbWidth = hideThumb ? 0 : thumbWidth;
    setOstValue(ownerInstance, instanceId, 'thumbWidth', ost_thumbWidth);

    const props = getProps(ownerInstance, instanceId);

    let ost_maxRange =
      (isVertical
        ? ost_slider.getBoundingClientRect().height
        : ost_slider.getBoundingClientRect().width) - ost_thumbWidth;

    ost_maxRange += getNumber(props.maxrangeoffset, 0);
    setOstValue(ownerInstance, instanceId, 'maxRange', ost_maxRange);

    // 如果是单向，start就是 min
    const _startValueInPixels = isRange
      ? convertValueToPixels(ownerInstance, instanceId, getStart(ownerInstance, instanceId))
      : 0;

    setOstValue(ownerInstance, instanceId, '_startValueInPixels', _startValueInPixels);

    const _endValueInPixels = convertValueToPixels(
      ownerInstance,
      instanceId,
      getEnd(ownerInstance, instanceId)
    );

    setOstValue(ownerInstance, instanceId, '_endValueInPixels', _endValueInPixels);

    const reverseRange = isRerverse
      ? getMax(ownerInstance, instanceId) -
        getMin(ownerInstance, instanceId) -
        getRangeValue(ownerInstance, instanceId)
      : 0;

    const _end = getEnd(ownerInstance, instanceId);

    setThumb(ownerInstance, instanceId, 'start', _startValueInPixels, {
      display: hideThumb ? 'none' : isRange ? 'block' : 'none', // 单向隐藏左按钮,
    });

    const endValue = isRerverse
      ? convertValueToPixels(ownerInstance, instanceId, reverseRange)
      : _endValueInPixels;
    setThumb(
      ownerInstance,
      instanceId,
      'end',
      endValue,
      {
        display: hideThumb ? 'none' : 'block', // 单向隐藏左按钮
      },
      _end
    );
    setText(
      ownerInstance,
      instanceId,
      convertValueToOutValue(ownerInstance, instanceId, getEnd(ownerInstance, instanceId))
    );

    setRange(
      ownerInstance,
      instanceId,
      _startValueInPixels,
      isRerverse ? convertValueToPixels(ownerInstance, instanceId, reverseRange) : _endValueInPixels
    );

    const showSteps = isShowSteps(ownerInstance, instanceId);
    if (showSteps) {
      setBarStepsWrap(ownerInstance, instanceId);
    }

    if (hideThumb || enableTouchBar) {
      // 修复问题
      const trackCurrentX = convertValueToPixels(
        ownerInstance,
        instanceId,
        isRerverse
          ? getMax(ownerInstance, instanceId) -
              getMin(ownerInstance, instanceId) -
              getEnd(ownerInstance, instanceId)
          : getEnd(ownerInstance, instanceId)
      );
      setOstValue(ownerInstance, instanceId, 'trackCurrentX', trackCurrentX);
    }

    const trackWidth = isVertical
      ? ost_slider.getBoundingClientRect().height
      : ost_slider.getBoundingClientRect().width;

    setOstValue(ownerInstance, instanceId, 'trackWidth', trackWidth);
  }
}

function renderTemplate(template, data) {
  return template.replace(/{{[\s\S]*?}}/g, slot => {
    const code = slot.replace(/{{|}}/g, '');
    let codeStr = code;
    for (const key in data) {
      codeStr = codeStr.replace(key, data[key]);
    }
    return eval(codeStr);
  });
}

function setText(ownerInstance, instanceId, text) {
  const props = getProps(ownerInstance, instanceId);
  if (props.showtext) {
    const content = props.texttemplate ? renderTemplate(props.texttemplate, { text }) : text;
    ownerInstance.callMethod('setText', { instanceId, content });
  }
}

/**
 * 百分比值转换滑动位置
 */
function convertValueToPixels(ownerInstance, instanceId, value) {
  const ost = getOst(ownerInstance, instanceId);
  return parseFloat(
    (
      (value / (getMax(ownerInstance, instanceId) - getMin(ownerInstance, instanceId))) *
      ost.maxRange
    ).toFixed(2)
  );
}

/**
 * 滑动位置转换百分比值
 */
function convertPixelsToValue(ownerInstance, instanceId, value, step = 1) {
  const ost = getOst(ownerInstance, instanceId);

  let _value = parseFloat(
    String(
      (value / ost.maxRange) *
        (getMax(ownerInstance, instanceId) - getMin(ownerInstance, instanceId))
    )
  );

  // round to step value
  _value = step > 0 ? Math.round(_value / step) * step : _value;
  return parseFloat(_value.toFixed(2));
}

function setThumb(ownerInstance, instanceId, thumbName, valueInPixels, style, outValue) {
  const isVertical = isVerticalMode(ownerInstance, instanceId);

  const thumbs = queryComponentAll(ownerInstance, instanceId, '.rayui-slider-thumb');
  const renderThumbs = queryComponentAll(ownerInstance, instanceId, '.rayui-slider-thumb-render');

  const formatterTpl = getFormatter(ownerInstance, instanceId);
  const formatterScale = getFormatterScale(ownerInstance, instanceId) || 1;
  const formatterStart = getFormatterStart(ownerInstance, instanceId) || 0;
  const formatterReverse = isFormatterValueReverse(ownerInstance, instanceId);
  const thumbWrapStyle = getThumbWrapStyle(ownerInstance, instanceId);

  const hsvStyle = {};
  if (formatterTpl && isNotNullOrUndefined(outValue)) {
    for (const attr in formatterTpl) {
      if (formatterTpl[attr]) {
        let calcValue = outValue;
        if (formatterReverse) {
          const reverseRange =
            getMax(ownerInstance, instanceId) - getRangeValue(ownerInstance, instanceId);
          const nextEnd = reverseRange;
          const out = convertValueToOutValue(ownerInstance, instanceId, nextEnd);
          calcValue = out;
        }
        hsvStyle[attr] = formatterTpl[attr].replace(
          'value',
          parseInt(calcValue * formatterScale + formatterStart)
        );
      }
    }
  }

  thumbs.forEach(thumb => {
    if (thumb.getDataset().name === thumbName) {
      if (isVertical) {
        thumb.setStyle({
          ...(style || {}),
          ...(thumbWrapStyle || {}),
          top: `${valueInPixels}px`,
        });
      } else {
        thumb.setStyle({
          ...(style || {}),
          ...(thumbWrapStyle || {}),
          left: `${valueInPixels}px`,
        });
      }
    }
  });
  renderThumbs.forEach(thumb => {
    if (thumb.getDataset().name === thumbName) {
      thumb.setStyle({
        ...(hsvStyle || {}),
      });
    }
  });
}

function updateThumbZIndex(ownerInstance, instanceId) {
  const isRange = isRangeMode(ownerInstance, instanceId);
  if (!isRange) return;
  const start = getStart(ownerInstance, instanceId);
  const end = getEnd(ownerInstance, instanceId);
  const min = getMin(ownerInstance, instanceId);
  const max = getMax(ownerInstance, instanceId);

  const mid = Math.floor((max - min) / 2);

  // 左右重叠，右在上
  if (end < mid) {
    const start = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-start');
    const end = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-end');

    if (start && end) {
      start.setStyle({
        zIndex: 10,
      });
      end.setStyle({
        zIndex: 11,
      });
    }
  }
  // 左右重叠，左在上
  if (start > mid) {
    const start = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-start');
    const end = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-end');

    if (start && end) {
      start.setStyle({
        zIndex: 11,
      });
      end.setStyle({
        zIndex: 10,
      });
    }
  }
}

function setBarStepsWrap(ownerInstance, instanceId) {
  const ost_slider = queryComponent(ownerInstance, instanceId);
  const isVertical = isVerticalMode(ownerInstance, instanceId);
  const wrap = queryComponent(ownerInstance, instanceId, '.rayui-slider-bar-steps_wrap');

  let length = 0;
  if (isVertical) {
    length = ost_slider.getBoundingClientRect().height;
  } else {
    length = ost_slider.getBoundingClientRect().width;
  }

  wrap.setStyle({
    [isVertical ? 'height' : 'width']: `${length}px`,
  });
}

function setRange(ownerInstance, instanceId, start, end) {
  const ost = getOst(ownerInstance, instanceId);
  const isVertical = isVerticalMode(ownerInstance, instanceId);
  const isReverse = isReverseMode(ownerInstance, instanceId);
  const hideThumbButton = isHideThumbButton(ownerInstance, instanceId);

  const maxThumb = Math.max(start, end);
  const minThumb = Math.min(start, end);
  const width = Math.abs(maxThumb - minThumb);
  const thumbWidth = ost.thumbWidth;

  let rangeWidth = hideThumbButton ? width + thumbWidth : width + thumbWidth / 2;
  if (isReverse) {
    rangeWidth = ost.trackWidth - rangeWidth + (hideThumbButton ? thumbWidth : 0);
  }

  ost.sliderRange.setStyle({
    [isVertical ? (isReverse ? 'bottom' : 'top') : isReverse ? 'right' : 'left']: `${minThumb}px`,
    [isVertical ? 'height' : 'width']: `${rangeWidth}px`,
    opacity: 1,
    display: 'block',
  });
}

function setBoundries(ownerInstance, instanceId, value) {
  const isReverse = isReverseMode(ownerInstance, instanceId);
  let _value = typeof value === 'number' ? value : parseFloat(value);

  _value = _value < 0 ? 0 : value; // MIN

  return _value > getMax(ownerInstance, instanceId) ? getMax(ownerInstance, instanceId) : _value; // MAX
}

const handleMouseDown = instanceId => (event, ownerInstance) => {
  const target = event.instance;
  const thumbId = target.getDataset().name;
  const isVertical = isVerticalMode(ownerInstance, instanceId);
  onStart(event, ownerInstance, instanceId);

  const ost = getOst(ownerInstance, instanceId);

  // allow move
  if (THUMBS.includes(thumbId)) {
    setOstValue(ownerInstance, instanceId, 'currentThumbName', thumbId);
    setOstValue(ownerInstance, instanceId, 'currentThumb', target);

    const ost_slider = queryComponent(ownerInstance, instanceId);
    const rect = ost_slider.getBoundingClientRect();

    const startX = isVertical ? event.touches[0].clientY : event.touches[0].clientX;

    const currentThumbPositionX = startX - (isVertical ? rect.top : rect.left);

    setOstValue(ownerInstance, instanceId, 'currentThumbPositionX', currentThumbPositionX);

    toggleActiveThumb(ownerInstance, instanceId, true);

    setOstValue(ownerInstance, instanceId, 'isMoving', true);
  } else {
    return false;
  }
};

const handleTrackMouseDown = instanceId => (event, ownerInstance) => {
  const isRange = isRangeMode(ownerInstance, instanceId);
  const hideThumb = isHideThumb(ownerInstance, instanceId);
  const enableTouchBar = isEnableTouchBar(ownerInstance, instanceId);

  const ost = getOst(ownerInstance, instanceId);
  const isVertical = isVerticalMode(ownerInstance, instanceId);

  const ost_slider = queryComponent(ownerInstance, instanceId);
  const rect = ost_slider.getBoundingClientRect();
  const startX = isVertical
    ? event.touches[0].clientY - rect.top
    : event.touches[0].clientX - rect.left;

  // 修复touch模式触摸抖动
  const trackStartX = startX;

  setOstValue(ownerInstance, instanceId, 'trackStartX', trackStartX);

  onStart(event, ownerInstance, instanceId);
  if (!isRange) {
    setOstValue(ownerInstance, instanceId, 'currentThumbName', 'end');
  }

  if (!isRange && !hideThumb && isEnableTouch(ownerInstance, instanceId) && !enableTouchBar) {
    const thumbEnd = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-end');

    setOstValue(ownerInstance, instanceId, 'currentThumb', thumbEnd);

    const offset = isVertical
      ? thumbEnd.getBoundingClientRect().height
      : thumbEnd.getBoundingClientRect().width;

    if (thumbEnd) {
      let moveX = ost.trackStartX - offset / 2;

      let moveValue = convertPixelsToValue(
        ownerInstance,
        instanceId,
        moveX,
        getStep(ownerInstance, instanceId)
      );
      // lock the thumb within the bounaries
      moveValue = setBoundries(ownerInstance, instanceId, moveValue);

      setOstValue(ownerInstance, instanceId, '_start', 0);
      setOstValue(ownerInstance, instanceId, '_end', moveValue);

      moveX = convertValueToPixels(ownerInstance, instanceId, moveValue);

      const outValue = onChange(ownerInstance, instanceId, 'end');
      setThumb(ownerInstance, instanceId, 'end', moveX, null, outValue);
      setRange(ownerInstance, instanceId, 0, moveX);
      setOstValue(ownerInstance, instanceId, 'isMoving', true);

      const currentThumbPositionX =
        startX -
        (isVertical ? thumbEnd.getBoundingClientRect().top : thumbEnd.getBoundingClientRect().left);
      setOstValue(ownerInstance, instanceId, 'currentThumbPositionX', currentThumbPositionX);
    }
  }
};

function toggleActiveThumb(ownerInstance, instanceId, toggle = true) {
  const ost = getOst(ownerInstance, instanceId);
}

const onMouseMove = instanceId => (event, ownerInstance) => {
  const isVertical = isVerticalMode(ownerInstance, instanceId);
  const isReverse = isReverseMode(ownerInstance, instanceId);
  const enableTouch = isEnableTouch(ownerInstance, instanceId);
  const ost = getOst(ownerInstance, instanceId);
  const hideThumb = isHideThumb(ownerInstance, instanceId);
  const enableTouchBar = isEnableTouchBar(ownerInstance, instanceId);
  // track mouse mouve only when toggle true
  if (ost.isMoving) {
    const ost_slider = queryComponent(ownerInstance, instanceId);
    const rect = ost_slider.getBoundingClientRect();
    const currentX = isVertical
      ? event.touches[0].clientY - rect.top
      : event.touches[0].clientX - rect.left;
    let moveX =
      currentX -
      ost.currentThumbPositionX -
      (isVertical
        ? ost.slider.getBoundingClientRect().top
        : ost.slider.getBoundingClientRect().left);

    if (!enableTouch) {
      moveX =
        currentX -
        (isVertical
          ? ost.slider.getBoundingClientRect().top
          : ost.slider.getBoundingClientRect().left);
    }
    let moveValue = convertPixelsToValue(
      ownerInstance,
      instanceId,
      moveX,
      getStep(ownerInstance, instanceId)
    );
    // lock the thumb within the bounaries
    moveValue = setBoundries(ownerInstance, instanceId, moveValue);
    moveX = convertValueToPixels(ownerInstance, instanceId, moveValue);

    const props = getProps(ownerInstance, instanceId);

    let outValue = null;
    switch (ost.currentThumbName) {
      case 'start':
        const _endValueInPixels = ost._endValueInPixels;
        // if (moveX > _endValueInPixels) return false;
        if (props.startmin && moveValue < props.startmin) return false;
        if (props.startmax && moveValue > props.startmax) return false;
        setOstValue(ownerInstance, instanceId, '_startValueInPixels', moveX);
        setOstValue(ownerInstance, instanceId, '_start', moveValue);
        outValue = onChange(ownerInstance, instanceId, 'start');
        break;
      case 'end':
        const _startValueInPixels = ost._startValueInPixels;
        // if (moveX < _startValueInPixels) return false;
        if (props.endmin && moveValue < props.endmin) return false;
        if (props.endmax && moveValue > props.endmax) return false;
        setOstValue(ownerInstance, instanceId, '_endValueInPixels', moveX);
        setOstValue(ownerInstance, instanceId, '_end', moveValue);
        outValue = onChange(ownerInstance, instanceId, 'end');
        break;
    }
    const _ost_ = getOst(ownerInstance, instanceId);
    setThumb(ownerInstance, instanceId, _ost_.currentThumbName, moveX, null, outValue);
    setRange(ownerInstance, instanceId, _ost_._endValueInPixels, _ost_._startValueInPixels);
  } else if (hideThumb || enableTouchBar) {
    // hideThumb mode
    const currentX = isVertical
      ? event.touches[0].clientY - ost.slider.getBoundingClientRect().top
      : event.touches[0].clientX;

    const delta = currentX - ost.trackStartX;
    const nextX = ost.trackCurrentX + delta;

    const trackNextX = nextX;
    setOstValue(ownerInstance, instanceId, 'trackNextX', trackNextX);
    if (trackNextX < 0) {
      setOstValue(ownerInstance, instanceId, 'trackNextX', 0);
    }
    if (trackNextX > ost.trackWidth) {
      setOstValue(ownerInstance, instanceId, 'trackNextX', ost.trackWidth);
    }

    let moveX = ost.trackNextX;

    let moveValue = convertPixelsToValue(
      ownerInstance,
      instanceId,
      moveX,
      getStep(ownerInstance, instanceId)
    );
    // lock the thumb within the bounaries
    moveValue = setBoundries(ownerInstance, instanceId, moveValue);

    const props = getProps(ownerInstance, instanceId);
    switch (ost.currentThumbName) {
      case 'start':
        const _endValueInPixels = ost._endValueInPixels;
        // if (moveX > _endValueInPixels) return false;
        if (props.startmin && moveValue < props.startmin) return false;
        if (props.startmax && moveValue > props.startmax) return false;
        break;
      case 'end':
        const _startValueInPixels = ost._startValueInPixels;
        // if (moveX < _startValueInPixels) return false;
        if (props.endmin && moveValue < props.endmin) return false;
        if (props.endmax && moveValue > props.endmax) return false;
        break;
    }

    setOstValue(ownerInstance, instanceId, '_start', 0);
    setOstValue(ownerInstance, instanceId, '_end', moveValue);

    moveX = convertValueToPixels(ownerInstance, instanceId, moveValue);

    const outValue = onChange(ownerInstance, instanceId, 'end');
    setThumb(ownerInstance, instanceId, ost.currentThumbName, moveX, null, outValue);
    setRange(ownerInstance, instanceId, 0, moveX);

    return false;
  }
};

const onChange = (ownerInstance, instanceId, position, skipDiff = false) => {
  const ost = getOst(ownerInstance, instanceId);
  const isRerverse = isReverseMode(ownerInstance, instanceId);
  const reverseRange = isRerverse
    ? getMax(ownerInstance, instanceId) - getRangeValue(ownerInstance, instanceId)
    : 0;

  const nextStart = getStart(ownerInstance, instanceId);
  const nextEnd = isRerverse ? reverseRange : getEnd(ownerInstance, instanceId);
  const nextRange = isRerverse ? reverseRange : getRangeValue(ownerInstance, instanceId);

  if (skipDiff) {
    // noop
  } else {
    // 如果start、end、range 都没变
    if (
      nextStart === ost._last_start &&
      nextEnd === ost._last_end &&
      nextRange === ost._last_range
    ) {
      return;
    }
  }

  const out = convertValueToOutValue(ownerInstance, instanceId, nextEnd);
  setText(ownerInstance, instanceId, out);

  setOstValue(ownerInstance, instanceId, '_last_start', nextStart);
  setOstValue(ownerInstance, instanceId, '_last_end', nextEnd);
  setOstValue(ownerInstance, instanceId, '_last_range', nextRange);

  // publish
  ownerInstance.triggerEvent('move', {
    instanceId,
    end: out,
    value: out,
    from: nextEnd > ost._last_end && nextEnd !== ost._last_end ? 'left' : 'right',
  });

  return out;
};

const onEnd = (event, ownerInstance, instanceId) => {
  const isRerverse = isReverseMode(ownerInstance, instanceId);
  const reverseRange = isRerverse
    ? getMax(ownerInstance, instanceId) - getRangeValue(ownerInstance, instanceId)
    : 0;

  const nextEnd = isRerverse ? reverseRange : getEnd(ownerInstance, instanceId);

  const out = convertValueToOutValue(ownerInstance, instanceId, nextEnd);
  setText(ownerInstance, instanceId, out);

  setOstValue(ownerInstance, instanceId, '_last_start', null);
  setOstValue(ownerInstance, instanceId, '_last_end', null);
  setOstValue(ownerInstance, instanceId, '_last_range', null);

  const ost = getOst(ownerInstance, instanceId);

  // publish
  ownerInstance.triggerEvent('end', {
    instanceId,
    end: out,
    value: out,
    from: nextEnd > ost._last_end && nextEnd !== ost._last_end ? 'left' : 'right',
  });
};
const onStart = (event, ownerInstance, instanceId) => {
  const nextEnd = getEnd(ownerInstance, instanceId);

  const out = convertValueToOutValue(ownerInstance, instanceId, nextEnd);
  setText(ownerInstance, instanceId, out);

  setOstValue(ownerInstance, instanceId, '__start_val', out);
  setOstValue(ownerInstance, instanceId, '__change__', false);

  // publish
  ownerInstance.triggerEvent('start', {
    instanceId,
    end: out,
    value: out,
  });
};

const onMouseUp = instanceId => (event, ownerInstance) => {
  setOstValue(ownerInstance, instanceId, 'isMoving', false);
  toggleActiveThumb(ownerInstance, instanceId, false);
  onEnd(event, ownerInstance, instanceId);

  updateThumbZIndex(ownerInstance, instanceId);

  return false;
};

const onTrackMouseUp = instanceId => (event, ownerInstance) => {
  const ost = getOst(ownerInstance, instanceId);
  setOstValue(
    ownerInstance,
    instanceId,
    'trackCurrentX',
    ost.trackNextX === undefined ? ost.trackCurrentX : ost.trackNextX
  );
  onEnd(event, ownerInstance, instanceId);
  setOstValue(ownerInstance, instanceId, 'isMoving', false);

  updateThumbZIndex(ownerInstance, instanceId);
};

module.exports = {
  startPropObserver: createPropObserver('start'),
  endPropObserver: createPropObserver('end'),
  watchstartPropObserver: createPropObserver('watchstart'),
  watchenddPropObserver: createPropObserver('watchend'),
  updateObserver,
  handleMouseDown,
  onMouseMove,
  onMouseUp,
  onTrackMouseUp,
  handleTrackMouseDown,
};
