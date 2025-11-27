import React, { useEffect } from 'react';
import { View, setNavigationBarTitle } from '@ray-js/ray';
import { Cell, CellGroup } from '@ray-js/smart-ui';
import { useDevice, useActions } from '@ray-js/panel-sdk';
import { DpListItem } from '@/components';
import { useSelector } from 'react-redux';
import { commonCheckInfo } from '@/redux/modules/commonInfoSlice';
import Strings from '@/i18n';
import { supportDp } from '@/utils';
import dpCodes from '@/constant/dpCodes';
import useCheckPermissions from '@/hooks/useCheckPermissions';
import styles from './index.module.less';

const LightPage = () => {
  const actions = useActions();
  const devInfo = useDevice(device => device.devInfo);
  const dpSchema = useDevice(device => device.dpSchema);
  const commonInfo = useSelector(commonCheckInfo);
  const { devId } = devInfo;

  const { checkHideDp } = useCheckPermissions({
    dpSchema,
    commonInfo,
    devId,
  });

  useEffect(() => {
    setNavigationBarTitle({ title: Strings.getLang('lightTitle') });
  }, []);

  const lightData = [
    {
      code: dpCodes.headlightSwitch,
      isShow: supportDp(dpCodes.headlightSwitch, dpSchema) && !checkHideDp(dpCodes.headlightSwitch),
    },
    {
      code: dpCodes.autoLightSwitch,
      isShow: supportDp(dpCodes.autoLightSwitch, dpSchema) && !checkHideDp(dpCodes.autoLightSwitch),
    },
    {
      code: dpCodes.taillightSwitch,
      isShow: supportDp(dpCodes.taillightSwitch, dpSchema) && !checkHideDp(dpCodes.taillightSwitch),
    },
  ].filter(i => i.isShow);

  return (
    <View className={styles.container}>
      {lightData.map(i => (
        <DpListItem code={i.code} key={i.code} />
      ))}

      {supportDp(dpCodes.switchLed, dpSchema) && !checkHideDp(dpCodes.switchLed) && (
        <View
          className={styles.settingItem}
          onClick={() => {
            ty.router({
              url: `tuyaSmart://tsod_ambient_lighting?devId=${devId}`,
              success: () => {
                console.log('jumpSuccess :>> ');
              },
              fail: err => {
                console.log('氛围灯跳转失败 :>> ', err);
              },
            });
          }}
        >
          <CellGroup inset>
            <Cell title={Strings.getLang('ambientLight')} isLink />
          </CellGroup>
        </View>
      )}
    </View>
  );
};

export default LightPage;
