import React, { useEffect, useState } from 'react';
import { router, Text, View } from '@ray-js/ray';
import {
  useActions,
  useProps,
  useStructuredActions,
  useStructuredProps,
  useSupport,
} from '@ray-js/panel-sdk';
import { useThrottleFn } from 'ahooks';
import Strings from '../../i18n';
import { useHideMenuButton } from '../../hooks/useHideMenuButton';
import { ConfigProvider, NavBar, Stepper } from '@ray-js/smart-ui';
import styles from './index.module.less';
import { dpCodes } from '../../config/dpCodes';
import { useLampMutationPresetData } from '../../utils';
import { ThemeVars } from '@ray-js/smart-ui/dist/@types/config-provider/theme-vars';

const { switch_gradient, white_gradi_time, colour_gradi_time } = dpCodes;

interface PresetData {
  bgStyle?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
  cardTitleStyle?: React.CSSProperties;
  cardUnitStyle?: React.CSSProperties;
  descStyle?: React.CSSProperties;
  descArrowStyle?: React.CSSProperties
  smartUIThemeVars?: Partial<ThemeVars>;
  splitLineColor?: string
}

const SwitchGradient = () => {
  const support = useSupport();
  const dpActions = useActions();
  const dpStructuredActions = useStructuredActions();
  const switchGradient = useStructuredProps(props => props[switch_gradient]);
  const toningGradient = useProps(props => props[white_gradi_time]);
  const dimmingGradient = useProps(props => props[colour_gradi_time]);
  const [gradientState, setGradientState] = useState({
    on: 0,
    off: 0,
    [white_gradi_time]: 0,
    [colour_gradi_time]: 0,
  });

  const presetData: PresetData = useLampMutationPresetData()

  useHideMenuButton();

  useEffect(() => {
    setGradientState({
      on: switchGradient?.on ?? 0,
      off: switchGradient?.off ?? 0,
      [white_gradi_time]: toningGradient ?? 0,
      [colour_gradi_time]: dimmingGradient ?? 0,
    });
  }, [switchGradient, toningGradient, dimmingGradient]);

  const handleBack = React.useCallback(() => {
    router.back();
  }, []);

  const gradientConfig = ([white_gradi_time, colour_gradi_time] as const).filter(item =>
    support.isSupportDp(item)
  );
  const switchGradientState = ['on', 'off'] as const;

  const handleGradientChange = (key, value) => {
    const newGradientData = { ...gradientState };
    newGradientData[key] = value;
    setGradientState(newGradientData);
  };

  const handleSave = useThrottleFn(
    () => {
      if (support.isSupportDp(switch_gradient)) {
        const { on, off } = gradientState;
        dpStructuredActions.switch_gradient.set({ version: 0, on, off }, { throttle: 300 });
      }
      if (support.isSupportDp(white_gradi_time)) {
        dpActions.white_gradi_time.set(gradientState[white_gradi_time], { throttle: 300 });
      }
      if (support.isSupportDp(colour_gradi_time)) {
        dpActions.colour_gradi_time.set(gradientState[colour_gradi_time], { throttle: 300 });
      }
      router.back();
    },
    { wait: 100 }
  ).run;

  return (
    <ConfigProvider
        themeVars={{
          navBarBackgroundColor: 'black',
          navBarTextColor: 'rgb(16, 130, 254)',
          navBarTitleTextColor: 'white',
          stepperBackgroundColor: 'rgba(255,255,255,.1)',
          stepperButtonIconColor: 'rgba(255,255,255,.5)',
          stepperInputTextColor: 'white',
          stepperActiveColor: 'rgba(255,255,255,0)',
          navBarArrowColor: 'white',
          hairlineColor: 'rgba(255,255,255, .2)',
          ...(presetData.smartUIThemeVars || {})
        }}
      >
      
      <View className={styles.view} style={presetData.bgStyle}>
        <NavBar
          title={Strings.getLang('lmf_gradientSetting')}
          rightText={Strings.getLang('lmf_save')}
          leftArrow
          onClickLeft={handleBack}
          onClickRight={handleSave}
        />
        <View className={styles.scroll}>
          {support.isSupportDp(switch_gradient) && (
            <View className={styles.box} style={presetData.cardStyle}>
              {switchGradientState.map((item) => (
                <View
                  className={styles.singleSwitch}
                  key={item}
                  style={{
                    padding: item === 'on' ? '44rpx 32rpx 0' :'44rpx 32rpx'
                  }}
                >
                  <View
                    style={{
                      borderBottom: `1px solid ${
                        item === 'on' ? presetData.splitLineColor || 'rgba(255,255,255,.1)' : 'transparent'
                        }`,
                      paddingBottom: item === 'on' ? '52rpx' : ''
                    }}
                  >
                    <View className={styles.row}>
                      <View>
                        <Text className={styles.subTitle} style={presetData.cardTitleStyle}>
                          {Strings.getLang(`lmf_switchGradient_${item}`)}
                        </Text>
                        <Text className={styles.unit} style={presetData.cardUnitStyle}>{Strings.getLang('lmf_gradient_unit')}</Text>
                      </View>
                      <Stepper
                        value={switchGradient?.[item]}
                        step={200}
                        max={60000}
                        min={0}
                        onChange={v => handleGradientChange(item, v.detail)}
                      />
                    </View>
                    <View className={styles.arrow_box}>
                      <View className={styles.arrow} style={presetData.descArrowStyle} />
                    </View>
                    <View className={styles.desc} style={presetData.descStyle}>
                      {Strings.getLang(`lmf_switchGradient_${item}_desc`)}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
          {(gradientConfig).map((item: 'white_gradi_time' | 'colour_gradi_time') => (
            <View key={item} className={styles.box} style={{ marginTop: 16, ...(presetData.cardStyle || {}) }}>
              <View className={styles.singleSwitch}>
                <View className={styles.row}>
                  <View>
                    <Text className={styles.subTitle} style={presetData.cardTitleStyle}>{Strings.getLang(`lmf_${item}`)}</Text>
                    <Text className={styles.unit} style={presetData.cardUnitStyle}>{Strings.getLang('lmf_gradient_unit')}</Text>
                  </View>
                  <Stepper
                    step={200}
                    max={10000}
                    min={0}
                    value={gradientState[item]}
                    onChange={v => handleGradientChange(item, v.detail)}
                  />
                </View>
                <View className={styles.arrow} style={presetData.descArrowStyle} />
                <View className={styles.desc} style={presetData.descStyle}>{Strings.getLang(`lmf_${item}_desc`)}</View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ConfigProvider>
  );
};

export default SwitchGradient;
