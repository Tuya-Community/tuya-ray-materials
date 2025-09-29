import React, { useEffect, useMemo, useState } from 'react';
import { useDevice, useProps, useActions } from '@ray-js/panel-sdk';
import List from '@ray-js/components-ty-cell';
import { View, Text, platform, ScrollView, location, router } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
import { TopBar, DpListItem } from '@/components';
import Strings from '@/i18n';
import { supportDp, hasCommonDps, moreUnlockDPs } from '@/utils';
import { getNgData } from '@/api/atop';
import useJumpPage from '@/hooks/useJumpPage';
import dpCodes from '@/constant/dpCodes';
import styles from './index.module.less';

export function MorePage() {
  const devInfo = useDevice(device => device.devInfo);
  const mode = useProps(props => props.mode);
  const dpSchema = useDevice(device => device.dpSchema);
  const actions = useActions();
  const [isSupportSiri, setNgDataSiri] = useState(false); // 是否支持siri
  const [isSupportVoiceBroad, setNgDataVoiceBroad] = useState(false); // 是否支持语音播报
  const [isSupportCarInfo, setCarInfo] = useState(false); // 是否支持车辆管理平台
  const { devId } = devInfo;
  const { isIOS } = platform;
  const theme = location?.query?.theme || 'light';
  const menuKey = location?.query?.menuKey || ''; // 菜单栏的key
  const modeRange = dpSchema.mode?.property?.range || [];

  const { goToRNPage, goToMiniProgram } = useJumpPage(devInfo);

  useEffect(() => {
    getNgRawDatas(); // 获取元数据
  }, []);

  // 获取对应NG元数据
  const getNgRawDatas = async () => {
    if (typeof ty.getNgRawData !== 'function') return;
    getNgData('is_support_voice_broadcasting').then(res => {
      console.log('获取语音播报元数据 >> ', res);
      setNgDataVoiceBroad(res);
    });
    getNgData('is_siri_support').then(res => {
      console.log('获取Siri元数据 >> ', res);
      setNgDataSiri(res);
    });
    getNgData('is_support_builtin_travel_management_system').then(res => {
      console.log('获取车辆管理平台元数据 >> ', res);
      setCarInfo(res);
    });
  };

  const alarmDataSourceLength = useMemo(() => {
    const data = devInfo.schema.filter(
      schema =>
        [dpCodes.moveAlarm, dpCodes.antiThefSensitivity].indexOf(schema.code) !== -1 ||
        /^alarm_/.test(schema.code)
    );
    return data.length;
  }, [devInfo]);

  const controlDataSource = useMemo(() => {
    return devInfo.schema.filter(
      schema =>
        [
          dpCodes.cruiseSwitch,
          dpCodes.speedLimitEnum,
          dpCodes.speedLimitE,
          dpCodes.energyRecoveryLevel,
          dpCodes.unitSet,
          dpCodes.startMode,
        ].indexOf(schema.code) !== -1 || /^ride_mode_/.test(schema.code)
    );
  }, [devInfo]);

  const listData = useMemo(() => {
    return [
      {
        key: 'info',
        onclick: () => {
          // 产品信息二级页 支持车辆管理平台则走自己的页面  不支持跳转rn页面
          isSupportCarInfo ? router.push(`/devInfo?theme=${theme}`) : goToRNPage('000001e2ge');
        },
        isShow: true,
      },
      {
        key: 'moreLock', // 更多解锁方式
        onclick: () => {
          ty.router({
            url: `tuyaSmart://tsod_additional_unlock_methods?devId=${devId}`,
            success: res => {
              // console.log('跳转更多解锁方式成功 :>>  仅支持出行APP');
            },
            fail: fail => {
              console.log('fail :>> ', fail);
              ty.showToast({
                title: fail?.errorMsg,
                icon: 'none',
              });
            },
          });
          // 原生locking options 更多解锁方式
        },
        isShow: !menuKey.includes('moreLock') && hasCommonDps(Object.keys(dpSchema), moreUnlockDPs),
      },
      {
        key: 'controlTitle', // 骑行模式
        onclick: () => {
          router.push(`/control?theme=${theme}`);
        },
        isShow: true && controlDataSource.length > 1,
      },
      {
        key: controlDataSource?.[0]?.code, // 骑行模式
        showDpItem: true,
        isShow: true && controlDataSource?.length === 1,
      },
      {
        key: 'alarmTitle',
        onclick: () => {
          router.push(`/alarm?theme=${theme}`);
        },
        isShow: !menuKey.includes('alarm') && alarmDataSourceLength > 0,
      },
      {
        key: 'lostMode',
        onclick: () => {
          goToRNPage('000001jt3i');
        },
        isShow: !menuKey.includes('alarm') && alarmDataSourceLength === 0,
      },
      {
        key: 'lightTitle',
        onclick: () => {
          router.push('/light');
        },
        isShow: !menuKey.includes('light'),
      },
      {
        key: 'selfCheck',
        onclick: () => goToRNPage('0000014j75'), // 设备诊断二级页
        isShow: true,
      },
      {
        key: 'parts',
        onclick: () => goToRNPage('tya9ftwnkpwghshh0w', false), // 配件小程序
        isShow:
          supportDp(dpCodes.masterSlaveBindFunction, dpSchema) &&
          supportDp(dpCodes.masterSlaveFunctionSync, dpSchema),
      },
      {
        key: 'voiceBroadcast',
        onclick: () => goToMiniProgram('tyfg9oli72ujenlzww'), // 语音播报小程序
        isShow: isSupportVoiceBroad,
      },
      {
        key: 'notice',
        onclick: () => goToRNPage('000001l3hp'), // 通知信息二级页
        isShow: supportDp(dpCodes.notificationPush, dpSchema),
      },
      {
        key: 'siri',
        onclick: () => {
          ty.router({
            url: `thingSmart://tsod_shortcut_siri?devId=${devId}`,
          });
        },
        isShow: isIOS && isSupportSiri,
      },
    ];
  }, [
    isIOS,
    isSupportSiri,
    isSupportVoiceBroad,
    isSupportCarInfo,
    menuKey,
    modeRange,
    theme,
    dpSchema,
    devId,
    actions,
    mode,
    alarmDataSourceLength,
    controlDataSource,
  ]);

  const data = useMemo(() => {
    return listData.filter(i => i.isShow);
  }, [listData]);

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('moreTitle')} />
      <ScrollView scrollY>
        <List
          style={{
            marginTop: '19px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          rowKey={(_, i) => i}
          dataSource={data}
          renderItem={item =>
            item?.showDpItem ? (
              <DpListItem code={item.key} key={item.key} />
            ) : (
              <List.Item
                gap="5px"
                className={styles.listItem}
                title={item.key === 'mode' ? Strings.getDpLang('mode') : Strings.getLang(item.key)}
                titleStyle={{ color: 'var(--app-B1-N1)', fontSize: '16px', fontWeight: 500 }}
                onClick={item.onclick}
                content={
                  <View>
                    {item.key === 'mode' && (
                      <Text style={{ color: 'var(--app-B1-N4)' }}>
                        {Strings.getDpLang('mode', mode)}
                      </Text>
                    )}
                    <Icon type="icon-right" color="var(--app-B1-N4)" size={18} />
                  </View>
                }
              />
            )
          }
        />
      </ScrollView>
    </View>
  );
}

export default MorePage;
