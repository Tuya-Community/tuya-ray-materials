import React, { useState } from 'react';
import { usePageEvent, usePageInstance } from 'ray';
import { View, Text } from '@ray-js/ray';
import { Field } from '@ray-js/smart-ui';
import { Card } from '@/components/card';
import Strings from '@/i18n';
import Layout from '@/components/layout';
import { useSelector, DefaultRootState } from 'react-redux';
import Styles from './index.module.less';
import { getPropertySaveApi, setPropertySaveApi } from '../../../api/home';
import { PowerUnit } from '../../../constants';
import Render from './index.rjs';

/**
 * @description 当天发电量
 * @returns
 */
export default function PvInfo() {
  const [capacityValue, setCapacityValue] = useState(0);
  const devInfo = useSelector((state: DefaultRootState & { devInfo }) => state.devInfo);

  const ctx = usePageInstance();
  const render = new Render(ctx);
  usePageEvent('onReady', () => {
    init(percent => {
      render.pageDraw(percent);
    });
  });

  const init = callback => {
    const {
      query: { deviceId },
    } = ty.getLaunchOptionsSync();
    getPropertySaveApi({
      devId: deviceId,
      bizType: 0,
      code: 'capacityValue',
    }).then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        const val = JSON.parse(data[0].value);
        const percent = calculatePercent(Math.abs(devInfo.pvPower), val, PowerUnit.KW);
        setCapacityValue(val);
        callback(percent);
      }
    });
  };

  // 当日发电功率/装机容量 百分比
  const calculatePercent = (power, capacity, powerUnit = 'kW') => {
    let result = 0;
    let num = parseFloat(power);
    const total = parseFloat(capacity);
    try {
      if (!isNaN(num) && !isNaN(total) && total > 0) {
        if (powerUnit === PowerUnit.W) {
          // 转换kW
          num *= 0.001;
        }
        if (powerUnit === PowerUnit.MW) {
          // 转换kW
          num *= 1000;
        }
        if (powerUnit === PowerUnit.GW) {
          // 转换kW
          num = num * 1000 * 1000;
        }
        result = Math.round((num / total) * 10000) / 100.0;
      }
    } catch {
      // do somthing
    }
    return result;
  };

  const changeCapacityValue = e => {
    const newVal = e.detail;
    setCapacityValue(newVal);
    onSetCapacityValueEvent(newVal);
  };

  const onSetCapacityValueEvent = val => {
    const {
      query: { deviceId },
    } = ty.getLaunchOptionsSync();
    setPropertySaveApi({
      devId: deviceId,
      bizType: 0,
      code: 'capacityValue',
      value: JSON.stringify(val),
    }).then(() => {
      const percent = calculatePercent(Math.abs(devInfo.pvPower), val, PowerUnit.KW);
      render.pageDraw(percent);
    });
  };

  return (
    <Layout title="发电" showBack>
      <View className={Styles.headWrap} />
      <Card className={Styles.card}>
        <View className={Styles.staticsWrap}>
          <View className={Styles.chartWrap}>
            <canvas canvas-id="pageCanvas1" className={Styles.canvasWrap} />
          </View>
          <View className={Styles.sepWrap} />
          <View className={Styles.dataWrap}>
            <View className={Styles.font1}>{Strings.getLang('totalInstallCapacity')}</View>
            <View className={Styles.mt16}>
              <Field
                cardMode
                type="number"
                placeholder={Strings.getLang('pleaseInput')}
                hiddenLabel
                value={capacityValue}
                onChange={changeCapacityValue}
                // customClass="inputClsx"
                customStyle={{
                  padding: 0,
                }}
                slot={{
                  rightIcon: <Text className={Styles.font3}>kWp</Text>,
                }}
              />
            </View>
          </View>
        </View>
      </Card>
      <Card className={Styles.card}>
        <View>PV1</View>
        <View className={Styles.content}>
          <View>
            <View className={Styles.font1}>{Strings.getLang('currentVoltage')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDcVoltage1}</Text>
              <Text className={Styles.font3}>V</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('currentCurrent')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDcCurrent1}</Text>
              <Text className={Styles.font3}>A</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('currentPower')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterPv1InputPower}</Text>
              <Text className={Styles.font3}>kWh</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card className={Styles.card}>
        <View>PV2</View>
        <View className={Styles.content}>
          <View>
            <View className={Styles.font1}>{Strings.getLang('currentVoltage')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDcVoltage2}</Text>
              <Text className={Styles.font3}>V</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('currentCurrent')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDcCurrent2}</Text>
              <Text className={Styles.font3}>A</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('currentPower')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterPv2InputPower}</Text>
              <Text className={Styles.font3}>kWh</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card className={Styles.card}>
        <View>PV3</View>
        <View className={Styles.content}>
          <View>
            <View className={Styles.font1}>{Strings.getLang('currentVoltage')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDcVoltage3}</Text>
              <Text className={Styles.font3}>V</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('currentCurrent')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDcCurrent3}</Text>
              <Text className={Styles.font3}>A</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('currentPower')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterPv3InputPower}</Text>
              <Text className={Styles.font3}>kWh</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card className={Styles.card}>
        <View>PV4</View>
        <View className={Styles.content}>
          <View>
            <View className={Styles.font1}>{Strings.getLang('currentVoltage')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDcVoltage4}</Text>
              <Text className={Styles.font3}>V</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('currentCurrent')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterDcCurrent4}</Text>
              <Text className={Styles.font3}>A</Text>
            </View>
          </View>

          <View>
            <View className={Styles.font1}>{Strings.getLang('currentPower')}</View>
            <View className={Styles.mt4}>
              <Text className={Styles.font2}>{devInfo.inverterPv4InputPower}</Text>
              <Text className={Styles.font3}>kWh</Text>
            </View>
          </View>
        </View>
      </Card>
    </Layout>
  );
}
