import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, router, getDeviceInfo, Image } from '@ray-js/ray';
import { DevInfo } from '@ray-js/panel-sdk';
import { NavBar, ConfigProvider } from '@ray-js/smart-ui'
import Slider from '@ray-js/components-ty-slider'
import Button from '../../components/Button';
import i18n from '../../i18n';
import { getDpIdByCode } from '../../utils';
import dpCodes from '../../dpCodes';
import className from './index.less?modules';
import { putDpData } from '../../utils';
import { useHideMenuButton } from '../../hooks/useHideMenuButton';
import bg from '../../res//bg.png';
import './common.less';

const Home = (props) => {
  const initLightPixel = useRef(0);
  const { query } = props?.location || {};
  const [devInfo, setDevInfo] = useState({} as DevInfo);

  useHideMenuButton();

  useEffect(() => {
    if (!query?.deviceId) {
      console.warn('Missing deviceId');
      return;
    }
    getDeviceInfo({
      deviceId: query.deviceId,
      success: (res) => {
        setDevInfo(res as any);
      }
    })
  }, []);

  useEffect(() => {
    if (Object.keys(devInfo).length === 0) {
      return;
    }
    const strip_all_point = devInfo.panelConfig?.fun?.strip_all_point ? devInfo.panelConfig.fun.strip_all_point : 50;
    const strip_length = devInfo.panelConfig?.fun?.strip_length ? devInfo.panelConfig.fun.strip_length : 5;
  
    const lightLengthId = getDpIdByCode(dpCodes.lightLengthCode, devInfo);
    const lightLength = devInfo.dps[lightLengthId] ?? strip_length; // 上报的长度单位是厘米

    const numberSetId = getDpIdByCode(dpCodes.numberSetCode, devInfo);
    const lightPixelNumberSet = +devInfo.dps[numberSetId];

    const lightPixelId = getDpIdByCode(dpCodes.lightPixelCode, devInfo);
    const lightPixel = devInfo.dps[lightPixelId] ?? strip_all_point;
  
    const workModeId = getDpIdByCode(dpCodes.workModeCode, devInfo);
    const workMode = devInfo.dps[workModeId] as unknown as string;
    if (!initLightPixel.current) {
      initLightPixel.current = lightPixelNumberSet as any;
    }
    const res = {
      lightLength, // 上报的长度单位是厘米
      lightPixelNumberSet,
      lightPixel,
      workMode,
    };
    setDps(res);
  }, [devInfo]);

  const [ dps, setDps ] = useState({} as { lightLength: number, lightPixelNumberSet: number, lightPixel: number, workMode: string });

  const [lightLength, setLightLength] = useState(dps?.lightPixelNumberSet);

  const isCanOperate = dps?.lightPixelNumberSet !== undefined;

  useEffect(() => {
    if (!dps?.lightPixelNumberSet) {
      return;
    }
    setLightLength(dps?.lightPixelNumberSet);
  }, [dps?.lightPixelNumberSet]);

  const handleBack = useCallback(() => {
    putDpData({
      [dpCodes.numberSetCode]: initLightPixel.current,
    }, devInfo);

    setTimeout(() => {
      putDpData({
        // 退出时恢复workMode
        [dpCodes.workModeCode]: dps.workMode
      }, devInfo)
    }, 400);
    router.back();
  }, [initLightPixel.current, dps.workMode, devInfo]);

  const min = 10;
  const max = Math.max(dps?.lightPixel, min) || min;
  const handleConfirm = useCallback(() => {
    putDpData({
      // 退出时恢复workMode
      [dpCodes.workModeCode]: dps.workMode
    }, devInfo);
    router.back();
  }, [devInfo, dps]);

  const hasLength = useMemo(() => !!getDpIdByCode('light_length', devInfo), [devInfo]); // 如果没有总长度dp，面板显示点数

  const getValueText = useCallback(
    v => {
      const text = hasLength ? (((dps?.lightLength / 100) * v) / max).toFixed(2) : v;
      return text === 'NaN' ? '0.1' : (text || '0.1');
    },
    [hasLength, dps?.lightLength, max]
  );
  const maxText = useMemo(
    () => (hasLength ? `${getValueText(max)} ${i18n.getLang('lscf_unitMeter')}` : max),
    [getValueText, hasLength, max]
  );

  const minText = useMemo(
    () => (hasLength ? `${getValueText(min)} ${i18n.getLang('lscf_unitMeter')}` : min),
    [getValueText, hasLength, min]
  );
  
  const valueText = useMemo(
    () => getValueText(lightLength),
    [getValueText, lightLength]
  );

  const timer = useRef(+new Date());
  const handleChangeSlider = (v: number) => {
    // 一定时间内只发送一次
    const delay = 50;
    if (timer.current + delay > +new Date()) {
      return;
    }
    timer.current = +new Date();
    const _v = Math.max(Math.min(v, max), min);
    setLightLength(_v);
  };

  const handleReleaseSlider = useCallback((v: number) => {
    const _v = Math.max(Math.min(v, max), min);
    putDpData({
      [dpCodes.numberSetCode]: _v
    }, devInfo);
    setLightLength(_v);
  }, [devInfo, max, min]);

  const isVirtual = (query.deviceId || '').startsWith('vdevo');

  return (
    <ConfigProvider themeVars={{
      navBarBackgroundColor: '#0b0909',
      navBarTitleTextColor: 'white',
      navBarArrowColor: 'white'
    }}>
      <View className={className.homeWrapper}>
        <NavBar
          title={i18n.getLang('lscf_functionTitle')}
          leftArrow
          onClickLeft={handleBack}
        ></NavBar>
        <Image src={bg} className={className.bg}></Image>
        <View className={className.center}>
          <View className={className.padding}></View>
          {isVirtual ? <Text className={`${className.tips}`}>{i18n.getLang('lscf_virtualDeviceTips')}</Text> : <Text className={className.tips}>{i18n.getLang('lscf_tips')}</Text>}
          <View className={className.cardWrapper} style={ isCanOperate ? {} : { height: '80px' }}>
            <View className={className.cardTop}>
              <Text style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '28rpx' }}>
                {
                  i18n.getLang(hasLength ? 'lscf_cardTitle' : 'lscf_cardTitlePoints')
                }
              </Text>
              <View>
                <Text style={{ color: 'rgba(16, 130, 254, 1)', fontSize: '32rpx' }}>{isCanOperate ? valueText : dps?.lightPixel}</Text>
                <Text style={{ color: '#fff', fontSize: '28rpx' }}>{`${isCanOperate ? i18n.getLang('lscf_unitMeter') : i18n.getLang('lscf_pointNum')}`}</Text>
              </View>
            </View>
            {isCanOperate && (
              <>
                <View className={className.cardContent}>
                  <Slider
                    isShowTicks
                    tickWidth='2rpx'
                    tickHeight='20rpx'
                    step={1}
                    forceStep={(max - min) / 10 || 1}
                    max={max}
                    min={min}
                    thumbWidth={2}
                    value={dps.lightPixelNumberSet}
                    maxTrackHeight="64rpx"
                    maxTrackWidth="622rpx"
                    maxTrackRadius="16rpx"
                    minTrackWidth="64rpx"
                    minTrackHeight="64rpx"
                    maxTrackColor="rgba(255, 255, 255, 0.11)"
                    hideThumbButton
                    onChange={handleChangeSlider}
                    onAfterChange={handleReleaseSlider}
                  />
                </View>
                <View className={`${className.cardBottom}`}>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '24rpx' }}>{minText}</Text>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '24rpx' }}>{maxText}</Text>
                </View>
              </>
            )}
          </View>
        </View>
        {isCanOperate && (
          <View className={className.buttonWrapper}>
            <Button onClick={handleBack} bgColor='rgba(255, 255, 255, .1)' fontSize={16}>{i18n.getLang('lscf_cancel')}</Button>
            <Button onClick={handleConfirm} fontSize={16}>{i18n.getLang('lscf_confirm')}</Button>
          </View>
        )}
      </View>
    </ConfigProvider>
  );
}

export default Home;
