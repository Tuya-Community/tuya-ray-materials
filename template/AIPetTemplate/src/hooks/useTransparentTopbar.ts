import { usePageEvent } from '@ray-js/ray';
import { setNavbarTransparency } from '@/utils/setTransparency';

export const useTransparentTopbar = () => {
  usePageEvent('onLoad', () => {
    setNavbarTransparency();
  });
};
