/*
 * @Author: mjh
 * @Date: 2024-08-31 17:49:55
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-14 17:02:24
 * @Description:
 */
import { View, Text, Image, ScrollView } from '@ray-js/ray';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import res from '@/res';
import PointLightBelt from '@/components/point-light-belt';
import Strings from '@/i18n';
import { ActivePanel } from '@/components/active-panel';
import classnames from 'classnames';
import { Slider } from '@ray-js/smart-ui';
import { rpx2px } from '@/utils/utils';
import { useScrollControl } from '@/hooks/useScrollControl';
import { throttle } from 'lodash-es';
import styles from './index.module.less';

/** 涂抹类型 */
enum SmearMode {
  all,
  single,
  clear,
}

interface SmearLightProps {
  lightColorMaps: any;
  mode: SmearMode;
  size?: 'default' | 'small';
  bright: number;
  showControl?: boolean;
  maxSelect?: number;
  showClear?: boolean;
  selectList?: number[];
  style?: React.CSSProperties;
  eventChannelName?: string;
  onClear?: () => void;
  onCancelSelect?: () => void;
  onModeChange?: (v: SmearMode) => void;
  onSelectChange: (lightSet: Set<number>) => void;
  onSetLightPixelNumber?: () => void;
  onChannel?: (e: { type: string; data: any[] }) => void;
  lightPixelNumber: number;
}

export const SmearLight = (props: SmearLightProps) => {
  const {
    onChannel,
    lightColorMaps,
    mode,
    bright,
    style,
    showControl,
    onClear,
    eventChannelName,
    showClear = true,
    selectList,
    size = 'default',
    maxSelect = 20, // 最大选择限制
    onModeChange,
    onSelectChange,
    onCancelSelect,
    lightPixelNumber,
    onSetLightPixelNumber,
  } = props;

  const showClearSelect = !!selectList.length && mode === SmearMode.single;
  const [showTips, setShowTips] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(null);

  const onMaxSelectTrigger = () => {
    if (showTips) {
      setTimer();
      return;
    }
    setShowTips(true);
    setTimer();
  };
  const setTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowTips(false);
    }, 2000);
  };

  const showVertical = useMemo(() => {
    return lightPixelNumber >= 24;
  }, [lightPixelNumber]);

  const { enableScroll, disableScroll } = useScrollControl();

  const [sliderValue, setSliderValue] = useState(100);

  const onHandleEndSlider = (value: number) => {
    enableScroll();
  };

  const onHandleStartSlider = (value: number) => {
    disableScroll();
  };

  const sliderTrackHeight = useMemo(() => {
    return rpx2px(390);
  }, []);

  useEffect(() => {
    setSliderValue(100);
  }, [lightPixelNumber]);

  return (
    <View
      className={classnames(styles.light_belt_box, {
        [styles.light_belt_box_small]: size === 'small',
      })}
      style={style}
    >
      <View
        className={classnames(styles.smear_box, {
          [styles.smear_box_show]: lightColorMaps,
        })}
      >
        <View
          className={classnames(styles.smear_max_tips, {
            [styles.smear_max_tips_show]: showTips,
          })}
        >
          {Strings.getLang('selectMaxNew')}
        </View>
        {lightColorMaps && (
          <View className={styles.point_smear_box}>
            <PointLightBelt
              eventChannelName={eventChannelName}
              bright={bright}
              length={lightPixelNumber}
              mode={mode as any}
              maxSelect={maxSelect}
              lightColorMaps={lightColorMaps}
              selectList={selectList}
              onSelectChange={onSelectChange}
              onMaxSelectTrigger={onMaxSelectTrigger}
              onChannel={onChannel}
              instanceId={eventChannelName}
              eventSliderMoveName="lightSliderMove"
            />
            {showVertical && (
              <Slider
                style={{ marginLeft: rpx2px(20) }}
                isVertical
                min={0}
                max={100}
                onBeforeChange={onHandleStartSlider}
                onAfterChange={onHandleEndSlider}
                maxTrackHeight={sliderTrackHeight}
                moveEventName="lightSliderMove"
                value={sliderValue}
                minTrackColor="transparent"
                thumbColor="transparent"
                thumbHeight={rpx2px(60)}
                thumbWidth={rpx2px(33)}
                thumbStyle={{
                  backgroundImage: `var(--slider-thumb-point)`,
                  backgroundSize: '100% 100%',
                  borderRadius: '0px',
                }}
                trackStyle={{
                  borderRadius: rpx2px(12),
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }}
              />
            )}
          </View>
        )}
      </View>
      <View className={styles.smear_control}>
        <View className={styles.smear_control_item}>
          {showClearSelect && (
            <>
              <ActivePanel className={styles.smear_control_panel} onClick={onCancelSelect}>
                <Image className={styles.smear_control_img} src={res.cancel} />
              </ActivePanel>
              <Text>{Strings.getLang('cancelSelect')}</Text>
            </>
          )}
        </View>
        {showControl && (
          <View className={styles.smear_control_right}>
            {onSetLightPixelNumber && (
              <View className={styles.smear_control_item}>
                <ActivePanel className={styles.smear_control_panel} onClick={onSetLightPixelNumber}>
                  <Text className={styles.led_num_text}>{lightPixelNumber}</Text>
                </ActivePanel>
                <Text>{Strings.getLang('number')}</Text>
              </View>
            )}
            {showClear && (
              <View className={styles.smear_control_item}>
                <ActivePanel className={styles.smear_control_panel} onClick={onClear}>
                  <Image className={styles.smear_control_img} src={res.clear} />
                </ActivePanel>
                <Text>{Strings.getLang('clear')}</Text>
              </View>
            )}
            <View
              className={styles.smear_control_panel}
              style={{
                height: '38px',
                padding: '3px',
                width: 'auto',
              }}
            >
              <View className={styles.smear_control_item} style={{ marginRight: 16 }}>
                <ActivePanel
                  onClick={() => onModeChange(SmearMode.all)}
                  style={{
                    background: mode === SmearMode.all ? '#0D84FF' : 'transparent',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Image className={styles.smear_control_img} src={res.all} />
                </ActivePanel>
                <Text
                  className={styles.panel_text}
                  style={
                    mode === SmearMode.all
                      ? {
                          color: '#0D84FF',
                        }
                      : {}
                  }
                >
                  {Strings.getLang('all')}
                </Text>
              </View>
              <View className={styles.smear_control_item}>
                <ActivePanel
                  onClick={() => onModeChange(SmearMode.single)}
                  style={{
                    background: mode === SmearMode.single ? '#0D84FF' : 'transparent',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Image className={styles.smear_control_img} src={res.single} />
                </ActivePanel>
                <Text
                  className={styles.panel_text}
                  style={
                    mode === SmearMode.single
                      ? {
                          color: '#0D84FF',
                        }
                      : {}
                  }
                >
                  {Strings.getLang('single')}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
