/*
 * @Author: hkc
 * @Date: 2025-09-25 19:54:33
 * @LastEditors: hkc
 * @LastEditTime: 2025-11-10 19:09:23
 * @Description:
 */
import Strings from '@/i18n';
import { showToast } from '@ray-js/ray';
import throttle from 'lodash/throttle';

// AI基座错误码
const AI_BASE_ERROR_CODE = [39001, 39002, 39003, 39004, 39009, 39010, 39012];

// 创建节流的toast显示函数，防止连续弹出多个toast
const throttledShowToast = throttle(
  (errText: string) => {
    showToast({ title: errText, icon: 'error' });
  },
  3000,
  { leading: true, trailing: false }
);

// 统一处理ttt错误码
export const handleTttError = (error, isEvent = false) => {
  // const e = typeof error === 'string' ? JsonUtil.parseJSON(error) : error;
  const errorCode = error?.innerError?.errorCode || error?.errorCode || error?.code;
  if (errorCode <= 0) {
    return true;
  }

  const errMsg = error?.innerError?.errorMsg || error?.errorMessage || error?.message;
  let errText = '';
  if (AI_BASE_ERROR_CODE.includes(errorCode)) {
    errText = Strings.getLang('ai_base_error');
  } else {
    // 是否存在code（可以用[]判断是否存在多语言code,但是取值必须用getLang，否则只会取本地的多语言）
    const hasCode = !!Strings[errorCode];
    if (hasCode) {
      errText = Strings.getLang(errorCode);
    } else if (!isEvent) {
      // 事件类型不使用errMsg兜底
      errText = errMsg;
    }
  }

  if (errText) {
    throttledShowToast(errText);
    return false;
  }
  return true;
};
