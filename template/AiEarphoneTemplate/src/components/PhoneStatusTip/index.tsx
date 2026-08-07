/*
 * @Author: hkc
 * @Date: 2025-12-02 18:05:31
 * @LastEditors: hkc
 * @LastEditTime: 2026-06-07 20:54:53
 * @Description: 手机状态提示组件
 */
import React, { useEffect, useMemo, useState } from 'react';
import { View } from '@ray-js/ray';
import { Icon, Transition } from '@ray-js/smart-ui';

import Strings from '@/i18n';
import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import { useSelector } from '@/redux';
import { DEVTYPES } from '@/constant/enums';

import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';

import styles from './index.module.less';

type ShowType = 'sound' | 'battery';

const Index = () => {
  const [isShow, setIsShow] = useState(false);
  const [showType, setShowType] = useState<ShowType | ''>('');
  const [isShowSound, setIsShowSound] = useState(false);
  const [isShowBattery, setIsShowBattery] = useState(false);
  const devList = useSelector(state => state?.deviceList);

  // 左侧图标
  const showIcon = useMemo(() => {
    switch (showType) {
      case 'sound':
        return Res.improveSoundIcon;
      case 'battery':
        return Res.improveBatteryIcon;
      default:
        return '';
    }
  }, [showType]);
  const showIconName = useMemo(() => {
    switch (showType) {
      case 'sound':
        return 'improveSoundIcon';
      case 'battery':
        return 'improveBatteryIcon';
      default:
        return '';
    }
  }, [showType]);

  // 提示文案
  const showTip = useMemo(() => {
    switch (showType) {
      case 'sound':
        return Strings.getLang('phone_status_sound');
      case 'battery':
        return Strings.getLang('phone_status_battery');
      default:
        return '';
    }
  }, [showType]);

  // 优先显示录音质量提示
  useEffect(() => {
    // 没有卡片设备才显示提示
    const isHasCard = devList?.some(item => item?.customDevType === DEVTYPES.card);
    if (isHasCard) return;

    if (isShowSound) {
      setShowType('sound');
      setIsShow(true);
    } else if (isShowBattery) {
      setShowType('battery');
      setIsShow(true);
    }
  }, [isShowSound, isShowBattery, devList?.length]);

  // 录音质量变化事件
  const handleRecordQualityChange = (data: any) => {
    setIsShowSound(data?.needShow);
  };

  // 电量变化事件
  const handleRecordBatteryChange = (data: any) => {
    setIsShowBattery(data?.needShow);
  };

  useEffect(() => {
    // @ts-ignore
    ty.wear?.onRecordQualityChangeEvent?.(handleRecordQualityChange);
    // @ts-ignore
    ty.wear?.onRecordBatteryChangeEvent?.(handleRecordBatteryChange);

    return () => {
      // @ts-ignore
      ty.wear?.offRecordQualityChangeEvent?.(handleRecordQualityChange);
      // @ts-ignore
      ty.wear?.offRecordBatteryChangeEvent?.(handleRecordBatteryChange);
    };
  }, []);

  return (
    <Transition name="fade-up" show={isShow} customClass={styles.container}>
      <View
        className={styles.inner}
        onClick={() => {
          // 单设备面板：不再跳转多设备引导页，仅关闭提示
          setIsShow(false);
        }}
      >
        <ThemedImage className={styles.icon} src={showIcon} imageName={showIconName} />
        <View className={styles.tip}>{showTip}</View>
        <Icon
          name={closeIcon}
          size={18}
          customClass={styles.close}
          color="var(--color-text-white-5)"
          onClick={() => setIsShow(false)}
        />
      </View>
    </Transition>
  );
};

export default Index;
