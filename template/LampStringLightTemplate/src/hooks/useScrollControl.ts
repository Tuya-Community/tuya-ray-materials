import { actions, useAppDispatch, useSelector } from '@/redux';
import { useCallback } from 'react';

export const useScrollControl = () => {
  const scrollable = useSelector(state => state?.common?.scrollable);
  const scrollTop = useSelector(state => state?.common?.scrollTop || 0);

  const dispatch = useAppDispatch();

  const enableScroll = useCallback(() => {
    dispatch(actions.common.updateScroll(true));
  }, []);
  const disableScroll = useCallback(() => {
    dispatch(actions.common.updateScroll(false));
  }, []);
  const setScrollTop = useCallback((top: number) => {
    dispatch(actions.common.updateScrollTop(top));
  }, []);

  return {
    scrollable,
    enableScroll,
    disableScroll,
    scrollTop,
    setScrollTop,
  };
};
