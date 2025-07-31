import { navigateToMiniProgram } from '@ray-js/ray';

const useCheckPermissions = devInfo => {
  const { devId, i18nTime, pv, panelConfig, productId } = devInfo;
  const goToRNPage = (id: string, isRN = true) => {
    ty.openPanel({
      deviceId: devId,
      extraInfo: {
        bizClientId: id,
        productId,
        deviceId: devId,
        productVersion: pv,
        uiType: isRN ? 'RN' : 'SMART_MINIPG',
        i18nTime,
        ...panelConfig,
      },
    });
  };

  const goToMiniProgram = (appId: string) => {
    navigateToMiniProgram({
      appId,
      position: 'bottom',
      extraData: {
        productId,
        productVersion: pv,
        i18nTime,
        ...panelConfig,
      },
    });
  };

  return { goToRNPage, goToMiniProgram };
};
export default useCheckPermissions;
