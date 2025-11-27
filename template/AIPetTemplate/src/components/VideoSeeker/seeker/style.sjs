const utils = require('./utils.sjs');

const formatStartTimeText = data => {
  const { duration } = data;
  // 由于从 chooseMedia TTT API 返回的时间都是抛弃小数点向下取整的，所以小程序这里也要统一，避免出现时间展示不一致的情况
  const durationArr = utils.parseSecond(duration);
  const isExceed1Hour = +durationArr[0] > 0;
  return isExceed1Hour ? '00:00:00' : '00:00';
};

const formatEndTimeText = data => {
  const { duration } = data;
  // 由于从 chooseMedia TTT API 返回的时间都是抛弃小数点向下取整的，所以小程序这里也要统一，避免出现时间展示不一致的情况
  const durationArr = utils.parseSecond(duration);
  const isExceed1Hour = +durationArr[0] > 0;
  return isExceed1Hour ? durationArr.join(':') : durationArr.slice(-2).join(':');
};

module.exports = {
  formatStartTimeText,
  formatEndTimeText,
};
