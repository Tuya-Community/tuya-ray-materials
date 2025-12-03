import Strings from '@/i18n';

let preTime = 0;
let isLoading = false;
const timerOffset = 600000; // 10分钟超时
let timer = null;

const globalShowLoading = (text?: string, isMask = true) => {
  preTime = Date.now();
  isLoading = true;
  ty.showLoading({
    title: text || '',
    mask: isMask,
  });
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (!isLoading) {
      return;
    }
    // ty.showToast({
    //   title: Strings.getLang('requestTimedOut'),
    //   icon: 'none',
    // });
    // globalHideLoading();
    console.error('loading 时间超时', timerOffset);
  }, timerOffset);
};

const globalHideLoading = () => {
  // console.warn('globalHideLoading');
  isLoading = false;
  if (timer) {
    clearTimeout(timer);
  }
  ty.hideLoading();
};

export const globalLoading = {
  show: globalShowLoading,
  hide: globalHideLoading,
};

export const showSuccessToast = (text?: string) => {
  ty.showToast({
    title: text || Strings.getLang('executionSuccessful'),
    icon: 'none',
  });
};

export const showFailToast = (text?: string) => {
  ty.showToast({
    title: text || Strings.getLang('executionFailed'),
    icon: 'none',
  });
};

export const globalToast = {
  success: showSuccessToast,
  fail: showFailToast,
};
