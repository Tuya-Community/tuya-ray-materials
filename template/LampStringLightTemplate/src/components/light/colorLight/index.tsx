/* eslint-disable no-lonely-if */
import React, { useMemo, useState } from 'react';
import { View } from '@ray-js/ray';
import { useStructuredProps } from '@ray-js/panel-sdk';
import { pushHalf } from '@/utils/pushHalf';
import ColorSelectorCircleList from '@/components/color-selector-circle-list';
import Strings from '@/i18n';
import { WORK_MODE } from '@/types';
import { useSegmentNum } from '@/hooks/useSegmentNum';
import { useCloudStorageKey } from '@/hooks/useCloudStorageKey';
import { useSelector } from '@/redux';

import { BrightSlider } from '../../bright-slider';
import { ColorSlider } from '../../color-slider';
import { MyColors } from '../../my-colors';
import styles from './index.module.less';

type HSV = {
  h: number;
  s: number;
  v: number;
};

type HSVFull = {
  hue: number;
  saturation: number;
  value: number;
  id?: number;
};

type TProps = {
  data: any[];
  hsvFull: HSVFull;
  isMoving: boolean;
  onMovingChange: (isMoving: boolean) => void;
  onColorChange: (hsvFull: HSVFull, mode: WORK_MODE) => void;
};

const ColorLight = (props: TProps) => {
  const { hsvFull, data = [], onColorChange, onMovingChange } = props;

  const { value: colorData, setValue } = useCloudStorageKey('tmp_color_dt');
  const stripCheckAll = useSelector(state => state.common.stripCheckAll);
  const checkedIdList = useSelector(state => state.common.checkedIdList);
  const checkedSet = new Set(checkedIdList);

  const paint_colour_data = useStructuredProps(props => {
    if (props?.paint_colour_1?.dimmerMode === 1) {
      return props.paint_colour_1;
    }
    if (typeof props.colour_data === 'object') {
      const paint_colour_data = props?.paint_colour_1;
      if (paint_colour_data) {
        paint_colour_data.hue = +props.colour_data.hue;
        paint_colour_data.saturation = +props.colour_data.saturation;
        paint_colour_data.value = +props.colour_data.value;
        return paint_colour_data;
      }
    }
  });

  const handleMovingChange = (isMoving: boolean) => {
    return () => {
      if (checkedSet.size === 0 && !isSectionAll) {
        return;
      }
      onMovingChange && onMovingChange(isMoving);
    };
  };

  const handleBrightAfterChange = value => {
    if (checkedSet.size === 0 && !isSectionAll) {
      ty.showToast({
        title: Strings.getLang('checkLightTip'),
        icon: 'none',
      });
      return;
    }
    onMovingChange && onMovingChange(false);
    const hsvFull = {
      hue: paint_colour_data?.hue,
      saturation: paint_colour_data?.saturation,
      value,
    };
    setCurrentHsv({
      h: hsvFull.hue,
      s: hsvFull.saturation,
      v: hsvFull.value,
    });
    onColorChange && onColorChange(hsvFull, WORK_MODE.colour);
  };

  const hsv = useMemo(
    () => ({
      h: hsvFull?.hue,
      s: hsvFull?.saturation,
      v: hsvFull?.value,
      id: hsvFull?.id,
    }),
    [hsvFull]
  );

  const lightStripDataList = data;

  const isSectionAll = stripCheckAll;

  const segmentNumber = useSegmentNum();

  const [currentHsv, setCurrentHsv] = useState<HSV>(hsv);

  // 点击彩光收藏颜色
  const onCollectClickHsv = (_hsv: HSV) => {
    if (checkedSet.size === 0 && !isSectionAll) {
      ty.showToast({
        title: Strings.getLang('checkLightTip'),
        icon: 'none',
      });
      return;
    }
    // 全段控制时下发 全选dp
    setCurrentHsv(_hsv);
    onColorChange &&
      onColorChange(
        {
          hue: _hsv.h,
          saturation: _hsv.s,
          value: _hsv.v,
        },
        WORK_MODE.colour
      );
  };

  if (!segmentNumber || !lightStripDataList) {
    return <View style={{ minHeight: '50vh', backgroundColor: '#191919' }} />;
  }
  return (
    <View className={styles.colorLight}>
      <ColorSelectorCircleList hsv={currentHsv} onChangeHsv={onCollectClickHsv} />
      <View className={styles.topContain}>
        <BrightSlider
          eventName="SliderColorV"
          value={paint_colour_data?.value}
          valueScale={1 / 10}
          onBeforeChange={handleMovingChange(true)}
          onAfterChange={handleBrightAfterChange}
        />
        <ColorSlider
          onBeforeChange={handleMovingChange(true)}
          onAfterChange={handleMovingChange(false)}
          hs={[paint_colour_data?.hue, paint_colour_data?.saturation]}
          onHSChange={hs => {
            if (checkedSet.size === 0 && !isSectionAll) {
              ty.showToast({
                title: Strings.getLang('checkLightTip'),
                icon: 'none',
              });
              return;
            }
            const hsvFull = {
              value: paint_colour_data?.value,
              hue: hs[0],
              saturation: hs[1],
            };
            setValue(`${hsvFull.hue},${hsvFull.saturation},${hsvFull.value}`);
            setCurrentHsv({
              h: hsvFull.hue,
              s: hsvFull.saturation,
              v: hsvFull.value,
            });
            onColorChange && onColorChange(hsvFull, WORK_MODE.colour);
          }}
        />
      </View>
      <View className={styles.listContain}>
        <MyColors
          selectable
          isSelected={(color, id) => color && hsv && id === hsv?.id}
          onAdd={() => {
            pushHalf('/addColor');
          }}
          onEdit={item => {
            pushHalf(`/addColor?dataId=${item.id}`);
          }}
          onClick={(hs, id) => {
            console.log('🚀 ~ index ~ hs:', hs);
            const hsvFull = {
              value: hs?.v,
              hue: hs?.h,
              saturation: hs?.s,
              id,
            };
            setValue(`${hsvFull.hue},${hsvFull.saturation},${hsvFull.value}`);
            onColorChange && onColorChange(hsvFull, WORK_MODE.colour);
          }}
        />
      </View>
    </View>
  );
};

export default ColorLight;
