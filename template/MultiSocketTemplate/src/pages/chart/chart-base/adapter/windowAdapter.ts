import copyProperties from './common/copyProperties';
import EventTarget from './common/EventTarget';

export default function (callback?: Function) {
  Object.assign(window, {
    AudioContext: function () {},
    URL: {},
  });
  copyProperties(window.constructor.prototype, EventTarget.prototype);
  if (callback && typeof callback === 'function') {
    callback(window);
  }
}
