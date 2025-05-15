import { useEffect } from 'react';
import { hideMenuButton, showMenuButton } from '@ray-js/ray';

export function useHideMenuButton(closeHidden?: boolean) {
  useEffect(() => {
    hideMenuButton();
    return () => !closeHidden && showMenuButton();
  }, []);
}
