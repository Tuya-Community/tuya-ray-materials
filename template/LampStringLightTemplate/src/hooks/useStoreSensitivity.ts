import { CLOUD_KEY_LOCAL_MUSIC_SI } from '@/constant';
import { useCloudStorageKey } from './useCloudStorageKey';
import { useMemo } from 'react';
import { isNotNullOrUndefined } from '@/utils/kit';

export const useStoreSensitivity = () => {
  const {
    value: storeSensitivity,
    setValue: setStoreSensitivity,
    inited: storeSensitivityInited,
  } = useCloudStorageKey(CLOUD_KEY_LOCAL_MUSIC_SI, {});

  const result = useMemo(() => {
    if (!storeSensitivityInited) return {};

    if (storeSensitivity) {
      const strs = storeSensitivity.split(',');
      const data = strs.reduce((acc, str) => {
        const [id, si] = str.split(':');
        return { ...acc, [id]: si };
      }, {});

      return data;
    }
    return {};
  }, [storeSensitivity, storeSensitivityInited]);

  const setIdSi = (id: string, si: string, dispatch = true) => {
    if (isNotNullOrUndefined(id) && si) {
      const newResult = {
        ...result,
        [id]: si,
      };
      const newStr = Object.keys(newResult)
        .map(id => `${id}:${newResult[id]}`)
        .join(',');
      setStoreSensitivity(newStr, dispatch);
    }
  };

  return {
    setIdSi,
    inited: storeSensitivityInited,
    result,
  };
};
