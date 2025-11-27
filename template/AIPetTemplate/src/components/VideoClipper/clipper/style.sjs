const utils = require('./utils.sjs');

function kebabCase(word) {
  var newWord = word
    .replace(getRegExp('[A-Z]', 'g'), function (i) {
      return '-' + i;
    })
    .toLowerCase();

  return newWord;
}

function style(styles) {
  if (Array.isArray(styles)) {
    return styles
      .filter(function (item) {
        return item != null && item !== '';
      })
      .map(function (item) {
        return style(item);
      })
      .join(';');
  }

  if ('Object' === styles.constructor) {
    return Object.keys(styles)
      .filter(function (key) {
        return styles[key] != null && styles[key] !== '';
      })
      .map(function (key) {
        return [kebabCase(key), [styles[key]]].join(':');
      })
      .join(';');
  }

  return styles;
}

const trackStyle = data => {
  const totalThumbnails = Math.ceil(data.duration / data.clipMaxTime) * data.thumbnailCount;
  const totalTrackWidth = totalThumbnails * data.thumbnailWidth;
  return style([
    {
      width: totalTrackWidth + 'rpx',
    },
  ]);
};

const formatStartTimeText = data => {
  const { clipStartTime, clipMovedTime } = data;
  // 由于从 chooseMedia TTT API 返回的时间都是抛弃小数点向下取整的，所以小程序这里也要统一，避免出现时间展示不一致的情况
  const startTime = Math.floor(clipStartTime + clipMovedTime);
  return utils.parseSecond(startTime).slice(-2).join(':');
};

const formatEndTimeText = data => {
  const { totalPages, duration, clipEndTime, clipMovedTime } = data;
  // 由于从 chooseMedia TTT API 返回的时间都是抛弃小数点向下取整的，所以小程序这里也要统一，避免出现时间展示不一致的情况
  const endTime =
    totalPages === 1
      ? Math.floor(Math.min(duration, clipEndTime))
      : Math.floor(clipEndTime + clipMovedTime);
  return utils.parseSecond(endTime).slice(-2).join(':');
};

module.exports = {
  trackStyle,
  formatStartTimeText,
  formatEndTimeText,
};
