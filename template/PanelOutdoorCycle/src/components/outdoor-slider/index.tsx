import React, { useState, useMemo, useEffect } from 'react';
import { Text, View, Image, onDpDataChange, offDpDataChange } from '@ray-js/ray';
import { useActions, useProps, useDevice } from '@ray-js/panel-sdk';
import { useSelector } from 'react-redux';
import { selectThemeType } from '@/redux/modules/themeSlice';
import Strings from '@/i18n';
import dpCodes from '@/constant/dpCodes';
import Slider from './sjsSlider';
import styles from './index.module.less';

let openLoadingTimer;
let closeLoadingTimer;

export const OutdoorSlider = ({ checkPermissions, isSupportNavigation }) => {
  const actions = useActions();
  const theme = useSelector(selectThemeType);
  const isOnline = useDevice(device => device.devInfo.isOnline);
  const blelockSwitch = useProps(props => props[dpCodes.blelockSwitch]);
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(blelockSwitch ? 100 : 1);
  const [isMoving, setMoving] = useState(false);

  const sliderMax = 90;
  const sliderMin = 10;

  useEffect(() => {
    onDpDataChange(res => {
      handDpChange(res);
    });
    return () => {
      offDpDataChange(res => handDpChange(res));
    };
  }, []);

  const handDpChange = res => {
    const { dps } = res;
    if (Object.keys(dps) && Object.keys(dps).includes('1')) {
      clearTimeout(openLoadingTimer);
      clearTimeout(closeLoadingTimer);
      console.log('dpset, set值 :>> ', dps['1'] === true ? 100 : 1);
      dps['1'] === true ? setValue(100) : setValue(1);
      setLoading(false);
    }
  };

  const changeDp = val => {
    actions.blelock_switch.set(val, { pipelines: [6, 5, 4, 3, 2, 1] });
  };
  const openLock = () => {
    checkPermissions(
      dpCodes.blelockSwitch,
      () => {
        console.log('开锁 :>> ');
        setLoading(true);
        changeDp(true);
        clearTimeout(openLoadingTimer);
        openLoadingTimer = setTimeout(() => {
          console.log('开锁超时set1 :>> ');
          setValue(1);
          setLoading(false);
        }, 5000);
      },
      () => {
        console.log('被禁用滑块返回 :>> ');
        setValue(100);
        setTimeout(() => {
          setValue(1);
        }, 50);
      }
    );
  };

  const closeLock = () => {
    setLoading(true);
    console.log('关锁 :>> ');
    changeDp(false);
    clearTimeout(closeLoadingTimer);
    closeLoadingTimer = setTimeout(() => {
      console.log('关锁超时set100 :>> ');
      setValue(100);
      setLoading(false);
    }, 5000);
  };

  const onChangeEnd = (val, from) => {
    if (value === val) return;
    if (val >= sliderMax && !blelockSwitch) {
      console.log('onValueChange 开锁 :>> ', 'old', value, 'changeVal', val);
      openLock();
    }
    if (val <= sliderMin && blelockSwitch) {
      console.log('onValueChange 关锁 :>> ', 'old', value, 'changeVal', val);
      closeLock();
    }
    if (!blelockSwitch && val < sliderMax) {
      setValue(val);

      setTimeout(() => {
        console.log('没划到位，返回左边 set1 , :>> ');
        setValue(1);
      }, 50);
    }
    if (blelockSwitch && val > sliderMin) {
      setValue(val);
      setTimeout(() => {
        console.log('没划到位，返回右边 set100’ :>> ');
        setValue(100);
      }, 50);
    }
  };

  const arrowRight = () => {
    return (
      <View className={styles.arrowContainer} style={{ right: 70 }}>
        <View className={styles.arrow} />
        <View
          className={styles.arrow}
          style={{ opacity: 0.3, marginLeft: 6, animationDelay: '200ms' }}
        />
        <View
          className={styles.arrow}
          style={{ opacity: 0.1, marginLeft: 8, animationDelay: '400ms' }}
        />
      </View>
    );
  };

  const arrowLeft = () => {
    return (
      <View className={styles.arrowContainer} style={{ left: 82 }}>
        <View className={styles.arrowLeft} style={{ opacity: 0.1, animationDelay: '400ms' }} />
        <View
          className={styles.arrowLeft}
          style={{ opacity: 0.3, marginLeft: 6, animationDelay: '200ms' }}
        />
        <View className={styles.arrowLeft} style={{ opacity: 1, marginLeft: 8 }} />
      </View>
    );
  };

  const isDisabled = useMemo(() => isLoading || !isOnline, [isLoading, isOnline]);

  const LoadingView = () => {
    return <View className={styles.loading} />;
  };

  return (
    <View
      className={styles.unlock}
      style={{
        backgroundColor: theme === 'dark' ? '#202124' : 'var(--app-M1)',
        width: isSupportNavigation ? '480rpx' : 'calc(100vw - 64rpx)',
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      {isLoading && LoadingView()}
      {!isLoading && (
        <View className={styles.sliderWrap}>
          {blelockSwitch && arrowLeft()}
          <Text className={styles.unlockText}>
            {blelockSwitch ? Strings.getLang('closeLock') : Strings.getLang('openLock')}
          </Text>
          {!blelockSwitch && arrowRight()}
          <Slider
            disabled={isDisabled}
            currentDpValue={!!blelockSwitch}
            value={value}
            step={1}
            min={1}
            max={100}
            enableTouch={false}
            isSupportNavigation={isSupportNavigation}
            trackStyle={{
              width: `${isSupportNavigation ? 464 : 660}rpx`,
              height: `${116}rpx`,
              borderRadius: `${28}rpx`,
              background: 'transparent',
            }}
            barStyle={{
              background: 'transparent',
              width: `${isSupportNavigation ? 464 : 660}rpx`,
            }}
            thumbStyle={{
              width: '116rpx',
              height: '116rpx',
              borderRadius: '28rpx',
              background: '#fff',
            }}
            thumbWrapStyle={{
              transition: isMoving ? 'none' : 'left 0.3s linear',
            }}
            onBeforeChange={() => {
              setMoving(true);
            }}
            onAfterChange={(val, from) => {
              onChangeEnd(val, from);
              setMoving(false);
            }}
          />
        </View>
      )}
    </View>
  );
};
