/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { router, usePageInstance, useQuery, View } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { useThrottleFn } from 'ahooks';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { Dimmer } from '@/components';
import { useHideMenuButton } from '@/hooks/useHideMenuButton';
import { useAppDispatch } from '@/redux';
import {
  selectCustomColor,
  selectStyleData,
  updateCustomColor,
} from '@/redux/modules/uiStateSlice';
import { ConfigProvider, NavBar } from '@ray-js/smart-ui';
import dpCodes from '@/config/dpCodes';
import ColorObj from 'color';
import { useStructuredActions } from '@ray-js/panel-sdk';
import styles from './index.module.less';
import { backMini } from 'src/utils/backMini';

export function CustomColor() {
  const dispatch = useAppDispatch();
  const dpActions = useStructuredActions();
  const customColor = useSelector(selectCustomColor);
  const {
    themeColor = '#39A9FF',
    fontColor = 'white',
    background = 'black',
    bgStyle,
    collectBorderColor,
    smartUIThemeVars,
    dynamicDistribute,
    cardStyle,
  } = useSelector(selectStyleData);
  const [newCustomColor, setNewCustomColor] = useState(customColor);
  const cardBackground = new ColorObj(fontColor).alpha(0.1).toString();
  useHideMenuButton(true);
  useEffect(() => {
    setNewCustomColor(customColor);
  }, [customColor]);

  const handleBack = React.useCallback(() => {
    backMini();
  }, []);

  const handleColorRelease = React.useCallback(
    (key: string, value: COLOUR | number) => {
      let result: typeof newCustomColor;
      if (key === dpCodes.colour_data) {
        result = { ...newCustomColor, ...(value as COLOUR) };
      } else if (key === dpCodes.bright_value) {
        result = { ...newCustomColor, brightness: value as number };
      } else {
        result = { ...newCustomColor, temperature: value as number };
      }
      setNewCustomColor(result);
      if (!dynamicDistribute) return;
      dpActions.control_data.set({
        ...result,
        brightness: undefined,
      });
    },
    [newCustomColor]
  );

  const handleWhiteRelease = React.useCallback(
    (value: any) => {
      const result = {
        ...newCustomColor,
        brightness: value[dpCodes.bright_value],
        temperature: value[dpCodes.temp_value],
      };
      setNewCustomColor(result);
      if (!dynamicDistribute) return;
      dpActions.control_data.set(result);
    },
    [newCustomColor]
  );

  const handlePowerModeChange = React.useCallback(
    (mode: string) => {
      if (mode !== 'colour' && mode !== 'white') return;
      // 断电记忆切换白彩光
      setNewCustomColor({ ...newCustomColor, colorMode: mode });
    },
    [newCustomColor]
  );

  const handleSave = React.useCallback(() => {
    backMini();
    const { colorMode, hue, saturation, value, brightness, temperature } = newCustomColor;
    const newColor =
      colorMode === 'white'
        ? { brightness, temperature, colorMode }
        : { hue, saturation, value, colorMode };
    dispatch(updateCustomColor(newColor));
  }, [newCustomColor]);

  const handleColorChange = useThrottleFn(
    (isColor: boolean, v: any) => {
      console.log(isColor, v, '--v');
      setNewCustomColor({ ...newCustomColor, ...v, colorMode: isColor ? 'colour' : 'white' });
      if (!dynamicDistribute) return;
      dpActions.control_data.set(
        {
          ...v,
        },
        {
          throttle: 400,
        }
      );
    },
    { wait: 80 }
  ).run;

  const query = useQuery();
  const isUseBgImg = !!query?.bgImgUrl;

  const style = useMemo<React.CSSProperties>(
    () =>
      query.bgImgUrl
        ? {
            backgroundImage: `url("${decodeURIComponent(query.bgImgUrl)}")`,
            backgroundColor: 'transparent',
            backgroundSize: 'cover',
            '--nav-bar-background-color': 'transparent',
            color: fontColor,
            ...(bgStyle ?? {}),
          }
        : {
            background,
            color: fontColor,
            ...(bgStyle ?? {}),
          },
    [query?.bgImgUrl, fontColor, bgStyle]
  );
  console.log(`[query style]`, query, style);

  return (
    <ConfigProvider
      themeVars={{
        navBarBackgroundColor: background || '#0b0909',
        navBarTitleTextColor: fontColor || 'white',
        navBarArrowColor: fontColor || 'white',
        hairlineColor: cardBackground || 'rgba(255, 255, 255, 0.1)',
        navBarTextColor: themeColor || 'rgb(16, 130, 254)',
        ...(smartUIThemeVars || {}),
      }}
    >
      <View className={styles.view} style={style}>
        <NavBar
          title={Strings.getLang('lpmf_customMemory')}
          rightText={Strings.getLang('lpmf_save')}
          leftArrow
          onClickLeft={handleBack}
          onClickRight={handleSave}
        />
        <Dimmer
          showTitle={false}
          style={{
            marginTop: 48,
            background: cardBackground,
            ...(isUseBgImg
              ? {
                  backgroundColor: 'transparent',
                }
              : {}),
            ...(cardStyle || {}),
          }}
          mode={newCustomColor?.colorMode}
          fontColor={fontColor}
          themeColor={themeColor}
          background={background}
          collectBorderColor={collectBorderColor}
          validWorkMode={['white', 'colour']}
          onModeChange={handlePowerModeChange}
          colour={{
            hue: newCustomColor?.hue,
            saturation: newCustomColor?.saturation,
            value: newCustomColor?.value,
          }}
          brightness={newCustomColor?.brightness}
          temperature={newCustomColor?.temperature}
          onChange={handleColorChange}
          onRelease={handleColorRelease}
          onReleaseWhite={handleWhiteRelease}
        />
      </View>
    </ConfigProvider>
  );
}

export default React.memo(CustomColor);
