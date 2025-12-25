import React, { useMemo } from 'react';
import { View, getLaunchOptionsSync } from '@ray-js/ray';
import { useActions, useProps, useStructuredProps, utils } from '@ray-js/panel-sdk';
import { lampSchemaMap } from '@/devices/schema';
import { pushHalf } from '@/utils/pushHalf';
import { WORK_MODE } from '@/types';

import { useSelector } from '@/redux';
import Strings from '@/i18n';
import { BrightSlider } from '../../bright-slider';
import { TempColors } from '../../temp-colors';
import { TempSlider } from '../../temp-slider';
import styles from './index.module.less';

const { hsv2rgbString } = utils;

enum Road {
  road1 = 'road1',
  road2 = 'road2',
  road3 = 'road3',
  road4 = 'road4',
  road5 = 'road5',
}

type BT = {
  b: number;
  t: number;
};

/** 调光器模式 */
enum DimmerMode {
  white,
  colour,
  colourCard,
  combination,
}

type TProps = {
  temperature: number;
  bright: number;
  road: Road;
  onMovingChange: (_isMoving: boolean) => void;
  onColorChange: (bt: { bright: number; temperature: number }, mode: WORK_MODE) => void;
};

/** 涂抹类型 */
enum SmearMode {
  all,
  single,
  clear,
}

const isGroupDevice = !!getLaunchOptionsSync()?.query?.groupId;

const WhiteLight = (props: TProps) => {
  const { road, onColorChange, onMovingChange } = props;
  const _temperature = useProps(p => p.temp_value) ?? 1000;
  const _bright = useProps(p => p.bright_value) ?? 1000;
  const paintColorData = useStructuredProps(p => p.paint_colour_1);
  const { temperature: paintTemperature = 1000, brightness: paintBright = 1000 } =
    paintColorData ?? {};

  const { temperature, bright } = useMemo(() => {
    if (typeof paintTemperature === 'number' || typeof paintBright === 'number') {
      return {
        temperature: paintTemperature,
        bright: paintBright,
      };
    }
    return {
      temperature: _temperature,
      bright: _bright,
    };
  }, [_temperature, _bright, paintTemperature, paintBright, isGroupDevice]);

  const actions = useActions();
  const stripCheckAll = useSelector(state => state.common.stripCheckAll);
  const isSectionAll = stripCheckAll;

  const checkedIdList = useSelector(state => state.common.checkedIdList);

  const checkedSet = new Set(checkedIdList);
  const handleMovingChange = (_isMoving: boolean) => {
    return () => {
      onMovingChange && onMovingChange(_isMoving);
    };
  };

  const handleTempAfterChange = () => {
    return value => {
      if (checkedSet.size === 0 && !isSectionAll) {
        ty.showToast({
          title: Strings.getLang('checkLightTip'),
          icon: 'none',
        });
        return;
      }
      onMovingChange && onMovingChange(false);
      onColorChange && onColorChange({ bright, temperature: value }, WORK_MODE.white);
    };
  };

  const handleBrightAfterChange = () => {
    return value => {
      if (checkedSet.size === 0 && !isSectionAll) {
        ty.showToast({
          title: Strings.getLang('checkLightTip'),
          icon: 'none',
        });
        return;
      }
      onMovingChange && onMovingChange(false);
      onColorChange && onColorChange({ bright: value, temperature }, WORK_MODE.white);
    };
  };
  const isSupportTemp = road === Road.road5 || road === Road.road2;
  return (
    <View className={styles.whiteLight}>
      <View className={styles.topContain}>
        {isSupportTemp && (
          <TempSlider
            min={lampSchemaMap?.temp_value?.property?.min ?? 1}
            max={lampSchemaMap?.temp_value?.property?.max ?? 1000}
            eventName="SliderTemp"
            onBeforeChange={handleMovingChange(true)}
            value={temperature}
            onAfterChange={handleTempAfterChange()}
          />
        )}
        <BrightSlider
          min={lampSchemaMap?.bright_value?.property?.min ?? 10}
          max={lampSchemaMap?.bright_value?.property?.max ?? 1000}
          valueScale={1 / 10}
          eventName="SliderBright"
          onBeforeChange={handleMovingChange(true)}
          value={bright}
          onAfterChange={handleBrightAfterChange()}
        />
      </View>
      {isSupportTemp && (
        <View className={styles.listContain}>
          <TempColors
            onAdd={() => {
              pushHalf('/addTemp');
            }}
            onEdit={item => {
              pushHalf(`/addTemp?dataId=${item.id}`);
            }}
            onClick={temp => {
              actions.temp_value.set(temp);
              actions.work_mode.set('white');
            }}
          />
        </View>
      )}
    </View>
  );
};

export default WhiteLight;
