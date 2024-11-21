import React, { useState, useEffect } from 'react';
import { Text, View, onDpDataChange, offDpDataChange } from '@ray-js/ray';
import { useActions, useProps, useDevice } from '@ray-js/panel-sdk';
import { useSelector } from 'react-redux';
import { selectThemeType } from '@/redux/modules/themeSlice';
import Strings from '@/i18n';
import dpCodes from '@/constant/dpCodes';
import { checkPermissions } from '@/utils';
import Slider from '../sjs-slider';
import Styles from './index.module.less';

const { blelockSwitch } = dpCodes;
let openLoadingTimer;
let closeLoadingTimer;

export const UnlockSlider = ({ isBleOnline, inService, isPidHadVAS, dpSchema }) => {
  const actions = useActions();
  const theme = useSelector(selectThemeType);
  const isOnline = useDevice(device => device.devInfo.isOnline);
  const switchDpSchema = useDevice(device => device.dpSchema[blelockSwitch]);
  const blelockSwitchDpVal = useProps(props => props[blelockSwitch]);

  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(blelockSwitchDpVal ? 100 : 1);
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
    const { extContent } = switchDpSchema;
    const isExtNull = extContent === '' || extContent === undefined;
    const route = isExtNull ? 0 : JSON.parse(extContent).route;
    if (route > 0 && isBleOnline) {
      actions[blelockSwitch].set(val, { pipelines: [6, 5, 4, 3, 2, 1] });
    } else {
      actions[blelockSwitch].set(val);
    }
  };

  const openLock = () => {
    checkPermissions({
      dpCode: 'blelock_switch',
      inService,
      isPidHadVAS,
      dpSchema,
      isBleOnline,
      successCb: () => {
        // 开锁
        setLoading(true);
        changeDp(true);
        clearTimeout(openLoadingTimer);
        openLoadingTimer = setTimeout(() => {
          // 开锁超时set1
          setValue(1);
          setLoading(false);
        }, 5000);
      },
      cancelCb: () => {
        // 被禁用滑块返回
        setValue(100);
        setTimeout(() => {
          setValue(1);
        }, 50);
      },
    });
  };

  const closeLock = () => {
    setLoading(true);
    changeDp(false);
    clearTimeout(closeLoadingTimer);
    closeLoadingTimer = setTimeout(() => {
      // 关锁超时
      setValue(100);
      setLoading(false);
    }, 5000);
  };

  const onChangeEnd = (val, from) => {
    if (value === val) return;
    if (val >= sliderMax && !blelockSwitchDpVal) {
      openLock();
    }
    if (val <= sliderMin && blelockSwitchDpVal) {
      closeLock();
    }
    if (!blelockSwitchDpVal && val < sliderMax) {
      setValue(val);
      setTimeout(() => {
        // 没划到位，返回左边
        setValue(1);
      }, 50);
    }
    if (blelockSwitchDpVal && val > sliderMin) {
      setValue(val);
      setTimeout(() => {
        // 没划到位，返回右边
        setValue(100);
      }, 50);
    }
  };

  const arrowRight = () => {
    return (
      <View className={Styles.arrowContainer} style={{ right: 70 }}>
        <View className={Styles.arrow} />
        <View
          className={Styles.arrow}
          style={{ opacity: 0.3, marginLeft: 6, animationDelay: '200ms' }}
        />
        <View
          className={Styles.arrow}
          style={{ opacity: 0.1, marginLeft: 8, animationDelay: '400ms' }}
        />
      </View>
    );
  };

  const arrowLeft = () => {
    return (
      <View className={Styles.arrowContainer} style={{ left: 82 }}>
        <View className={Styles.arrowLeft} style={{ opacity: 0.1, animationDelay: '400ms' }} />
        <View
          className={Styles.arrowLeft}
          style={{ opacity: 0.3, marginLeft: 6, animationDelay: '200ms' }}
        />
        <View className={Styles.arrowLeft} style={{ opacity: 1, marginLeft: 8 }} />
      </View>
    );
  };

  const LoadingView = () => {
    return <View className={Styles.loading} />;
  };
  return (
    <View
      className={Styles.unlock}
      style={{ backgroundColor: theme === 'dark' ? '#202124' : 'var(--app-M1)' }}
    >
      {isLoading && LoadingView()}
      {!isLoading && (
        <View className={Styles.sliderWrap}>
          {blelockSwitchDpVal && arrowLeft()}
          <Text className={Styles.unlockText}>
            {blelockSwitchDpVal ? Strings.getLang('closeLock') : Strings.getLang('openLock')}
          </Text>
          {!blelockSwitchDpVal && arrowRight()}
          <Slider
            disabled={isLoading || !isOnline}
            currentDpValue={blelockSwitchDpVal}
            value={value}
            step={1}
            min={1}
            max={100}
            enableTouch={false}
            trackStyle={{
              width: `${464}rpx`,
              height: `${116}rpx`,
              borderRadius: `${28}rpx`,
              background: 'transparent',
            }}
            barStyle={{
              background: 'transparent',
              width: `${464}rpx`,
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
