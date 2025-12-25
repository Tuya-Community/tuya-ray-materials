import { offNavigationBarBack, onNavigationBarBack, setNavigationBarBack } from 'ray';
import { useEffect } from 'react';

export const useNavBack = (onBack?: () => void, deps: any[] = []) => {
  useEffect(() => {
    setNavigationBarBack({ type: 'custom' });

    const handle = () => {
      onBack && onBack();
    };

    onNavigationBarBack(handle);
    return () => {
      offNavigationBarBack(handle);
    };
  }, deps);

  return {
    enableNavBack: () => setNavigationBarBack({ type: 'system' }),
  };
};
