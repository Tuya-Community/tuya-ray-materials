import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { utils, useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';
import { Image, Text, View, router } from '@ray-js/ray';
import { useDebounceFn } from 'ahooks';
import { lampSchemaMap } from '@/devices/schema';
import { Button } from '@/components';
import Strings from '@/i18n';
import defaultConfig from '@/config/default';
import { useHideMenuButton } from '@/hooks/useHideMenuButton';
import { selectCustomColor, updateCustomColor } from '@/redux/modules/uiStateSlice';
import { useAppDispatch } from '@/redux';
import { NavBar } from '@ray-js/smart-ui';
import styles from './index.module.less';

const { power_memory } = lampSchemaMap;
const { defaultMemoryMode } = defaultConfig;
const { hsv2rgbString, brightKelvin2rgb } = utils;

export function PowerMemory() {
  const dispatch = useAppDispatch();
  const dpActions = useStructuredActions();
  const powerMemory = useStructuredProps(props => props[power_memory.code]);
  const [mode, setMode] = useState(`${powerMemory?.mode ?? 1}`);
  const customColor = useSelector(selectCustomColor);

  useHideMenuButton();
  useEffect(() => {
    if (powerMemory) {
      const { brightness, temperature, hue, saturation, value } = powerMemory;
      dispatch(updateCustomColor({ brightness, temperature, hue, saturation, value }));
    }
    setMode(`${powerMemory?.mode}`);
  }, [powerMemory]);

  const handleBack = React.useCallback(() => {
    router.back();
  }, []);

  const handleEdit = React.useCallback(() => {
    setMode('2');
    router.push('/customColor');
  }, []);

  const handleSave = useDebounceFn(
    () => {
      const newMemory = {
        version: 0,
        mode: +mode,
        ...customColor,
      };
      dpActions.power_memory.set(newMemory, { checkRepeat: false });
      router.back();
    },
    { wait: 100 }
  ).run;

  return (
    <View className={styles.view}>
      <NavBar
        title={Strings.getLang('powerMemory')}
        rightText={Strings.getLang('save')}
        leftArrow
        onClickLeft={handleBack}
        onClickRight={handleSave}
      />
      <View style={{ marginTop: 48, marginBottom: 16 }}>
        <Text className={styles.detail}>{Strings.getLang('powerMemory_desc')}</Text>
      </View>
      <View className={styles.box}>
        {defaultMemoryMode.map(item => {
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
                backgroundColor: isActive ? '#393838' : '#232222',
              }}
            >
              <Button
                className={styles.row}
                style={{
                  borderBottom: `1px solid ${item.mode === '2' ? 'transparent' : '#393838'}`,
                }}
                onClick={() => {
                  setMode(item.mode);
                }}
              >
                {item.mode !== '2' ? (
                  <Image className={styles.icon} src={item.icon} />
                ) : (
                  <View
                    className={styles.icon}
                    style={{
                      backgroundColor: bg,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 28,
                    }}
                  />
                )}
                <View className={styles.colBox}>
                  <Text className={styles.title}>{item.title}</Text>
                  <Text className={styles.desc}>{item.desc}</Text>
                </View>
                {item.mode === '2' && (
                  <Button className={styles.editBtn} onClick={handleEdit}>
                    <Image className={styles.editIcon} src="/images/icon_edit.png" />
                  </Button>
                )}
              </Button>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default PowerMemory;
