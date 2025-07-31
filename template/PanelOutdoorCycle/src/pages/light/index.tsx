import React, { useEffect } from 'react';
import { View, Switch } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
import { useDevice, useProps, useActions } from '@ray-js/panel-sdk';
import List from '@ray-js/components-ty-cell';
import { TopBar } from '@/components';
import { useSelector } from 'react-redux';
import { commonCheckInfo } from '@/redux/modules/commonInfoSlice';
import Strings from '@/i18n';
import { supportDp } from '@/utils';
import dpCodes from '@/constant/dpCodes';
import useCheckPermissions from '@/hooks/useCheckPermissions';
import styles from './index.module.less';

export function LightPage() {
  const actions = useActions();
  const devInfo = useDevice(device => device.devInfo);
  const dpSchema = useDevice(device => device.dpSchema);
  const commonInfo = useSelector(commonCheckInfo);
  const headlightSwitchDpVal = useProps(props => props[dpCodes.headlightSwitch]);
  const autoLightSwitchDpVal = useProps(props => props[dpCodes.autoLightSwitch]);
  const taillightSwitchDpVal = useProps(props => props[dpCodes.taillightSwitch]);
  const { devId } = devInfo;

  const { checkHideDp } = useCheckPermissions({
    dpSchema,
    commonInfo,
    devId,
  });

  useEffect(() => {
    ty.hideMenuButton();
  }, []);

  const lightData = [
    {
      code: dpCodes.headlightSwitch,
      value: !!headlightSwitchDpVal,
      isShow: supportDp(dpCodes.headlightSwitch, dpSchema) && !checkHideDp(dpCodes.headlightSwitch),
    },
    {
      code: dpCodes.autoLightSwitch,
      value: !!autoLightSwitchDpVal,
      isShow: supportDp(dpCodes.autoLightSwitch, dpSchema) && !checkHideDp(dpCodes.autoLightSwitch),
    },
    {
      code: dpCodes.taillightSwitch,
      value: !!taillightSwitchDpVal,
      isShow: supportDp(dpCodes.taillightSwitch, dpSchema) && !checkHideDp(dpCodes.taillightSwitch),
    },
  ].filter(i => i.isShow);

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('lightTitle')} />
      <View className={styles.content}>
        {lightData.map(i => (
          <List.Item
            key={i.code}
            className={styles.listItem}
            title={Strings.getDpLang(i.code)}
            gap="10"
            content={
              <Switch
                color="var(--app-M1)"
                checked={i.value}
                onChange={e => actions[i.code].toggle()}
              />
            }
          />
        ))}

        {supportDp(dpCodes.switchLed, dpSchema) && !checkHideDp(dpCodes.switchLed) && (
          <List.Item
            className={styles.listItem}
            title={Strings.getLang('ambientLight')}
            content={<Icon type="icon-right" color="var(--app-B1-N4)" size={18} />}
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
          />
        )}
      </View>
    </View>
  );
}

export default LightPage;
