import { THEME_COLOR } from '@/constant';
import { useDisturbTime } from '@/hooks/useDisturbTime';
import Strings from '@/i18n';
import { utils } from '@ray-js/panel-sdk';
import { router, View } from '@ray-js/ray';
import { Button, Cell, CellGroup, DateTimePicker, NavBar, Popup } from '@ray-js/smart-ui';
import React, { useState } from 'react';
import styles from './index.module.less';
import SwitchBox from './switchBox';

const { toFixedString } = utils;

const DoNotDisturb = () => {
  const [sPopVisible, setSPopVisible] = useState(false);
  const [ePopVisible, setEPopVisible] = useState(false);
  const { disturbTimeSetData, setDisturbTimeSetData, updateDpValue } = useDisturbTime();

  const { enable, startHour, startMinute, endHour, endMinute } = disturbTimeSetData;

  return (
    <View className={styles.container}>
      <NavBar title={Strings.getLang('dsc_do_not_disturb')} leftArrow onClickLeft={router.back} />
      <View className={styles.contentBox}>
        <View className={styles.spaceLine} />
        <SwitchBox
          title={Strings.getLang('dsc_do_not_disturb')}
          label={Strings.getLang('dsc_disturb_time_set_tip')}
          enable={enable}
          onSwitchChange={v => {
            const data = {
              ...disturbTimeSetData,
              enable: !enable,
            };
            setDisturbTimeSetData(data);
          }}
        />

        <View className={styles.spaceLine} />

        <CellGroup inset>
          <Cell
            title={Strings.getLang('dsc_do_not_disturb_start_time')}
            label={`${toFixedString(startHour, 2)}:${toFixedString(startMinute, 2)}`}
            isLink
            onClick={() => setSPopVisible(true)}
          />
          <Cell
            title={Strings.getLang('dsc_do_not_disturb_end_time')}
            label={`${toFixedString(endHour, 2)}:${toFixedString(endMinute, 2)}`}
            isLink
            onClick={() => setEPopVisible(true)}
          />
        </CellGroup>
      </View>

      <Popup
        show={sPopVisible}
        onClose={() => {
          setSPopVisible(false);
        }}
        position="bottom"
      >
        <DateTimePicker
          type="time"
          value={`${startHour}:${startMinute}`}
          onCancel={() => {
            setSPopVisible(false);
          }}
          confirmButtonText={Strings.getLang('dsc_confirm')}
          cancelButtonText={Strings.getLang('dsc_cancel')}
          onConfirm={v => {
            const [startHour, startMinute] = `${v.detail}`.split(':');
            const data = {
              ...disturbTimeSetData,
              startHour: Number(startHour),
              startMinute: Number(startMinute),
            };
            setDisturbTimeSetData(data);
            setSPopVisible(false);
          }}
        />
      </Popup>
      <Popup
        show={ePopVisible}
        onClose={() => {
          setEPopVisible(false);
        }}
        position="bottom"
      >
        <DateTimePicker
          type="time"
          value={`${endHour}:${endMinute}`}
          onCancel={() => {
            setEPopVisible(false);
          }}
          onConfirm={v => {
            const [endHour, endMinute] = `${v.detail}`.split(':');
            const data = {
              ...disturbTimeSetData,
              endHour: Number(endHour),
              endMinute: Number(endMinute),
            };
            setEPopVisible(false);
            setDisturbTimeSetData(data);
          }}
        />
      </Popup>
      <View className={styles.buttonBox}>
        <Button
          block
          color={THEME_COLOR}
          onClick={() => {
            updateDpValue(disturbTimeSetData);
          }}
        >
          {Strings.getLang('dsc_save')}
        </Button>
      </View>
    </View>
  );
};

export default DoNotDisturb;
