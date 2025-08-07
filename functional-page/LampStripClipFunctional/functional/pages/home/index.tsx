import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, router, getDeviceInfo, Image } from '@ray-js/ray';
import { DevInfo, useProps } from '@ray-js/panel-sdk';
import { NavBar, ConfigProvider } from '@ray-js/smart-ui';
import Slider from '@ray-js/components-ty-slider';
import Button from '../../components/Button';
import i18n from '../../i18n';
import { getDpIdByCode } from '../../utils';
import dpCodes from '../../dpCodes';
import className from './index.less?modules';
import { putDpData } from '../../utils';
import { useHideMenuButton } from '../../hooks/useHideMenuButton';
import bg from '../../res//bg.png';
import './common.less';
import { usePresetData } from '../../hooks/usePresetData';

const Home = (props) => {
  const initLightPixel = useRef(0);
  const hasChanged = useRef(false);
  const { query } = props?.location || {};
  const [devInfo, setDevInfo] = useState({} as DevInfo);
  const presetData: {
    theme?: 'light' | 'dark',
    themeColor?: string,
    hiddenBigIcon?: boolean,
    backgroundStyle?: React.CSSProperties
  } = usePresetData() || {};
  const { themeColor = 'rgba(16, 130, 254, 1)', theme = 'dark' } = presetData
  const isDark = theme === 'dark'
  const fontColor = isDark ? '#fff' : '#000';
  const hiddenBigIcon = isDark ? presetData.hiddenBigIcon : true;
  const backgroundStyle = presetData.backgroundStyle || (isDark ? {} : { background: 'rgba(230, 238, 253)' });
  const dpInfos = useProps();

  useHideMenuButton();

  useEffect(() => {
    if (!query?.deviceId) {
      console.warn('Missing deviceId');
      return;
    }
    getDeviceInfo({
      deviceId: query.deviceId,
      success: (res) => {
        console.log('getDeviceInfo1', res);
        setDevInfo(res as any);
      },
      fail(err) {
        console.error('getDeviceInfo2', err);
      },
    });
  }, []);

  useEffect(() => {
    if (Object.keys(devInfo).length === 0) {
      return;
    }
    const strip_all_point = devInfo.panelConfig?.fun?.strip_all_point ? devInfo.panelConfig.fun.strip_all_point : 50;
    const strip_length = devInfo.panelConfig?.fun?.strip_length ? devInfo.panelConfig.fun.strip_length : 5;

    const lightLength = dpInfos[dpCodes.lightLengthCode] ?? strip_length; // 上报的长度单位是厘米

    const lightPixelNumberSet = +dpInfos[dpCodes.numberSetCode];

    const lightPixel = dpInfos[dpCodes.lightPixelCode] ?? strip_all_point;

    const workMode = dpInfos[dpCodes.workModeCode] as unknown as string;
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
  }, [devInfo, dpInfos]);

  const [dps, setDps] = useState(
    {} as { lightLength: number; lightPixelNumberSet: number; lightPixel: number; workMode: string },
  );

  const [lightLength, setLightLength] = useState(dps?.lightPixelNumberSet);

  const isCanOperate = dps?.lightPixelNumberSet !== undefined;

  useEffect(() => {
    if (!dps?.lightPixelNumberSet) {
      return;
    }
    setLightLength(dps?.lightPixelNumberSet);
  }, [dps?.lightPixelNumberSet]);

  const handleBack = useCallback(() => {
    if(!hasChanged.current) {
      console.log(`没有修改，跳过恢复下发`)
      router.back();
      return
    }
    putDpData(
      {
        [dpCodes.numberSetCode]: initLightPixel.current,
      },
      devInfo,
    );

    setTimeout(() => {
      putDpData(
        {
          // 退出时恢复workMode
          [dpCodes.workModeCode]: dps.workMode,
        },
        devInfo,
      );
    }, 400);
    router.back();
  }, [initLightPixel.current, dps.workMode, devInfo]);

  const min = 10;
  const max = Math.max(dps?.lightPixel, min) || min;
  const handleConfirm = useCallback(() => {
    putDpData(
      {
        // 退出时恢复workMode
        [dpCodes.workModeCode]: dps.workMode,
      },
      devInfo,
    );
    router.back();
  }, [devInfo, dps]);

  console.warn(devInfo?.dps, dpInfos, 'devInfodevInfo');
  const hasLength = useMemo(() => !!getDpIdByCode('light_length', devInfo), [devInfo]); // 如果没有总长度dp，面板显示点数

  const getValueText = useCallback(
    (v) => {
      const text = hasLength ? (((dps?.lightLength / 100) * v) / max).toFixed(2) : v;
      return text === 'NaN' ? '0.1' : text || '0.1';
    },
    [hasLength, dps?.lightLength, max],
  );
  const maxText = useMemo(
    () => (hasLength ? `${getValueText(max)} ${i18n.getLang('lscf_unitMeter')}` : max),
    [getValueText, hasLength, max],
  );

  const minText = useMemo(
    () => (hasLength ? `${getValueText(min)} ${i18n.getLang('lscf_unitMeter')}` : min),
    [getValueText, hasLength, min],
  );

  const valueText = useMemo(() => getValueText(lightLength), [getValueText, lightLength]);

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
    hasChanged.current = true
  };

  const handleReleaseSlider = useCallback(
    (v: number) => {
      const _v = Math.max(Math.min(v, max), min);
      putDpData(
        {
          [dpCodes.numberSetCode]: _v,
        },
        devInfo,
      );
      hasChanged.current = true
      setLightLength(_v);
    },
    [devInfo, max, min],
  );

  const isVirtual = (query.deviceId || '').startsWith('vdevo');

  return (
    <ConfigProvider themeVars={{
      navBarBackgroundColor: 'transparent',
      hairlineColor: 'transparent',
      navBarTitleTextColor: fontColor,
      navBarArrowColor: fontColor
    }}>
      <View className={className.homeWrapper} style={backgroundStyle}>
        <NavBar
          title={i18n.getLang('lscf_functionTitle')}
          leftArrow
          onClickLeft={handleBack}
        ></NavBar>
        {!hiddenBigIcon && <Image src={bg} className={className.bg}></Image>}
        <View className={className.center}>
          {!hiddenBigIcon && <View className={className.padding}></View>}
          <Text
            className={className.tips}
            style={{
              marginTop: hiddenBigIcon ? 20 : '311px',
              color: isDark ? '#fff' : 'rgba(0, 0, 0, 0.4)'
            }}
          >
            {i18n.getLang(isVirtual ? 'lscf_virtualDeviceTips' : 'lscf_tips')}
          </Text>
          <View
            className={className.cardWrapper}
            style={isCanOperate ?
              {
                backgroundColor: isDark ? 'rgba(255,255,255,.05)' : '#fff'
              } : {
                height: '80px',
                backgroundColor: isDark ? 'rgba(255,255,255,.05)' : '#fff'
              }}
          >
            <View className={className.cardTop}>
              <Text style={{ color: fontColor, fontSize: '28rpx' }}>
                {
                  i18n.getLang(hasLength ? 'lscf_cardTitle' : 'lscf_cardTitlePoints')
                }
              </Text>
              <View>
                <Text style={{ color: themeColor, fontSize: '32rpx' }}>{isCanOperate ? valueText : dps?.lightPixel}</Text>
                <Text style={{ color: fontColor, fontSize: '28rpx' }}>{`${isCanOperate ? i18n.getLang('lscf_unitMeter') : i18n.getLang('lscf_pointNum')}`}</Text>
              </View>
            </View>
            {isCanOperate && (
              <>
                <View className={className.cardContent}>
                  <Slider
                    isShowTicks
                    tickWidth="2rpx"
                    tickHeight="20rpx"
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
                    minTrackColor={themeColor}
                    maxTrackTickColor="#fff"
                    maxTrackColor={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                    hideThumbButton
                    onChange={handleChangeSlider}
                    onAfterChange={handleReleaseSlider}
                  />
                </View>
                <View className={`${className.cardBottom}`}>
                  <Text style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '24rpx' }}>{minText}</Text>
                  <Text style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '24rpx' }}>{maxText}</Text>
                </View>
              </>
            )}
          </View>
        </View>
        {isCanOperate && (
          <View className={className.buttonWrapper}>
            <Button onClick={handleBack} bgColor={isDark ? 'rgba(255, 255, 255, .1)' : '#fff'} fontColor={fontColor} fontSize={16}>
              {i18n.getLang('lscf_cancel')}
            </Button>
            <Button bgColor={themeColor} onClick={handleConfirm} fontSize={16}>
              {i18n.getLang('lscf_confirm')}
            </Button>
          </View>
        )}
      </View>
    </ConfigProvider>
  );
};

export default Home;
