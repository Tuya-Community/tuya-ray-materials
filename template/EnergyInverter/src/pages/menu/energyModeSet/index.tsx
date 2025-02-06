import React, { useState } from 'react';
import { View } from '@ray-js/ray';
import clsx from 'clsx';
import { Card } from '@/components/card';
import Layout from '@/components/layout';
import Strings from '@/i18n';
import { useSelector, DefaultRootState } from 'react-redux';
import Styles from './index.module.less';
import { getEnergyInverterDevice } from '../../../api/home';
import { setDeviceSet } from '../../../api/set';
import { API_SETTING_MAP } from '../../../constants';
import { updateDevInfo } from '../../../redux/modules/devInfoSlice';
import store from '../../../redux';

/**
 * @description 能源模式
 * @returns
 */
export default function energyModeSet() {
  const { dispatch } = store;
  const energyModeSetInfo = useSelector(
    (state: DefaultRootState & { energyMode }) => state.energyMode
  );
  const devInfo = useSelector((state: DefaultRootState & { devInfo }) => state.devInfo);
  const [curMode, setCurMode] = useState(devInfo.inverterWorkMode);

  const changeMode = e => {
    const { code } = e.origin.currentTarget.dataset;
    setCurMode(code);
  };

  const saveMode = async () => {
    if (curMode) {
      const {
        query: { deviceId },
      } = ty.getLaunchOptionsSync();

      const res1 = await setDeviceSet({
        devId: deviceId,
        setting: [
          {
            code: API_SETTING_MAP.InverterWorkModeSetting,
            value: curMode,
          },
        ],
      });

      if (res1) {
        ty.showToast({ title: Strings.getLang('setSuccess') });
        setTimeout(() => {
          getEnergyInverterDevice({ devId: deviceId }).then(result => {
            if (result) {
              dispatch(updateDevInfo({ inverterWorkMode: result.inverterWorkMode }));
            }
          });
        }, 3e3); // 延迟获取状态
      }
    }
  };

  return (
    <Layout title={Strings.getLang('energyMode')} showBack>
      <View className={Styles.cardWrap}>
        {energyModeSetInfo.map((item, index) => (
          <Card
            key={index}
            data-code={item.code}
            onClick={changeMode}
            className={clsx(Styles.card, curMode === item.code ? Styles.active : '')}
          >
            <View className={Styles.rowUnit}>
              <View className={Styles.checkMark} />
              <View className={Styles.title}>{item.title}</View>
            </View>
          </Card>
        ))}
      </View>

      <View className={clsx(Styles.btn, curMode === '' ? Styles.disabled : '')} onClick={saveMode}>
        {Strings.getLang('save')}
      </View>
    </Layout>
  );
}
