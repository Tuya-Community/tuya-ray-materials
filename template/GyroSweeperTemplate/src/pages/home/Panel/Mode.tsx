import React, { useMemo, FC } from 'react';
import { Text, View, router, Swiper, SwiperItem } from '@ray-js/ray';
import Strings from '@/i18n';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { devices, support } from '@/devices';
import { chunk } from 'lodash-es';
import { Icon } from '@ray-js/smart-ui';
import { modesIcon } from '@/res/iconsvg';
import clsx from 'clsx';

import styles from './index.module.less';

type PropsModeItem = {
  code: string;
  dpMode: string;
};

const ModeItem: FC<PropsModeItem> = ({ code, dpMode }) => {
  const actions = useActions();
  const selected = dpMode === code;

  return (
    <View
      className={clsx(styles.modeItem, selected && styles.active)}
      onClick={() => {
        if (code === 'manual') {
          router.push('/manual');
        } else {
          actions.mode.set(code);
        }
      }}
    >
      <View className={styles.modeItemIconWrapper}>
        <Icon
          name={modesIcon[code] ?? modesIcon.smart}
          size="96rpx"
          color={selected ? '#fff' : 'rgba(0, 0, 0, 0.5)'}
        />
      </View>
      <Text className={styles.modeItemText}>
        {code === 'manual' ? Strings.getLang('manual') : Strings.getDpLang('mode', code)}
      </Text>
    </View>
  );
};

const SwiperModes: FC = () => {
  const dpMode = useProps(props => props.mode);
  const dpStatus = useProps(props => props.status);

  const range = useMemo(() => {
    const range = devices.common.getDpSchema()?.mode?.property?.range ?? [];

    const filteredRange = range.filter(item => item !== 'standby' && item !== 'chargego');

    if (support.isSupportDp('direction_control')) {
      filteredRange.push('manual' as any);
    }

    return filteredRange;
  }, []);

  const modeGroups = chunk(range, 5);

  const disabled = dpStatus === 'goto_charge';
  const swiperClass = disabled ? styles.swiper_disabled : styles.swiper;

  return (
    <Swiper
      indicator-dots
      className={swiperClass}
      indicator-active-color="var(--theme-color)"
      indicator-color="rgba(0, 0, 0, 0.1)"
    >
      {modeGroups.map((group, index) => (
        <SwiperItem key={index} className={styles.swiperItem}>
          {group.map(item => (
            <ModeItem key={item} code={item} dpMode={dpMode} />
          ))}
        </SwiperItem>
      ))}
    </Swiper>
  );
};

const SliderModes: FC = () => {
  const dpMode = useProps(props => props.mode);
  const dpStatus = useProps(props => props.status);

  const range = useMemo(() => {
    const range = devices.common.getDpSchema()?.mode?.property?.range ?? [];

    const filteredRange = range.filter(item => item !== 'standby' && item !== 'chargego');

    if (support.isSupportDp('direction_control')) {
      filteredRange.push('manual' as any);
    }

    return filteredRange;
  }, []);

  const disabled = dpStatus === 'goto_charge';

  return (
    <View className={clsx(styles.modeWrapper, disabled && styles.disabled)}>
      {range.map(item => (
        <ModeItem key={item} code={item} dpMode={dpMode} />
      ))}
    </View>
  );
};

const Mode: FC = () => {
  const isSwiperMode = true;

  return (
    <>
      <Text className={styles.modeTitle}>{Strings.getDpLang('mode')}</Text>

      {isSwiperMode ? <SwiperModes /> : <SliderModes />}
    </>
  );
};
export default Mode;
