import { useSupport } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import Strings from '@/i18n';
import { useProps } from '@ray-js/panel-sdk';

export const useFeedUnit = () => {
  const support = useSupport();
  const dpUnitSwitch = useProps(props => props[dpCodes.unitSwitch]);

  return support.isSupportDp(dpCodes.unitSwitch)
    ? Strings.getDpLang(dpCodes.unitSwitch, dpUnitSwitch)
    : Strings.getDpLang(dpCodes.manualFeed, 'unit');
};
