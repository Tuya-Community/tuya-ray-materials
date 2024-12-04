import copyProperties from './common/copyProperties';
import EventTarget from './common/EventTarget';

export default function (callback?: Function) {
  Object.assign(document, {
    defaultView: {
      // @ts-ignore
      getComputedStyle: getComputedStyle.bind(this),
    },
  });
  copyProperties(document.constructor.prototype, EventTarget.prototype);
  if (callback && typeof callback === 'function') {
    callback(document);
  }
}
