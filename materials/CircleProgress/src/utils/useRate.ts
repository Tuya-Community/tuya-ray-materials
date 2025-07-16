import { getSystemInfo } from '@ray-js/ray';
import { useEffect, useState } from 'react';

let isLoad = false;
let _rate = 1;

const useRatio = () => {
  const [rate, setRate] = useState(_rate);
  useEffect(() => {
    if (isLoad) {
      return;
    }
    getSystemInfo({
      success(res) {
        isLoad = true;
        const rateRes = (res.screenWidth / 375).toFixed(2);
        setRate(+rateRes);
        _rate = +rateRes;
      },
      fail(err) {
        console.warn('getSystemInfo err:', err);
      },
    });
  }, []);

  return rate;
};

export default useRatio;
