import { useRef } from 'react';

import useEffectOnce from './useEffectOnce';

/**
 * https://github.com/streamich/react-use/blob/master/docs/useUnmount.md
 */
const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn);

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  useEffectOnce(() => () => fnRef.current());
};

export default useUnmount;
