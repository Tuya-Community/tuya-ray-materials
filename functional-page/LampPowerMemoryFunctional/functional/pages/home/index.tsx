import React, { useEffect, useMemo, useState } from 'react';
import { ConfigProvider, NavBar, Image as ImageSmart } from '@ray-js/smart-ui';
import { Image, router, View, Text, useQuery } from '@ray-js/ray';
import { useDebounceFn } from 'ahooks';
import { useHideMenuButton } from '@/hooks/useHideMenuButton';
import { getDefaultMemoryMode } from '@/config/default';
import { useStructuredActions, useStructuredProps, useSupport, utils } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import res from '@/res';
import ColorObj from 'color';
import { useDispatch, useSelector } from 'react-redux';
import { useInitPresetData } from '@/hooks/useInitPresetData';
import { sendPowerMemoryFunctionalData } from '../../utils';
import {
  CUSTOM_COLOR_STATIC,
  selectCustomColor,
  updateCustomColor,
} from '../../redux/modules/uiStateSlice';
import { Button } from '../../components';
import Strings from '../../i18n';
import styles from './index.module.less';
import { backMini } from 'src/utils/backMini';

const { hsv2rgbString, brightKelvin2rgb } = utils;

const Home = () => {
  const powerMemory = useStructuredProps(props => props[dpCodes.power_memory]);
  const support = useSupport();
  const dpActions = useStructuredActions();
  const presetData = useInitPresetData(powerMemory);
  const { themeColor = '#39A9FF', fontColor = 'white', background = 'black' } = presetData || {};
  const cardBackground = new ColorObj(fontColor).alpha(0.1).toString();
  const cardActiveBackground = new ColorObj(fontColor).alpha(0.05).toString();
  const descFontColor = new ColorObj(fontColor).alpha(0.5).toString();
  useHideMenuButton();
  const dispatch = useDispatch();
  const [mode, setMode] = useState(powerMemory?.mode !== undefined ? `${powerMemory.mode}` : '1');
  const customColor = useSelector(selectCustomColor);
  const handleBack = () => {
    sendPowerMemoryFunctionalData('cancel', undefined);
    presetData.dynamicDistribute && dpActions.power_memory.set(powerMemory);
    backMini()
  };

  useEffect(() => {
    if (!customColor) return;
    const tabs = [];
    if (support.isSupportTemp() || support.isSupportBright()) {
      tabs.push('white');
    }
    if (support.isSupportColour()) {
      tabs.push('colour');
    }
    if (tabs.length === 1 && !tabs.includes(customColor.colorMode)) {
      dispatch(updateCustomColor({ ...customColor, colorMode: tabs[0] }));
    }
  }, [customColor]);

  useEffect(() => {
    setMode(powerMemory?.mode !== undefined ? `${powerMemory.mode}` : '1');
  }, [powerMemory]);

  const handleEdit = () => {
    setMode('2');
    let path = '../customColor';
    if (query?.bgImgUrl) {
      path += `?bgImgUrl=${query?.bgImgUrl}`;
    }
    router.push(path);
  };

  const handleSave = useDebounceFn(
    () => {
      const { colorMode, hue, saturation, value, brightness, temperature } = customColor;
      let newColor: typeof customColor;
      if (colorMode === 'white') {
        newColor = { brightness, temperature, hue: 0, saturation: 0, value: 0, colorMode };
      } else {
        newColor = { brightness: 0, temperature: 0, hue, saturation, value, colorMode };
      }
      const newMemory = {
        version: 0,
        mode: +mode,
        ...newColor,
      };
      dpActions.power_memory.set(newMemory, { checkRepeat: false });
      sendPowerMemoryFunctionalData(
        'save',
        colorMode === 'white'
          ? { colorMode, brightness, temperature }
          : { colorMode, hue, saturation, value }
      );
      setTimeout(() => {
        // 恢复初始化数据
        dispatch(updateCustomColor({ ...CUSTOM_COLOR_STATIC }));
      }, 500);
      backMini()
    },
    { wait: 100 }
  ).run;

  const query = useQuery();

  const isUseBgImg = !!query?.bgImgUrl;

  const style = useMemo<React.CSSProperties>(
    () =>
      query?.bgImgUrl
        ? {
            backgroundImage: `url("${decodeURIComponent(query.bgImgUrl)}")`,
            backgroundColor: 'transparent',
            backgroundSize: 'cover',
            '--nav-bar-background-color': 'transparent',
            color: fontColor,
            ...(presetData?.bgStyle ?? {}),
          }
        : {
            background: presetData?.background,
            color: fontColor,
            ...(presetData?.bgStyle ?? {}),
          },
    [query?.bgImgUrl, presetData]
  );
  return (
    <ConfigProvider
      themeVars={{
        navBarBackgroundColor: background || '#0b0909',
        navBarTitleTextColor: fontColor || 'white',
        navBarArrowColor: fontColor || 'white',
        hairlineColor: 'rgba(255, 255, 255, 0.1)',
        navBarTextColor: themeColor || 'rgb(16, 130, 254)',
        ...(presetData?.smartUIThemeVars || {}),
      }}
    >
      <View className={styles.view} style={style}>
        <NavBar
          title={Strings.getLang('lpmf_powerMemory')}
          rightText={Strings.getLang('lpmf_save')}
          leftArrow
          onClickLeft={handleBack}
          onClickRight={handleSave}
        />
        <View className={styles.detail_view}>
          <Text
            className={styles.detail}
            style={{
              color: fontColor,
            }}
          >
            {Strings.getLang('lpmf_powerMemory_desc')}
          </Text>
        </View>
        <View
          className={styles.box}
          style={{
            background: cardBackground,
            ...(presetData?.cardStyle || {}),
          }}
        >
          {getDefaultMemoryMode().map(item => {
            const isActive = mode === item.mode;
            const { colorMode, brightness, temperature, hue, saturation, value } = customColor;
            const bg =
              colorMode === 'white'
                ? brightKelvin2rgb(brightness, temperature, { kelvinMin: 4000, kelvinMax: 8000 })
                : hsv2rgbString(hue, saturation / 10, value / 10);
            return (
              <View
                key={item.mode}
                style={{
                  backgroundColor: isUseBgImg
                    ? isActive
                      ? '#3938387f'
                      : 'transparent'
                    : isActive
                    ? cardActiveBackground
                    : 'transparent',
                  ...(presetData?.tabLineStyle || {}),
                  ...(isActive ? presetData?.tabLineActiveStyle || {} : {}),
                }}
              >
                <Button
                  className={styles.row}
                  style={{
                    borderBottom: `1px solid ${item.mode === '2' ? 'transparent' : cardBackground}`,
                  }}
                  onClick={() => {
                    setMode(item.mode);
                  }}
                >
                  {item.icon ? (
                    <Image className={styles.icon} src={item.icon} />
                  ) : (
                    <View
                      className={styles.icon}
                      style={{
                        backgroundColor: bg,
                        border: `1px solid ${cardBackground}`,
                        borderRadius: 28,
                      }}
                    />
                  )}
                  <View className={styles.colBox}>
                    <Text
                      className={styles.title}
                      style={{
                        color: fontColor,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      className={styles.desc}
                      style={{
                        color: descFontColor,
                      }}
                    >
                      {item.desc}
                    </Text>
                  </View>
                  {item.mode === '2' && (
                    <Button className={styles.editBtn} onClick={handleEdit}>
                      <ImageSmart
                        width="48rpx"
                        height="48rpx"
                        showLoading={false}
                        className={styles.editIcon}
                        src={res.icon_edit}
                        tintColor={fontColor}
                      />
                    </Button>
                  )}
                </Button>
              </View>
            );
          })}
        </View>
      </View>
    </ConfigProvider>
  );
};

export default Home;
