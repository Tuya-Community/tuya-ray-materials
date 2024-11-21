import React, { useEffect, useState } from 'react';
import { View, Icon, Text, ScrollView } from '@ray-js/ray';
import { useDevice, useProps, useActions } from '@ray-js/panel-sdk';
import { ActionSheet, Switch } from '@ray-js/smart-ui';
import List from '@ray-js/components-ty-cell';
import TyOutdoorUtils from '@ray-js/ty-outdoor-utils';
import Strings from '@/i18n';
import dpCodes from '@/constant/dpCodes';
import { isDpExist } from '@/utils';
import styles from './index.module.less';

const {
  headlightSwitch,
  taillightSwitch,
  speedLimitEnum,
  energyRecoveryLevel,
  antiThefSensitivity,
  bucketLock,
  tailBoxLock,
  moveAlarm,
  unitSet,
  cruiseSwitch,
} = dpCodes;

const MorePage = () => {
  const devInfo = useDevice(device => device.devInfo);
  const dpSchema = useDevice(device => device.dpSchema);
  const dpState = useProps();
  const actions = useActions();
  const { devId } = devInfo;
  const [show, setShow] = useState(false);
  const [enumData, setEnumData] = useState([]);

  useEffect(() => {
    ty.setNavigationBarTitle({ title: Strings.getLang('more') });
  }, []);

  const listData = [
    {
      key: 'deviceInfo',
      onclick: () => TyOutdoorUtils.jumpSubPage.toEquipment({ deviceId: devId }), // 设备信息二级页
      isShow: true,
    },
    {
      key: 'moreLockMethods',
      onclick: () => {
        ty.router({
          url: `tuyaSmart://tsod_additional_unlock_methods?devId=${devId}`, // 更多解锁方式 APP原生页面
          success: res => {
            console.log('res :>> ', res);
          },
          fail: fail => console.log('fail :>> ', fail),
        });
      },
      isShow: true,
    },
    {
      key: 'notice',
      onclick: () => TyOutdoorUtils.jumpSubPage.toMessageSwitch({ deviceId: devId }), // 通知信息二级页
      isShow: true,
    },
    {
      key: 'lostMode',
      onclick: () => TyOutdoorUtils.jumpSubPage.toLostMode({ deviceId: devId }), // 丢失模式二级页
      isShow: true,
    },
    // 其他常见DP设置项
    ...[
      headlightSwitch,
      taillightSwitch,
      cruiseSwitch,
      speedLimitEnum,
      energyRecoveryLevel,
      antiThefSensitivity,
      bucketLock,
      tailBoxLock,
      moveAlarm,
      unitSet,
    ].map(item => ({
      key: item,
      type: 'DP',
      onclick: () => {
        const modeRange = dpSchema[item]?.property?.range || [];
        const dpType = dpSchema[item]?.property?.type;
        if (dpType === 'enum') {
          setShow(true);
          const data = modeRange.map(i => {
            return {
              value: i,
              key: item,
              name: i,
              checked: dpState[item] === i,
            };
          });
          setEnumData(data);
        }
      },
      isShow: isDpExist(item, dpSchema),
    })),
  ].filter(i => i.isShow);

  const _renderContent = (item: IKey) => {
    const dpType = dpSchema[item.key]?.property?.type;
    switch (dpType) {
      case 'bool':
        return (
          <Switch
            size="26px"
            checked={dpState[item.key]}
            onChange={d => actions[item.key].set(d.detail)}
          />
        );
      case 'enum':
        return (
          <>
            <Text style={{ color: 'var(--app-B1-N4)' }}>{dpState[item.key]}</Text>
            <Icon type="icon-right" color="var(--app-B1-N4)" size={18} />
          </>
        );
      default:
        return null;
    }
  };
  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <List
          style={{
            marginTop: '19px',
            marginBottom: '19px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          rowKey={(_, i) => i}
          dataSource={listData}
          renderItem={(item: IKey) => (
            <List.Item
              gap="5px"
              className={styles.listItem}
              title={item?.type === 'DP' ? Strings.getDpLang(item.key) : Strings.getLang(item.key)}
              titleStyle={{ color: 'var(--app-B1-N1)', fontSize: '16px', fontWeight: 500 }}
              onClick={item.onclick}
              content={
                <View>
                  {item?.type === 'DP' ? (
                    _renderContent(item)
                  ) : (
                    <Icon type="icon-right" color="var(--app-B1-N4)" size={18} />
                  )}
                </View>
              }
            />
          )}
        />
      </ScrollView>
      <ActionSheet
        show={show}
        actions={enumData}
        onClose={() => setShow(false)}
        onSelect={d => {
          actions[d.detail.key].set(d.detail.value);
        }}
        cancelText={Strings.getLang('cancel')}
      />
    </View>
  );
};

export default MorePage;
