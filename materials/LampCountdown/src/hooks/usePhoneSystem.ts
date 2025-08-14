import { useSystemInfo } from './useSystemInfo';

const usePhoneSystem = () => {
  const systemInfo = useSystemInfo();
  return {
    statusBarHeight: systemInfo?.statusBarHeight || 20,
    isAndroid: systemInfo?.platform?.toLowerCase() === 'android',
    isIos: systemInfo?.platform?.toLowerCase() === 'ios',
  };
};

export default usePhoneSystem;
