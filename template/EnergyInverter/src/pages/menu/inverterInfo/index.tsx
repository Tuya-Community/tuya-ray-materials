import React from 'react';
import { View, Image } from '@ray-js/ray';
import { Card } from '@/components/card';
import Strings from '@/i18n';
import Layout from '@/components/layout';
import { useSelector, DefaultRootState } from 'react-redux';
import { I18nDyParam } from '../../../utils/multiLanguage';
import Styles from './index.module.less';

/**
 * @description 逆变器信息
 * @returns
 */
export default function InverterInfo() {
  const devInfo = useSelector((state: DefaultRootState & { devInfo }) => state.devInfo);

  const infoList = [
    {
      icon: '/images/common/icon_inverter_1.png',
      subTitle: Strings.getLang('inverterType'),
      message: I18nDyParam('inverterDeviceType_', devInfo.inverterDeviceType) || '--',
    },
    {
      icon: '/images/common/icon_inverter_6.png',
      subTitle: Strings.getLang('energyManagementMode'),
      message: devInfo.inverterModeApiData[0].value,
    },
    {
      icon: '/images/common/icon_inverter_7.png',
      subTitle: Strings.getLang('inverterOperatingStatus'),
      message: I18nDyParam('inverterOperatingStatus_', devInfo.inverterStatus) || '--',
    },
    {
      icon: '/images/common/icon_inverter_2.png',
      subTitle: Strings.getLang('inverterSN'),
      message: devInfo.inverterSerialNumber,
    },
  ];

  return (
    <Layout title={Strings.getLang('inverterInfo')} showBack>
      <Card className={Styles.card}>
        <View className={Styles.rowUnit}>
          <View className={Styles.contentUnit}>
            <Image src={infoList[0].icon} className={Styles.icon} />
            <View className={Styles.title}>{infoList[0].subTitle || '--'}</View>
            <View className={Styles.subTitle}>{infoList[0].message || '--'}</View>
          </View>
          <View className={Styles.contentUnit}>
            <Image src={infoList[1].icon} className={Styles.icon} />
            <View className={Styles.title}>{infoList[1].subTitle || '--'}</View>
            <View className={Styles.subTitle}>{infoList[1].message || '--'}</View>
          </View>
        </View>
        <View className={Styles.rowUnit}>
          <View className={Styles.contentUnit}>
            <Image src={infoList[2].icon} className={Styles.icon} />
            <View className={Styles.title}>{infoList[2].subTitle || '--'}</View>
            <View className={Styles.subTitle}>{infoList[2].message || '--'}</View>
          </View>
          <View className={Styles.contentUnit}>
            <Image src={infoList[3].icon} className={Styles.icon} />
            <View className={Styles.title}>{infoList[3].subTitle || '--'}</View>
            <View className={Styles.subTitle}>{infoList[3].message || '--'}</View>
          </View>
        </View>
      </Card>
    </Layout>
  );
}
