import { useEffect, useState } from 'react';
import { getSystemInfo } from '@ray-js/ray';

// 判断是否 IDE 环境
export const useIsInIDE = () => {
  const [isInIDE, setIsInIDE] = useState(false);
  useEffect(() => {
    getSystemInfo({
      success: data => {
        setIsInIDE(data.brand === 'devtools');
      },
    });
  }, []);
  return isInIDE;
};
