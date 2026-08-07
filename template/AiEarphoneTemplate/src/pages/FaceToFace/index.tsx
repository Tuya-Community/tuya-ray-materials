/*
 * @Author: hkc
 * @Date: 2025-07-09 16:55:50
 * @LastEditors: hkc
 * @LastEditTime: 2026-04-08 14:14:09
 * @Description: 面对面翻译
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getStorageSync, router, setStorageSync, usePageEvent, View } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import { TopBar } from '@/components';
import ThemedImage from '@/components/ThemedImage';
import ThemedIcon from '@/components/ThemedIcon';
import Tabs from '@ray-js/components-ty-tabs';
import clsx from 'clsx';
import { DevInfo } from '@ray-js/panel-sdk';

import Strings from '@/i18n';
import Res from '@/res';
import { backToHome, formatDevSchema } from '@/utils';
import SelectListPopup from '@/components/SelectListPopup';
import LanguageSelectPopup from '@/components/LanguageSelectPopup';
import { useSelector } from '@/redux';
import { useDispatch } from 'react-redux';
import { RecordStatus, selectAudioFileByKey } from '@/redux/modules/audioFileSlice';
import { updateLangSelects } from '@/redux/modules/f2fLangSelectsSlice';
import { trackEvent } from '@/utils/track';
import { DEVTYPES } from '@/constant/enums';
import { devInfoChange } from '@/redux/modules/devInfoSlice';
import LanguageSelectCard, { ModeType } from './component/LanguageSelectCard';

// @ts-ignore
import styles from './index.module.less';

export enum FTFTabType {
  Phone = 'phone',
  Earphone = 'earphone',
  PhoneEar = 'phone_ear',
}

const Index = props => {
  const task = useSelector(selectAudioFileByKey('task'));
  const dispatch = useDispatch();
  // 定义当前激活的tab
  const [activeKey, setActiveKey] = useState(FTFTabType.Phone);
  // 获取启动参数
  const query = props?.location?.query || {};
  const fromType = query?.fromType || '';
  const deviceList = useSelector(state => state.deviceList); // 家庭设备列表
  const [headsetList, setHeadsetList] = useState([]); // 耳机列表
  const [selectedDevice, setSelectedDevice] = useState<DevInfo>(null); // 选择的设备
  const [showPopup, setShowPopup] = useState(false);
  const [showLangPopup, setShowLangPopup] = useState(false); // 语言选择弹窗显示状态
  const [currentTransOption, setCurrentTransOption] = useState<'input' | 'output'>('input'); // 当前翻译选项
  const { myLang, friendLang } = useSelector(state => state.f2fLangSelects);

  usePageEvent('onShow', () => {
    // 埋点-面对面翻译设置页面
    trackEvent('ty_F7XfNiwV0FcsSOhAcST7QNS5PXtlMoaz', 'viewed_page');
  });

  // 判断选中的设备是否离线
  const isOffline = useMemo(() => {
    if (activeKey !== FTFTabType.Phone && !selectedDevice?.isOnline) {
      return true;
    }
    return false;
  }, [selectedDevice, activeKey]);

  // 根据tab设置设备列表和选中的设备
  useEffect(() => {
    if (!deviceList.length) return;

    const getSelectedDevice = (storageKey: string, customDevType, filteredList) => {
      const storedDevId = getStorageSync({ key: storageKey });
      const catchDev = filteredList.find(item => item.devId === storedDevId); // 可能没选过，导致没有默认选中的设备,假设设备都离线？
      const firstDevOnline = filteredList.find(
        item => item.isOnline && item.customDevType === customDevType
      );
      const firstDev = filteredList.find(item => item.customDevType === customDevType); // 第一个非手机设备

      return catchDev || firstDevOnline || firstDev || filteredList?.[0];
    };

    const entryOrProDevList = deviceList
      .filter(item =>
        [DEVTYPES.entry, DEVTYPES.pro, DEVTYPES.os].includes(item?.customDevType as DEVTYPES)
      )
      .sort((a, b) => +b.isOnline - +a.isOnline);

    switch (activeKey) {
      case FTFTabType.Phone: {
        setHeadsetList(deviceList);
        const phoneDev = deviceList.find(item => item.customDevType === DEVTYPES.phone);
        setSelectedDevice(phoneDev);
        break;
      }
      case FTFTabType.Earphone:
      case FTFTabType.PhoneEar: {
        setHeadsetList(entryOrProDevList);
        const dev = getSelectedDevice('ftfCachedDevId', DEVTYPES.pro, entryOrProDevList);
        setSelectedDevice(dev);
        break;
      }
      default:
        // 默认也需要列表，不然手机的id会丢失
        setHeadsetList(deviceList);
        break;
    }
  }, [deviceList, activeKey]);

  // 定义tab列表
  const tabList = useMemo(() => {
    const list = [
      {
        icon: Res.phoneIcon,
        activeIcon: Res.phoneActiveIcon,
        title: Strings.getLang('ftf_phone_title'),
        desc: Strings.getLang('ftf_phone_desc'),
        key: FTFTabType.Phone,
        imageName: 'phoneIcon',
        activeImageName: 'phoneActiveIcon',
      },
      {
        icon: Res.basicIcon,
        activeIcon: Res.basicActiveIcon,
        title: Strings.getLang('ftf_basic_title'),
        desc: Strings.getLang('ftf_basic_desc'),
        key: FTFTabType.Earphone,
        imageName: 'basicIcon',
        activeImageName: 'basicActiveIcon',
      },
      {
        icon: Res.phoneEarIcon,
        activeIcon: Res.phoneEarActiveIcon,
        title: Strings.getLang('ftf_phone_ear_title'),
        desc: Strings.getLang('ftf_phone_ear_desc'),
        key: FTFTabType.PhoneEar,
        imageName: 'phoneEarIcon',
        activeImageName: 'phoneEarActiveIcon',
      },
    ];
    // 判断是否有专业版, TODO: 暂时取消专业版本入门版的区分
    // const hasPro = deviceList.some(item => item?.customDevType === 'pro_version');

    // if (hasPro) {
    //   list.push({
    //     icon: proIcon,
    //     activeIcon: proActiveIcon,
    //     title: Strings.getLang('ftf_pro_title'),
    //     desc: Strings.getLang('ftf_pro_desc'),
    //     key: FTFTabType.Pro,
    //   });
    // }

    return list;
  }, [deviceList]);

  // tab 切换事件
  const handleTabChange = (key: FTFTabType) => {
    // 埋点-面对面翻译设置页面tab切换
    trackEvent('ty_45ncDwBaCqD4Ki4zRBrndiGJ7CCddMQa', 'card_click', {
      position_info: {
        position_type: key === FTFTabType.Phone ? 'phone' : 'earbuds',
      },
    });

    setActiveKey(key);
  };

  // 返回事件
  const onBack = () => {
    backToHome(fromType);
    // router.back();
  };

  // 录音点击
  const handleRecord = useCallback(() => {
    // 埋点-面对面翻译设置页面录音点击
    trackEvent('ty_5PP1LQNWeYvj3ig8Mqm241Lz05g8Lqkr', 'card_click');

    if (isOffline) {
      return;
    }
    // 录音中，无法重复开启
    if (
      task &&
      task?.recordType !== 3 &&
      (task?.state === RecordStatus.RECORDING || task?.state === RecordStatus.PAUSE)
    ) {
      ty.showToast({ icon: 'none', title: Strings.getLang('recording_warn') });
      return;
    }

    // 切换当前录音设备到选中设备（手机模式为 PHONE）
    if (selectedDevice) {
      dispatch(devInfoChange(formatDevSchema(selectedDevice)));
    }

    router.push(
      `/faceToFace/recording?mode=${activeKey}&deviceId=${
        activeKey === FTFTabType.Phone ? 'PHONE' : selectedDevice?.devId
      }&fromType=${fromType}`
    );
  }, [activeKey, isOffline, task, fromType, selectedDevice, dispatch]);

  // 设备列表选中
  const handleSave = useCallback(
    (_, data) => {
      console.log('handleSave', data);
      setSelectedDevice(data);
      switch (activeKey) {
        case FTFTabType.Earphone:
        case FTFTabType.PhoneEar:
          setStorageSync({
            key: 'ftfCachedDevId',
            data: data?.devId,
          });
          break;
        default:
          break;
      }
    },
    [activeKey]
  );

  // 语言选择弹窗打开
  const handleLangClick = useCallback((option: 'input' | 'output') => {
    setCurrentTransOption(option);
    setShowLangPopup(true);
  }, []);

  // 语言选择保存
  const handleLangSave = useCallback(
    (lang: string) => {
      if (currentTransOption === 'input') {
        dispatch(updateLangSelects({ friendLang: lang }));
      } else {
        dispatch(updateLangSelects({ myLang: lang }));
      }
      setShowLangPopup(false);
    },
    [dispatch, currentTransOption]
  );

  const dataSource = useMemo(
    () =>
      headsetList.map(item => ({
        ...item,
        disabled: !item.isOnline,
        label: (
          <View className={styles.label}>
            <View className={styles.name}>{item.name}</View>
            {!item.isOnline && <View className={styles.tag}>{Strings.getLang('offline')}</View>}
          </View>
        ),
      })),
    [headsetList]
  );

  return (
    <>
      <View className={styles.container}>
        <View>
          <TopBar title={Strings.getLang('ftf_title')} onBack={onBack} />
          <Tabs
            className={styles.tabs}
            tabsClassName={styles.tabBar}
            onChange={handleTabChange}
            activeKey={activeKey}
            tabStyle={isActive => ({
              backgroundColor: isActive ? 'var(--color-bg-navbar)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-black)',
            })}
            swipeable
          >
            {tabList.map(item => (
              <Tabs.TabPanel
                tab={
                  <ThemedImage
                    imageName={activeKey === item.key ? item.activeImageName : item.imageName}
                    src={activeKey === item.key ? item.activeIcon : item.icon}
                    className={styles.tabIcon}
                    // style={
                    //   item.key === FTFTabType.Pro && {
                    //     position: 'relative',
                    //     top: '-6rpx',
                    //   }
                    // }
                  />
                }
                tabKey={item.key}
                key={item.key}
              >
                <View className={styles.tabContent}>
                  <View className={styles.title}>{item.title}</View>
                  <View className={styles.desc}>{item.desc}</View>
                  <View className={styles.lang}>
                    <LanguageSelectCard
                      mode={item.key === FTFTabType.PhoneEar ? ModeType.PhoneEar : ModeType.Normal}
                      onLangClick={handleLangClick}
                    />
                  </View>
                </View>
              </Tabs.TabPanel>
            ))}
          </Tabs>
          {/* <View className={styles.dot}>
            {tabList.map(item => (
              <View
                className={clsx(styles.dotItem, {
                  [styles.active]: activeKey === item.key,
                })}
                key={item.key}
              />
            ))}
          </View> */}
        </View>

        <View className={styles.footer}>
          {activeKey !== FTFTabType.Phone && !headsetList.length ? (
            <View className={styles.add} onClick={() => router.back()}>
              <View className={styles.tip}>{Strings.getLang('ftf_add_tip')}</View>
              <Button customClass={styles.button}>{Strings.getLang('ftf_add')}</Button>
            </View>
          ) : (
            <>
              {activeKey !== FTFTabType.Phone && selectedDevice && (
                <View
                  className={styles.deviceName}
                  onClick={() => {
                    // 埋点-面对面翻译设置页面点击切换设备
                    trackEvent('ty_LGbltEFk6SFfzUCZkag9YW5REstWwa6q', 'card_click');

                    setShowPopup(true);
                  }}
                >
                  <View className={styles.name}>{selectedDevice?.name}</View>
                  <ThemedIcon iconName="changeSvg" name={Res.changeSvg} className={styles.icon} />
                </View>
              )}
              <View
                id="faceToface-to-record"
                className={clsx(styles.img, {
                  [styles.disabled]: isOffline,
                })}
                onClick={handleRecord}
              >
                <ThemedImage
                  imageName="speakerPng"
                  src={Res.speakerPng}
                  className={styles.speaker}
                />
              </View>
            </>
          )}
        </View>
      </View>
      <SelectListPopup
        fieldNames={{
          value: 'devId',
        }}
        selectedValue={selectedDevice?.devId}
        show={showPopup}
        onClose={() => setShowPopup(false)}
        dataSource={dataSource}
        onSave={handleSave}
      />
      <LanguageSelectPopup
        show={showLangPopup}
        onClose={() => setShowLangPopup(false)}
        title={
          currentTransOption === 'input'
            ? activeKey === FTFTabType.PhoneEar
              ? Strings.getLang('ftf_phone')
              : Strings.getLang('ftf_friend')
            : activeKey === FTFTabType.PhoneEar
            ? Strings.getLang('ftf_earphone')
            : Strings.getLang('ftf_my')
        }
        selectedLang={currentTransOption === 'input' ? friendLang : myLang}
        disabledLang={currentTransOption === 'input' ? myLang : friendLang}
        onSave={handleLangSave}
      />
    </>
  );
};

export default Index;
