// props
const THUMBS = ['start', 'end'];

function dispatchChannel(ownerInstance, eventName, data) {
  if (ownerInstance && typeof ownerInstance.eventChannel !== 'undefined' && eventName && data) {
    ownerInstance.eventChannel.emit(eventName, data);
  }
}

function rgb2hsv(r = 0, g = 0, b = 0) {
  r = parseFloat(r);
  g = parseFloat(g);
  b = parseFloat(b);
  if (r < 0) r = 0;
  if (g < 0) g = 0;
  if (b < 0) b = 0;
  if (r > 255) r = 255;
  if (g > 255) g = 255;
  if (b > 255) b = 255;
  r /= 255;
  g /= 255;
  b /= 255;
  const M = Math.max(r, g, b);
  const m = Math.min(r, g, b);
  const C = M - m;
  let h;
  let s;
  let v;
  if (C == 0) h = 0;
  else if (M == r) h = ((g - b) / C) % 6;
  else if (M == g) h = (b - r) / C + 2;
  else h = (r - g) / C + 4;
  h *= 60;
  if (h < 0) h += 360;
  v = M;
  if (C == 0) s = 0;
  else s = C / v;
  s *= 100;
  v *= 100;
  return [h, s, v];
}

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

      const min = getProps(ownerInstance, instanceId).minorigin || 0;
      const max = getProps(ownerInstance, instanceId).max || 0;
      const eventData = {
        instanceId,
        end: end + min,
        value: end + min,
        min,
        max,
      };
      dispatchChannel(ownerInstance, getMoveEventName(ownerInstance, instanceId), eventData);

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
const updateObserver = (instanceId, isDepsChange, direction) =>
  function (newValue, oldValue, ownerInstance) {
    if (direction === 'vertical') return;
    updateSlider(ownerInstance, instanceId, isDepsChange);
  };

const getMin = (ownerInstance, instanceId) => {
  return getNumber(getProps(ownerInstance, instanceId).min, 0);
};

const getStartEventName = (ownerInstance, instanceId) => {
  return getProps(ownerInstance, instanceId).starteventname;
};
const getMoveEventName = (ownerInstance, instanceId) => {
  return getProps(ownerInstance, instanceId).moveeventname;
};
const getEndEventName = (ownerInstance, instanceId) => {
  return getProps(ownerInstance, instanceId).endeventname;
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

function calculateCoefficients(x1, y1, x2, y2) {
  // 计算线性方程的系数a和b
  let a = (y2 - y1) / (x2 - x1);
  let b = y1 - a * x1;
  return { a, b };
}

function transform(x, min1, max1, min2, max2) {
  const { a, b } = calculateCoefficients(min1, min2, max1, max2);
  // 使用计算出的a和b进行转换
  return a * x + b;
}

const getStepLen = (ownerInstance, instanceId) => {
  const step = getStep(ownerInstance, instanceId);
  // 获取小数点位数
  const stepStr = step.toString();
  const stepLen = stepStr.indexOf('.') === -1 ? 0 : stepStr.length - stepStr.indexOf('.') - 1;
  return stepLen;
};

const convertValueToOutValue = (ownerInstance, instanceId, value, useVal = false) => {
  const valueMin = getValueMin(ownerInstance, instanceId);
  const stepLen = getStepLen(ownerInstance, instanceId);

  const max = getMax(ownerInstance, instanceId);
  const ost = getOst(ownerInstance, instanceId);
  const isReverse = isReverseMode(ownerInstance, instanceId);

  const val = useVal ? value : ost._endValueInPixels;

  if (isReverse) {
    const result = transform(val, 0, ost.maxRange, max, valueMin);
    return +Number(result).toFixed(stepLen);
  } else {
    const result = transform(val, 0, ost.maxRange, valueMin, max);
    return +Number(result).toFixed(stepLen);
  }
};

const convertOutValueToValue = (ownerInstance, instanceId, outValue) => {
  const valueMin = getValueMin(ownerInstance, instanceId);
  if (valueMin) {
    const max = getMax(ownerInstance, instanceId);
    const ost = getOst(ownerInstance, instanceId);
    const isReverse = isReverseMode(ownerInstance, instanceId);
    let px = 0;
    if (isReverse) {
      px = transform(outValue, valueMin, max, ost.maxRange, 0);
    } else {
      px = transform(outValue, valueMin, max, 0, ost.maxRange);
    }
    const step = getStep(ownerInstance, instanceId);

    const val = convertPixelsToValue(ownerInstance, instanceId, px, step);
    return val;
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

const getTrackBackgroundColorHueEventNameEnableItems = (ownerInstance, instanceId) => {
  return getProps(ownerInstance, instanceId).trackbackgroundcolorhueeventnameenableitems;
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
  if (isParcel(ownerInstance, instanceId)) {
    return true;
  }
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

const getIsInferColor = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.inferthumbbgcolorfromtrackbgcolor;
};

const getTrackBgColor = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return props.trackbgcolor;
};

const getTrackBackgroundColorHueEventNameTemplate = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return props.trackbackgroundcolorhueeventnametemplate;
};

const isReverseMode = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.reverse && !isRangeMode(ownerInstance, instanceId);
};

const isParcel = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.parcel;
};

const getParcelMargin = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return getNumber(props.parcelmargin, 0);
};

const isUseParcelPadding = (ownerInstance, instanceId) => {
  const props = getProps(ownerInstance, instanceId);
  return !!props.useparcelpadding;
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
  const thumbEnd = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-end');
  const thumbEndWidth = thumbEnd.getBoundingClientRect()[type];
  if (thumbEndWidth) {
    return thumbEndWidth;
  }
};

function setStepsStyle(ownerInstance, instanceId, isVertical) {
  const dot = queryComponent(ownerInstance, instanceId, '.rayui-slider-steps-dot');
  const stepsList = queryComponentAll(ownerInstance, instanceId, '.rayui-slider-steps');

  const thumbWidth = getThumbWidth(ownerInstance, instanceId);

  let dotWidth = 0;
  if (dot) {
    dotWidth = dot.getBoundingClientRect()[isVertical ? 'height' : 'width'];
  }

  stepsList.forEach(steps => {
    if (steps) {
      const padding = isVertical
        ? `${thumbWidth / 2 - dotWidth / 2}px 0`
        : `0 ${thumbWidth / 2 - dotWidth / 2}px`;
      steps.setStyle({
        padding,
      });
    }
  });

  ownerInstance.callMethod('initStepsPadding', {});
}

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

const setTrackBgColor = (ownerInstance, instanceId, background) => {
  const track = queryComponent(ownerInstance, instanceId);
  if (track) {
    track.setStyle({
      background,
    });
  }
};
const setBarBgColor = (ownerInstance, instanceId, background) => {
  const trackbackgroundcolorrendermode = getProps(
    ownerInstance,
    instanceId
  ).trackbackgroundcolorrendermode;
  const isTrack = trackbackgroundcolorrendermode === 'track';

  const bar = queryComponent(
    ownerInstance,
    instanceId,
    isTrack ? '.rayui-slider-bar-bg' : '.rayui-slider-bar'
  );
  if (bar) {
    bar.setStyle({
      background,
    });
  }
};

const setBarBgWidth = (ownerInstance, instanceId, background) => {
  const trackbackgroundcolorrendermode = getProps(
    ownerInstance,
    instanceId
  ).trackbackgroundcolorrendermode;
  const isTrack = trackbackgroundcolorrendermode === 'track';
  if (!isTrack) return;

  const bar = queryComponent(ownerInstance, instanceId, '.rayui-slider-bar-bg');
  const ost = getOst(ownerInstance, instanceId);

  const isVertical = isVerticalMode(ownerInstance, instanceId);

  if (bar && ost.trackWidth) {
    bar.setStyle({
      [isVertical ? 'height' : 'width']: `${ost.trackWidth}px`,
    });
  }
};

const setThumbBgColor = (ownerInstance, instanceId, hue, end) => {
  const max = getMax(ownerInstance, instanceId);
  const min = getMin(ownerInstance, instanceId);

  const formatterScale = getFormatterScale(ownerInstance, instanceId) || 1;
  const formatterStart = getFormatterStart(ownerInstance, instanceId) || 0;
  const formatterReverse = isFormatterValueReverse(ownerInstance, instanceId);
  if (formatterReverse) {
    end = max + min - end;
  }

  const satVal = parseInt(end * formatterScale + formatterStart);
  const thumb = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-end-render');
  if (thumb) {
    thumb.setStyle({
      background: `hsl(${hue}deg 100% ${satVal}%)`,
    });
  }
  setOstValue(ownerInstance, instanceId, 'hueValue', hue);
};

const map = {};
const listenSingle = (ownerInstance, eventName, cb) => {
  if (eventName && cb) {
    if (map[eventName]) return;

    if (ownerInstance && ownerInstance.eventChannel) {
      ownerInstance.eventChannel.on(eventName, cb);
      map[eventName] = true;
    }
  }
};

const readyMap = {};

const initRects = (ownerInstance, instanceId) => {
  const ost_slider = queryComponent(ownerInstance, instanceId);
  setOstValue(ownerInstance, instanceId, 'slider', ost_slider);

  const ost_sliderRange = queryComponent(ownerInstance, instanceId, '.rayui-slider-bar');
  setOstValue(ownerInstance, instanceId, 'sliderRange', ost_sliderRange);

  const isVertical = isVerticalMode(ownerInstance, instanceId);

  const thumbWidth = isVertical
    ? getThumbWidth(ownerInstance, instanceId, 'height')
    : getThumbWidth(ownerInstance, instanceId, 'width');
  const hideThumb = isHideThumb(ownerInstance, instanceId);

  const ost_thumbWidth = hideThumb ? 0 : thumbWidth;
  setOstValue(ownerInstance, instanceId, 'thumbWidth', ost_thumbWidth);

  let ost_maxRange =
    (isVertical
      ? ost_slider.getBoundingClientRect().height
      : ost_slider.getBoundingClientRect().width) - ost_thumbWidth;

  const props = getProps(ownerInstance, instanceId);
  ost_maxRange += getNumber(props.maxrangeoffset, 0);
  const isParcelSlider = isParcel(ownerInstance, instanceId);
  const parcelMargin = getParcelMargin(ownerInstance, instanceId);

  if (isParcelSlider) {
    ost_maxRange -= parcelMargin * 3;
  }

  setOstValue(ownerInstance, instanceId, 'maxRange', ost_maxRange);
};

function updateSlider(ownerInstance, instanceId, isDepsChange = false) {
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

    listenSingle(ownerInstance, `slider-${instanceId}-steps-init`, () => {
      setStepsStyle(ownerInstance, instanceId, isVertical);
    });
    const trackBackgroundColorHueEventName = getProps(
      ownerInstance,
      instanceId
    ).trackbackgroundcolorhueeventname;
    if (trackBackgroundColorHueEventName) {
      const enableItems = getTrackBackgroundColorHueEventNameEnableItems(ownerInstance, instanceId);

      listenSingle(ownerInstance, trackBackgroundColorHueEventName, res => {
        let hue = res.value;
        let sat = res.sat;
        if (res.rgba) {
          const hsv = rgb2hsv(res.rgba[0], res.rgba[1], res.rgba[2]);
          hue = hsv[0];
          sat = hsv[1];
        }

        const template =
          getTrackBackgroundColorHueEventNameTemplate(ownerInstance, instanceId) ||
          'linear-gradient(to right, #ffffff 0%, hsl($huedeg $sat% 50%) 100%)';

        const finalColor = template.replace('$hue', hue).replace('$sat', Math.floor(sat));

        if (/track/.test(enableItems)) {
          setTrackBgColor(ownerInstance, instanceId, finalColor);
        }
        if (/bar/.test(enableItems)) {
          setBarBgColor(ownerInstance, instanceId, finalColor);
        }

        if (/thumb/.test(enableItems)) {
          setThumbBgColor(ownerInstance, instanceId, hue, getEnd(ownerInstance, instanceId));
        }
      });
    }

    const thumbWidth = isVertical
      ? getThumbWidth(ownerInstance, instanceId, 'height')
      : getThumbWidth(ownerInstance, instanceId, 'width');

    const ost_thumbWidth = hideThumb ? 0 : thumbWidth;
    setOstValue(ownerInstance, instanceId, 'thumbWidth', ost_thumbWidth);

    const props = getProps(ownerInstance, instanceId);

    const isParcelSlider = isParcel(ownerInstance, instanceId);
    const parcelMargin = getParcelMargin(ownerInstance, instanceId);

    let ost_maxRange =
      (isVertical
        ? ost_slider.getBoundingClientRect().height
        : ost_slider.getBoundingClientRect().width) - ost_thumbWidth;

    ost_maxRange += getNumber(props.maxrangeoffset, 0);

    if (isParcelSlider) {
      ost_maxRange -= parcelMargin * 3;
    }

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

    const render_opacity = readyMap[instanceId] === '1' ? '1' : Number.isNaN(endValue) ? '0' : '1';

    if (isDepsChange) {
      // 首次有值的时候标记为1，同时设置透明度1
      if (!Number.isNaN(endValue)) {
        readyMap[instanceId] = '1';
      }
    }

    setThumb(
      ownerInstance,
      instanceId,
      'end',
      endValue,
      {
        display: hideThumb ? 'none' : 'block', // 单向隐藏左按钮
        opacity: render_opacity,
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
      isRerverse
        ? convertValueToPixels(ownerInstance, instanceId, reverseRange)
        : _endValueInPixels,
      {
        opacity: render_opacity,
      }
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
    setBarBgWidth(ownerInstance, instanceId);
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
    (value /
      (getMax(ownerInstance, instanceId) -
        getValueMin(ownerInstance, instanceId) -
        getMin(ownerInstance, instanceId))) *
      ost.maxRange
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
        (getMax(ownerInstance, instanceId) -
          getValueMin(ownerInstance, instanceId) -
          getMin(ownerInstance, instanceId))
    )
  );

  // round to step value
  _value = step > 0 ? Math.round(_value / step) * step : _value;
  return parseFloat(_value.toFixed(2));
}

function parseGradient(gradient, position) {
  const gradientRegex = /linear-gradient\(to [a-z]+, (.+?)\)/;
  const match = gradient.match(gradientRegex);
  if (!match) return '';

  const colorStops = match[1].split(',').map(stop => {
    const [color, percentage] = stop.trim().split(/\s+/);
    return {
      color,
      position: parseFloat(percentage),
    };
  });

  // 找到两点之间的颜色
  for (let i = 0; i < colorStops.length - 1; i++) {
    const start = colorStops[i];
    const end = colorStops[i + 1];
    if (position >= start.position && position <= end.position) {
      const ratio = (position - start.position) / (end.position - start.position);
      return interpolateColor(start.color, end.color, ratio);
    }
  }

  return colorStops[colorStops.length - 1].color; // 最后一个颜色
}

// 颜色插值计算
function interpolateColor(color1, color2, ratio) {
  const hexToRgb = hex => hex.match(/\w\w/g).map(x => parseInt(x, 16));
  const rgbToHex = rgb => `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const resultRgb = rgb1.map((c1, i) => Math.round(c1 + ratio * (rgb2[i] - c1)));
  return rgbToHex(resultRgb);
}

function getThumbColor(gradient, value, minValue = 0, maxValue = 1000) {
  const normalizedValue = (value - minValue) / (maxValue - minValue); // 将 value 归一化到 0-1 范围
  const gradientPosition = normalizedValue * 100; // 对应的百分比位置
  return parseGradient(gradient, gradientPosition);
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
  const isInferColor = getIsInferColor(ownerInstance, instanceId);
  const trackBackgroundColorHueEventName = getProps(
    ownerInstance,
    instanceId
  ).trackbackgroundcolorhueeventname;

  let thumbColor = undefined;
  if (isInferColor) {
    if (outValue !== undefined) {
      const gradient = getTrackBgColor(ownerInstance, instanceId);
      if (/linear-gradient/.test(gradient)) {
        thumbColor = getThumbColor(
          gradient,
          outValue,
          getMax(ownerInstance, instanceId),
          getValueMin(ownerInstance, instanceId)
        );
      } else {
        console.log(
          `[slider] inferThumbBgColorFromTrackBgColor fail, maxTrackColor must be linear-gradient`
        );
      }
    }
  }

  const hsvStyle = {};
  if (thumbColor && isInferColor) {
    hsvStyle.backgroundColor = thumbColor;
  }
  if (formatterTpl && isNotNullOrUndefined(outValue)) {
    for (const attr in formatterTpl) {
      if (formatterTpl[attr]) {
        let calcValue = outValue;
        if (formatterReverse) {
          const reverseRange =
            getMax(ownerInstance, instanceId) - getRangeValue(ownerInstance, instanceId);
          const nextEnd = convertValueToPixels(ownerInstance, instanceId, reverseRange);
          const out = convertValueToOutValue(ownerInstance, instanceId, nextEnd, true);
          calcValue = out;
        }
        if (attr === 'background' && trackBackgroundColorHueEventName) {
          const tpl = formatterTpl[attr];
          const hueValue = getOst(ownerInstance, instanceId).hueValue;
          const [str1, str2, str3] = tpl.split(' ');
          formatterTpl[attr] = `hsl(${hueValue}deg ${str2} ${str3}`;
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

function setRange(ownerInstance, instanceId, start, end, cusStyle) {
  const ost = getOst(ownerInstance, instanceId);
  const isVertical = isVerticalMode(ownerInstance, instanceId);
  const isReverse = isReverseMode(ownerInstance, instanceId);
  const hideThumbButton = isHideThumbButton(ownerInstance, instanceId);

  const parcelThumb = queryComponent(ownerInstance, instanceId, '.rayui-slider-thumb-parcel');
  const isParcelSlider = isParcel(ownerInstance, instanceId);
  const parcelMargin = getParcelMargin(ownerInstance, instanceId);

  if (isParcelSlider) {
    if (parcelThumb) {
      const style = {
        [isVertical
          ? isReverse
            ? 'top'
            : 'bottom'
          : isReverse
          ? 'left'
          : 'right']: `${parcelMargin}px`,
        [isVertical ? 'left' : 'top']: '50%',
        transform: isVertical ? 'translateX(-50%)' : 'translateY(-50%)',
      };
      parcelThumb.setStyle(style);
    }
  }

  const maxThumb = Math.max(start, end);
  const minThumb = Math.min(start, end);
  const width = Math.abs(maxThumb - minThumb);
  const thumbWidth = ost.thumbWidth;

  let rangeWidth = hideThumbButton
    ? width + (isParcelSlider ? thumbWidth + parcelMargin : thumbWidth)
    : width + thumbWidth / 2;
  if (isReverse) {
    rangeWidth = ost.trackWidth - rangeWidth + (hideThumbButton ? thumbWidth : 0);
  }

  let bottom = minThumb;
  let height = rangeWidth;

  const useParcelPadding = isUseParcelPadding(ownerInstance, instanceId);

  if (isParcelSlider && isVertical && isReverse && !useParcelPadding) {
    bottom = `-${parcelMargin}px`;
    height = rangeWidth + parcelMargin;
  }

  const marginKey = isVertical
    ? isReverse
      ? 'marginBottom'
      : 'marginTop'
    : isReverse
    ? 'marginRight'
    : 'marginLeft';

  ost.sliderRange.setStyle({
    [isVertical ? (isReverse ? 'bottom' : 'top') : isReverse ? 'right' : 'left']: `${bottom}px`,
    [isVertical ? 'height' : 'width']: `${height}px`,
    opacity: 1,
    display: 'block',
    [marginKey]: marginKey === 'marginBottom' ? 0 : isParcelSlider ? `${parcelMargin}px` : 0,
    ...(cusStyle || {}),
  });
}

function setBoundries(ownerInstance, instanceId, value) {
  const isReverse = isReverseMode(ownerInstance, instanceId);
  let _value = typeof value === 'number' ? value : parseFloat(value);

  _value = _value < 0 ? 0 : value; // MIN

  const max = getMax(ownerInstance, instanceId) - getValueMin(ownerInstance, instanceId);

  return _value > max ? max : _value; // MAX
}

const handleMouseDown = instanceId => (event, ownerInstance) => {
  initRects(ownerInstance, instanceId);

  const target = event.instance;
  const thumbId = target.getDataset().name;
  const isVertical = isVerticalMode(ownerInstance, instanceId);
  onStart(event, ownerInstance, instanceId);

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
      setOstValue(ownerInstance, instanceId, '_endValueInPixels', moveX);

      const outValue = onChange(ownerInstance, instanceId, 'end');
      setThumb(ownerInstance, instanceId, 'end', moveX, null, outValue);
      setRange(ownerInstance, instanceId, 0, moveX);
      setOstValue(ownerInstance, instanceId, 'isMoving', true);

      const currentThumbPositionX =
        startX -
        (isVertical ? thumbEnd.getBoundingClientRect().top : thumbEnd.getBoundingClientRect().left);
      setOstValue(ownerInstance, instanceId, 'currentThumbPositionX', currentThumbPositionX);

      const _endValueInPixels = convertValueToPixels(
        ownerInstance,
        instanceId,
        getEnd(ownerInstance, instanceId)
      );

      setOstValue(ownerInstance, instanceId, '_endValueInPixels', _endValueInPixels);
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
    setOstValue(ownerInstance, instanceId, '_endValueInPixels', moveX);

    setThumb(ownerInstance, instanceId, ost.currentThumbName, moveX, null, outValue);
    setRange(ownerInstance, instanceId, 0, moveX);
    const outValue = onChange(ownerInstance, instanceId, 'end');

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

  const min = getProps(ownerInstance, instanceId).minorigin || 0;
  const max = getProps(ownerInstance, instanceId).max || 0;
  const eventData = {
    instanceId,
    end: out + min,
    value: out + min,
    min,
    max,
  };

  // publish
  ownerInstance.triggerEvent('move', eventData);
  dispatchChannel(ownerInstance, getMoveEventName(ownerInstance, instanceId), eventData);

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

  const min = getProps(ownerInstance, instanceId).minorigin || 0;
  const max = getProps(ownerInstance, instanceId).max || 0;

  const eventData = {
    instanceId,
    end: out,
    value: out,
    min,
    max,
  };

  // publish
  ownerInstance.triggerEvent('end', eventData);
  dispatchChannel(ownerInstance, getEndEventName(ownerInstance, instanceId), eventData);
};
const onStart = (event, ownerInstance, instanceId) => {
  const nextEnd = getEnd(ownerInstance, instanceId);

  const out = convertValueToOutValue(ownerInstance, instanceId, nextEnd);
  setText(ownerInstance, instanceId, out);

  setOstValue(ownerInstance, instanceId, '__start_val', out);
  setOstValue(ownerInstance, instanceId, '__change__', false);

  const min = getProps(ownerInstance, instanceId).minorigin || 0;
  const max = getProps(ownerInstance, instanceId).max || 0;

  const eventData = {
    instanceId,
    end: out,
    value: out,
    min,
    max,
  };
  // publish
  ownerInstance.triggerEvent('start', eventData);
  dispatchChannel(ownerInstance, getStartEventName(ownerInstance, instanceId), eventData);
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
