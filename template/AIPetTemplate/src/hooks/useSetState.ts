import { useCallback, useState } from 'react';

function useSetState<T extends Record<string, any>>(
  initialState: T | (() => T) = {} as T
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] {
  const [state, set] = useState<T>(initialState);
  const setState = useCallback(
    patch => {
      set(prevState =>
        Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch)
      );
    },
    [set]
  );
  return [state, setState];
}

export default useSetState;
