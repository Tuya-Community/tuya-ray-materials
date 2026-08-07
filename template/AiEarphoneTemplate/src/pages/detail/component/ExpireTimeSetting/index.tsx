import React, { useState } from 'react';
import { View, showToast, Text } from '@ray-js/ray';
import Strings from '@/i18n';
import { DateTimePicker, Popup, Cell } from '@ray-js/smart-ui';
import dayjs from 'dayjs';

import styles from './index.module.less';

interface Props {
  expireTime: number;
  setExpireTime: (time: number) => void;
}

const ExpireTimeSetting = ({ expireTime, setExpireTime }: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const onShowPicker = () => {
    setShowPicker(true);
  };

  const onAnimationStart = () => {
    setDisabled(true);
  };

  const onAnimationEnd = () => {
    setDisabled(false);
  };

  const onExpireTimeSelect = (days: number) => {
    // 取当前时间，增加days天，设置到当天的23:59:59
    const base = dayjs().add(days, 'day').endOf('day');
    const time = base.valueOf();
    setExpireTime(time);
    setShow(false);
  };

  const onSaveTiming = event => {
    if (disabled) return;
    const { detail } = event;
    const today = new Date();
    // 获取今天的开始时间（00:00:00）
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    if (detail < todayStart) {
      showToast({
        title: Strings.getLang('share_link_modal_expire_time_warn'),
        icon: 'none',
      });
      return;
    }
    const base = dayjs(detail).endOf('day');
    const time = base.valueOf();
    setExpireTime(time);
    setShowPicker(false);
    setShow(false);
  };

  const onClose = () => {
    setShow(false);
  };

  const onShow = () => {
    setShow(true);
  };

  return (
    <View>
      <Cell
        border={false}
        title={Strings.getLang('share_link_modal_expire_setting')}
        isLink
        onClick={onShow}
        customClass={styles.bdR12}
      >
        <Text className={styles.blueText}>{dayjs(expireTime).format('YYYY/MM/DD')}</Text>
      </Cell>
      <Popup customClass={styles.popupContainer} show={show} onClose={onClose}>
        <View className={styles.popupTitle}>
          {Strings.getLang('share_link_modal_expire_setting')}
        </View>
        <View className={styles.popupItem} onClick={() => onExpireTimeSelect(7)}>
          <Text>{Strings.getLang('share_link_modal_expire_time_7_days')}</Text>
        </View>
        <View className={styles.popupItem} onClick={() => onExpireTimeSelect(30)}>
          {Strings.getLang('share_link_modal_expire_time_30_days')}
        </View>
        <View className={styles.popupItem} onClick={onShowPicker}>
          {Strings.getLang('share_link_modal_expire_time_custom')}
        </View>
      </Popup>
      <Popup
        round
        show={showPicker}
        position="bottom"
        safeAreaInsetBottom={false}
        closeOnClickOverlay={false}
      >
        <View style={{ marginBottom: '60rpx' }}>
          <DateTimePicker
            type="date"
            cancelButtonText={Strings.getLang('cancel')}
            confirmButtonText={Strings.getLang('confirm')}
            onAnimationStart={onAnimationStart}
            onAnimationEnd={onAnimationEnd}
            value={expireTime}
            onConfirm={onSaveTiming}
            onCancel={() => setShowPicker(false)}
          />
        </View>
      </Popup>
    </View>
  );
};

export default ExpireTimeSetting;
