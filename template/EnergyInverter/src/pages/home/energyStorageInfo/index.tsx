import React from 'react';
import { View, Text } from '@ray-js/ray';
import { usePageEvent, usePageInstance } from 'ray';
import { Card } from '@/components/card';
import Strings from '@/i18n';
import Layout from '@/components/layout';
import { useSelector, DefaultRootState } from 'react-redux';
import clsx from 'clsx';
import Render from './index.rjs';
import Styles from './index.module.less';

/**
 * @description 当天电量
 * @returns
 */
export default function EnergyStorageInfo() {
  const devInfo = useSelector((state: DefaultRootState & { devInfo }) => state.devInfo);

  const ctx = usePageInstance();
  const render = new Render(ctx);
  usePageEvent('onReady', () => {
    render.pageDraw(devInfo.inverterSoc);
  });

  const { inverterSoh } = devInfo;
  let batterySOHTxt = '';
  let batterySOHStyle = '';

  if (inverterSoh !== undefined) {
    if (Number(inverterSoh) > 90) {
      batterySOHTxt = Strings.getLang('batteryHealthy');
      batterySOHStyle = 'batteryHealthy';
    } else if (Number(inverterSoh) >= 80 && Number(inverterSoh) <= 90) {
      batterySOHTxt = Strings.getLang('batteryGood');
      batterySOHStyle = 'batteryGood';
    } else {
      batterySOHTxt = Strings.getLang('batteryRepair');
      batterySOHStyle = 'batteryRepair';
    }
  }

  return (
    <Layout title="储能" showBack>
      <View className={Styles.headWrap} />
      <Card className={Styles.card}>
        <View className={Styles.staticsWrap}>
          <View className={Styles.chartWrap}>
            <canvas canvas-id="pageCanvas1" className={Styles.canvasWrap} />
            <View className={clsx(Styles.font1, Styles.ml50)}>{Strings.getLang('currentSOC')}</View>
          </View>
          <View className={Styles.sepWrap} />
          <View className={Styles.dataWrap}>
            <View className={clsx(Styles.status, Styles[batterySOHStyle])}>
              <Text>{Strings.getLang(batterySOHTxt as any)}</Text>
            </View>
            <View className={Styles.font1}>{Strings.getLang('batterySOH')}</View>
          </View>
        </View>
      </Card>
      <Card className={Styles.card}>
        <View className={Styles.content}>
          <View>
            <View className={Styles.font1}>{Strings.getLang('dayDischargeCapacity')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDailyDischarge}</Text>
              <Text className={Styles.font3}>kWh</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('cumulativeDischarge')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterEsTotalDischarge}</Text>
              <Text className={Styles.font3}>kWh</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card className={Styles.card}>
        <View className={Styles.content}>
          <View>
            <View className={Styles.font1}>{Strings.getLang('dayCharge')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDailyCharge}</Text>
              <Text className={Styles.font3}>kWh</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('cumulativeCharge')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterEsTotalCharge}</Text>
              <Text className={Styles.font3}>kWh</Text>
            </View>
          </View>
        </View>
      </Card>
    </Layout>
  );
}
