import {
  Button,
  View,
  getDeviceInfo,
  getDeviceListByDevIds,
  getDeviceOnlineType,
  getLaunchOptionsSync,
  home,
  navigateTo,
} from '@ray-js/ray';
import { CellGroup, Cell, ActionSheet, Field } from '@ray-js/smart-ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DpSchema } from '@ray-js/panel-sdk';
import GlobalActionSheet, { ActionSheetInstance } from '../../components/action-sheet-global';
import styles from './index.module.less';

declare const I18n;

const switchReg = /^switch(_led)?(_\d+)?$/;
const pdSwitchReg = /^pd_switch_\d+/;
const usbSwitchReg = /(^usb_switch_\d+)|(^switch_usb\d+)/;

export default () => {
  console.log('getLaunchOptionsSync().query', getLaunchOptionsSync().query);
  const { deviceId, groupId, bgImgUrl = '' } = getLaunchOptionsSync().query;
  const [switches, setSwitches] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [switchDps, setWwitchDps] = useState<DpSchema[]>([]);

  useEffect(() => {
    setInterval(() => {
      getDeviceInfo({
        deviceId,
        success(d) {
          console.log('======= devinfo', d);
        },
      });
      getDeviceOnlineType({
        deviceId,
        success: (d) => {
          console.log('======= onlineType', d.onlineType);
        },
      });
    }, 5000);
  }, []);

  useEffect(() => {
    getDeviceInfo({
      deviceId,
      success: (res) => {
        const dps = res.schema.filter((item) => {
          return switchReg.test(item.code) || pdSwitchReg.test(item.code) || usbSwitchReg.test(item.code);
        });
        setWwitchDps(dps);
      },
    });
  }, []);

  const goToPath = useCallback(
    (path: string, params?: string) => {
      let url = `functional://ElectricianTimer/${path}?deviceId=${deviceId || ''}&groupId=${
        groupId || ''
      }&bgImgUrl=${encodeURIComponent(bgImgUrl)}`;

      if (switches.length) {
        url += `&switchCodes=${switches.join(',')}`;
      }
      if (params) {
        url += `&${params}`;
      }

      const obj = {
        // bgImgUrl: encodeURIComponent(
        //   'https://images.tuyacn.com/rms-static/ce4f7e30-1b5d-11f0-9fb9-e1834df84344-1744875015571.png?tyName=test-timer-bg.png',
        // ),
        // countdownCodes: 'countdown_1',
        // cycleCode: 'cycle_timing',
        deviceId,
        groupId: '',
        // inchingCode: 'switch_inching',
        // randomCode: 'random_timing',
        // switchCodes: 'water_pump1',
      };
      const query = Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      console.log('query', query);
      navigateTo({
        // 临时自测
        url: url,
      });
    },
    [switches],
  );
  return (
    <View className={styles.container}>
      <CellGroup>
        <Cell
          title={I18n.t('select_switch')}
          onClick={() => setVisible(true)}
          value={
            switches.length === 0
              ? I18n.t('all_switch')
              : switchDps
                  .filter((x) => switches.includes(x.code))
                  .map((item) => item.name)
                  .join('/')
          }
        />
      </CellGroup>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('home');
        }}
        type="primary"
      >
        {I18n.t('multi_timers')}
      </Button>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('home', 'supportCountdown=y');
        }}
        type="primary"
      >
        {I18n.t('multi_countdown_timers')}
      </Button>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('setCountdown', 'supportCountdown=y');
        }}
        type="primary"
      >
        {I18n.t('countdown')}
      </Button>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('countdown', 'supportCountdown=y');
        }}
        type="primary"
      >
        {I18n.t('countdown_list')}
      </Button>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('schedule');
        }}
        type="primary"
      >
        {I18n.t('cloud_timer')}
      </Button>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('cycle');
        }}
        type="primary"
      >
        {I18n.t('cycle_timer')}
      </Button>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('random');
        }}
        type="primary"
      >
        {I18n.t('random_timer')}
      </Button>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('astronomical');
        }}
        type="primary"
      >
        {I18n.t('astronomical_timer')}
      </Button>
      <Button
        style={{ margin: '16px 0' }}
        onClick={() => {
          goToPath('inching');
        }}
        type="primary"
      >
        {I18n.t('inching_timer')}
      </Button>
      <ActionSheet
        title={I18n.t('select_switch')}
        confirmText={I18n.t('confirm')}
        cancelText={I18n.t('cancel')}
        show={visible}
        closeOnClickAction={false}
        onClose={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        actions={switchDps.map((item) => ({
          ...item,
          checked: switches.includes(item.code),
        }))}
        onSelect={(event) => {
          console.log('event', event);
          setSwitches((d) => {
            const i = d.indexOf(event.detail.code);
            if (i >= 0) {
              const newList = [...d];
              newList.splice(i, 1);
              return newList;
            }
            return [...d, event.detail.code];
          });
        }}
        onConfirm={() => {
          setVisible(false);
        }}
      />
      <GlobalActionSheet />
    </View>
  );
};
