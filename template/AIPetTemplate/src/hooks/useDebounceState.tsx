import { useCallback, useState } from 'react';
import { useDebounceFn } from 'ahooks';

export const useDebounceState = <T extends any>(initialValue: T, wait = 300) => {
  const [state, setState] = useState(initialValue);

  const { run: setDebounced, cancel } = useDebounceFn(
    value => {
      setState(value);
    },
    { wait, leading: false, trailing: true }
  );

  const setImmediate = useCallback(value => {
    cancel();
    setState(value);
  }, []);

  return [state, { setImmediate, setDebounced }] as [
    T,
    { setImmediate: (value: T) => void; setDebounced: (value: T) => void }
  ];
};
