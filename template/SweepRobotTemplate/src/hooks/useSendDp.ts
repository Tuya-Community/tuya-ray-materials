import { getDpIdByCode } from '@/utils';
import { useActions } from '@ray-js/panel-sdk';
import { isUndefined } from 'lodash-es';
import { useRef } from 'react';

const useSendDp = (successCallBack?: () => void, failCallBack?: () => void) => {
  const actions = useActions();
  const timerRef = useRef<NodeJS.Timeout>();

  const sendDP = (dpCode: string, value: string | boolean, isCustomListening?: boolean) => {
    ty.showLoading({ title: '' });
    actions[dpCode].set(value);
    if (!isCustomListening) {
      ty.device.onDpDataChange(res => {
        const { dps } = res;
        if (!isUndefined(dps[getDpIdByCode(dpCode)])) {
          ty.hideLoading();
          successCallBack && successCallBack();
          ty.device.offDpDataChange(() => {
            console.log('offDpDataChange');
          });
        }
      });
    }

    timerRef.current = setTimeout(() => {
      ty.hideLoading();
      failCallBack && failCallBack();
      ty.device.offDpDataChange(() => {
        console.log('offDpDataChange');
      });
    }, 20000);
  };

  const getTimer = () => {
    return timerRef.current;
  };

  const clearTimer = () => {
    clearTimeout(timerRef.current);
  };

  return { sendDP, getTimer, clearTimer };
};

export { useSendDp };
