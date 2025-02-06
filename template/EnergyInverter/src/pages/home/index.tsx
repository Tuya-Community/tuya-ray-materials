import React from 'react';
import { DefaultRootState, useSelector } from 'react-redux';
import { router, Text, View, Image } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { usePageEvent } from 'ray';
import moment from 'moment';
import clsx from 'clsx';
import LayoutComponent from '@/components/layout';
import { Card } from '@/components/card';
import Strings from '@/i18n';
import Styles from './index.module.less';
import {
  getEnergyInverterDevice,
  getEnergyInverterPanelApi,
  getEnergyInverterFlowApi,
  getDeviceDataMultipleApi,
  getDeviceInfo,
} from '../../api/home';
import { getDevicePropertyGet } from '../../api/set';
import { IndicatorCodes, DeviceDataMultipleDate, API_SETTING_MAP, DAY } from '../../constants';
import store from '../../redux';
import { updateDevInfo } from '../../redux/modules/devInfoSlice';

export default function Home() {
  const { dispatch } = store;
  const devName = useDevice(d => d.devInfo.name);
  const devInfo = useSelector((state: DefaultRootState & { devInfo }) => state.devInfo);

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
    Promise.all([
      getEnergyInverterDevice({ devId: deviceId }), // 逆变器设备信息 [0]
      getEnergyInverterPanelApi({ devId: deviceId }), // 逆变器仪表盘信息 [1]
      getEnergyInverterFlowApi({ devId: deviceId }), // 逆变器流转图功率 [2]
      getDevicePropertyGet({ devId: deviceId, codes: API_SETTING_MAP.InverterWorkModeSetting }), // 模式获取 [3]
      getDeviceInfo(deviceId), // ttt 设备信息 [4]
      getDeviceDataMultipleApi({
        devId: deviceId,
        indicatorCodes: `${IndicatorCodes.EleProduceCost},${IndicatorCodes.EleProduceGridcnCost}`,
        dateType: DAY,
        beginDate: moment().format('YYYYMMDD'),
        endDate: moment().format('YYYYMMDD'),
      }), // [5]
      getDeviceDataMultipleApi({
        devId: deviceId,
        indicatorCodes: IndicatorCodes.EleProduceCost,
        dateType: DAY,
        beginDate: DeviceDataMultipleDate.BeginDate,
        endDate: moment().format('YYYYMMDD'),
      }), // [6]
    ])
      .then(apiList => {
        let fitVal = '';
        let dayIncome = '';
        let totalIncome = '';
        let curUnit = '';

        if (apiList[5] && Array.isArray(apiList[5])) {
          apiList[5].forEach(ele => {
            if (ele.indicator === IndicatorCodes.EleProduceGridcnCost) {
              fitVal = `${ele.value}`;
            } else if (ele.indicator === IndicatorCodes.EleProduceCost) {
              dayIncome = `${ele.value}`;
            }
          });
        }

        if (apiList[6] && Array.isArray(apiList[6]) && apiList[6][0]) {
          totalIncome = apiList[6][0].value;
          curUnit = apiList[6][0].unit || '';
        }

        const tttDeviceInfo: { isOnline?: boolean } = apiList[4] || { isOnline: false };
        const infoMap = {};
        Object.assign(
          infoMap,
          apiList[0] || {},
          apiList[1] || {},
          apiList[2] || {},
          {
            inverterModeApiData:
              apiList[3] && apiList[3].length > 0
                ? apiList[3]
                : [{ code: '', langValue: '-', time: 0, value: '-' }],
          },
          { isOnline: tttDeviceInfo.isOnline },
          {
            fitVal: '',
            dayIncome: '',
            totalIncome: '',
            curUnit: '',
          }
        );

        dispatch(updateDevInfo(infoMap));
      })
      .catch(() => {
        // do somthing
      });
  };

  const goToPage = path => {
    router.push(path);
  };

  return (
    <LayoutComponent title={Strings.getLang('inverterInfo')}>
      <Card className={Styles.card} hoverClassName={Styles.hover}>
        <View className={Styles.titleWrap}>
          <Text className={Styles.text}>{devName}</Text>
        </View>
        <View className={Styles.rowWrap}>
          <View className={Styles.rowUnit}>
            <Text className={Styles.subText}>{Strings.getLang('stateEnergy')}</Text>
            <Text className={clsx(Styles.status, devInfo.isOnline ? Styles.online : '')}>
              {devInfo.isOnline
                ? Strings.getLang('onlineEnergy')
                : Strings.getLang('offlineEnergy')}
            </Text>
          </View>
        </View>
      </Card>

      <View className={Styles.modeSelectWrap}>
        <View />
        <View>
          <Text className={Styles.text}>{devInfo.inverterModeApiData[0].langValue}</Text>
          <Image src="/images/common/right-arrow.png" className={Styles.iconArrow} />
        </View>
      </View>

      <View className={Styles.scoreWrap}>
        <View>
          <Text className={Styles.title}>{Strings.getLang('score')}：</Text>
          <Text className={Styles.value}>{devInfo.score}%</Text>
        </View>
        <View className={Styles.sebLine} />
        <View>
          <Text className={Styles.title}>{Strings.getLang('netOutput')}：</Text>
          <Text className={Styles.value}>{devInfo.netOutput} kWh</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Image src="/images/common/flows.png" style={{ width: '337px', height: '349px' }} />
      </View>

      <View className={Styles.incomeWrap}>
        <Card className={Styles.card} hoverClassName={Styles.hover}>
          <View>
            <Image src="/images/common/icon_sy.png" className={Styles.icon} />
            <Text className={Styles.font1}>{Strings.getLang('income')}</Text>
            <Image src="/images/common/right-arrow.png" className={Styles.iconArrow} />
          </View>
          <View className={Styles.mt16}>
            <View className={Styles.rows}>
              <Text className={Styles.font3}>{Strings.getLang('fitIncome')}</Text>
              <Text className={Styles.font4}>
                {devInfo.fitVal || '-'}
                {devInfo.curUnit}
              </Text>
            </View>
            <View className={Styles.rows}>
              <Text className={Styles.font3}>{Strings.getLang('curDayIncome')}</Text>
              <Text className={Styles.font4}>
                {devInfo.dayIncome || '-'}
                {devInfo.curUnit}
              </Text>
            </View>
            <View className={Styles.rows}>
              <Text className={Styles.font3}>{Strings.getLang('cumulativeIncome')}</Text>
              <Text className={Styles.font4}>
                {devInfo.totalIncome || '-'}
                {devInfo.curUnit}
              </Text>
            </View>
          </View>
        </Card>

        <Card className={clsx(Styles.card, Styles.pd20)} hoverClassName={Styles.hover}>
          <View className={Styles.innerUnitWrap} onClick={() => goToPage('/pvInfo')}>
            <Image src="/images/common/icon_dn.png" className={clsx(Styles.icon, Styles.mt6)} />
            <View className={Styles.ml10}>
              <View className={Styles.font4}>{devInfo.eleProduce} kWh</View>
              <View className={Styles.font3}>{Strings.getLang('curDayPowerGeneration')}</View>
            </View>
            <Image
              src="/images/common/right-arrow.png"
              className={clsx(Styles.iconArrow, Styles.mt14)}
            />
          </View>
          <View className={Styles.harLine} />
          <View className={Styles.innerUnitWrap} onClick={() => goToPage('/energyStorageInfo')}>
            <Image src="/images/common/icon_ny.png" className={clsx(Styles.icon, Styles.mt6)} />
            <View className={Styles.ml10}>
              <View className={Styles.font4}>{devInfo.inverterSoc} %</View>
              <View className={Styles.font3}>{Strings.getLang('curDayElectricity')}</View>
            </View>
            <Image
              src="/images/common/right-arrow.png"
              className={clsx(Styles.iconArrow, Styles.mt14)}
            />
          </View>
        </Card>
      </View>
    </LayoutComponent>
  );
}
