import React from 'react';
import { router, View, Image } from '@ray-js/ray';
import { usePageEvent } from 'ray';
import { Card } from '@/components/card';
import Strings from '@/i18n';
import { API_SETTING_MAP } from '../../constants';
import Styles from './index.module.less';
import store from '../../redux';
import { updateEnergyMode } from '../../redux/modules/energyModeSlice';
import { getDeviceInverterModelApi } from '../../api/set';

export default function Menu() {
  const { dispatch } = store;

  // onShow 生命周期
  usePageEvent('onShow', () => {
    init();
  });

  const init = () => {
    const {
      query: { deviceId },
    } = ty.getLaunchOptionsSync();

    getInitInverterInfo(deviceId);
  };

  const getInitInverterInfo = deviceId => {
    const energyModeOptions = [];
    const pvUsePurposeOptions = [];
    const chargingBatteryPriorityOptions = [];
    let batteryChargingTargetSos = {};
    let batteryConnectedDod = {};

    getDeviceInverterModelApi({ devId: deviceId, type: 'setting' })
      .then(res => {
        res.forEach(setting => {
          switch (setting?.code) {
            case API_SETTING_MAP.InverterWorkModeSetting:
              setting?.dataSpec?.rangeInfo?.forEach(item => {
                energyModeOptions.push({
                  code: item.code,
                  title: item.name,
                });
              });
              break;
            case 'purpose_of_pv_use':
              setting?.dataSpec?.rangeInfo?.forEach(item => {
                pvUsePurposeOptions.push({
                  code: item.code,
                  title: item.name,
                });
              });
              break;
            case 'charging_battery_priority':
              setting?.dataSpec?.rangeInfo?.forEach(item => {
                chargingBatteryPriorityOptions.push({
                  code: item.code,
                  title: item.name,
                });
              });
              break;
            case 'battery_charging_target_soc':
              batteryChargingTargetSos = {
                max: +setting.dataSpec.max,
                min: +setting.dataSpec.min,
                name: setting.name,
              };
              break;
            case 'grid_connected_dod':
              batteryConnectedDod = {
                max: +setting.dataSpec.max,
                min: +setting.dataSpec.min,
                name: setting.name,
              };
              break;

            default:
              // do somting
              break;
          }
        });

        dispatch(updateEnergyMode(energyModeOptions));
      })
      .catch(() => {
        // do somthing
      });
  };

  return (
    <View className={Styles.wrap}>
      <Card
        className={Styles.card}
        hoverClassName={Styles.hover}
        onClick={() => router.push('/inverterInfo')}
      >
        <Image src="/images/common/icon_menu_dzxx.png" className={Styles.icon} />
        <View className={Styles.title}>{Strings.getLang('inverterInfo')}</View>
      </Card>
      <Card
        className={Styles.card}
        hoverClassName={Styles.hover}
        onClick={() => router.push('/energyModeSet')}
      >
        <Image src="/images/common/icon_menu_zxsb.png" className={Styles.icon} />
        <View className={Styles.title}>{Strings.getLang('energyMode')}</View>
      </Card>
    </View>
  );
}
