import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '@/redux';
import { updateMode } from '@/redux/modules/recordConfigSlice';
import { getStorageLastModePath } from '@/utils';

const modePath = getStorageLastModePath();

function useUpdateModeByStorageLastModePath() {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => {
    return state?.recordConfig;
  });

  useEffect(() => {
    if (mode === null) {
      dispatch(updateMode(modePath));
    }
  }, [mode]);
}

export default useUpdateModeByStorageLastModePath;
