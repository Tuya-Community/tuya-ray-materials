import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, Image, router, Button } from '@ray-js/ray';
import { ActionSheet } from '@ray-js/smart-ui';
import { useDevice, useProps, useActions } from '@ray-js/panel-sdk';
import TyOutdoorUtils from '@ray-js/ty-outdoor-utils';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { commonCheckInfo } from '@/redux/modules/commonInfoSlice';
import { scaleMileageValue, isDpExist, checkPermissions } from '@/utils';
import { UnlockSlider, TopBar, SignalView, Battery, Record, ServiceToast } from '@/components';
import useBleOnline from '@/hooks/useBleOnline';
import Res from '@/res';
import Strings from '@/i18n';
import dpCodes from '@/constant/dpCodes';
import styles from './index.module.less';

const { enduranceMileage, mileageTotal, level, unitSet, blelockSwitch } = dpCodes;

const HomePage = () => {
  const systemInfo = useSelector(selectSystemInfo);
  const { devInfo, dpSchema } = useDevice(state => ({
    devInfo: state.devInfo,
    dpSchema: state.dpSchema,
  }));

  const commonInfo = useSelector(commonCheckInfo);
  const { inService, isPidHadVAS } = commonInfo;
  const dpState = useProps();
  const { devId } = devInfo;
  const { theme, statusBarHeight } = systemInfo;
  const actions = useActions();
  const { isBleOnline = false } = useBleOnline(devId);
  // 档位选择
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  // 档位DP枚举数据
  const levelEnumData = useMemo(() => {
    const range = dpSchema[level]?.property?.range || [];
    return range.map(i => {
      return {
        id: i,
        name: Strings.getDpLang(i),
        checked: dpState[level] === i,
      };
    });
  }, [dpState[level], dpSchema]);

  // 总里程
  const totalMileageValue = useMemo(
    () =>
      isDpExist(mileageTotal, dpSchema)
        ? scaleMileageValue(
            mileageTotal,
            dpState[mileageTotal],
            dpSchema,
            dpState[unitSet] !== 'km'
          )
        : 0,
    [dpState[mileageTotal], dpState[unitSet], dpSchema]
  );

  // 续航里程
  const enduranceMileageValue = useMemo(
    () =>
      isDpExist(enduranceMileage, dpSchema)
        ? scaleMileageValue(
            enduranceMileage,
            dpState[enduranceMileage],
            dpSchema,
            dpState[unitSet] !== 'km'
          )
        : 0,
    [dpState[enduranceMileage], dpState[unitSet], dpSchema]
  );

  return (
    <View className={styles.container}>
      <TopBar />
      <View className={styles.content}>
        {/* 续费服务弹窗 */}
        <ServiceToast devId={devId} theme={theme} statusBarHeight={statusBarHeight} />

        {/* 信号、蓝牙状态、总里程数 */}
        <View className={styles.signal}>
          <View className={styles.signalLeft}>
            <SignalView isBleOnline={isBleOnline} />
          </View>
          {isDpExist(mileageTotal, dpSchema) && (
            <View>
              {totalMileageValue}
              <Text>{dpState[unitSet] === 'km' ? 'Km' : 'Mile'}</Text>
            </View>
          )}
        </View>
        {/* 电池、车辆信息 */}
        <View className={styles.carInfoContent}>
          <Image
            src={devInfo?.iconUrl || Res.defaultCar}
            className={devInfo?.iconUrl ? styles.carImg : styles.defaultCar}
          />
          <View className={styles.carInfoLeft}>
            <Battery />
            {isDpExist(enduranceMileage, dpSchema) && (
              <>
                <View className={styles.numberView}>
                  <Text className={styles.zeroNum}>{enduranceMileageValue}</Text>
                  <Text className={styles.util}>{dpState[unitSet] === 'km' ? 'Km' : 'Mile'}</Text>
                </View>
                <Text className={styles.subTitle}>{Strings.getLang('enduranceMileage')}</Text>
              </>
            )}
            {isDpExist(level, dpSchema) && (
              <Button
                type="primary"
                className={styles.changeModeBtn}
                onClick={() => setShowLevelSelect(true)}
              >
                <Text className={styles.text}>{Strings.getDpLang(dpState[level])}</Text>
                <Image
                  className={styles.icon}
                  src={theme === 'dark' ? Res.modeChange : Res.modeChangeLight}
                />
              </Button>
            )}
          </View>
        </View>
        {/* 快捷操作 */}
        <View className={styles.operation}>
          <View
            className={styles.operationLi}
            onClick={
              () => TyOutdoorUtils.jumpSubPage.toUniversalTargeting({ deviceId: devInfo?.devId }) // 定位二级页
            }
          >
            <Image src={theme === 'dark' ? Res.iconLocation : Res.iconLocationLight} />
            <Text>{Strings.getLang('locationCar')}</Text>
          </View>
          <View
            className={styles.operationLi}
            onClick={
              () => TyOutdoorUtils.jumpSubPage.toVehicleExamine({ deviceId: devId, isEnable: '' }) // 车辆体检
            }
          >
            <Image src={theme === 'dark' ? Res.iconTracks : Res.iconTracksLight} />
            <Text>{Strings.getLang('vehicleExamine')}</Text>
          </View>
          <View className={styles.operationLi} onClick={() => router.push('/more')}>
            <Image src={theme === 'dark' ? Res.iconSet : Res.iconSetLight} />
            <Text>{Strings.getLang('more')}</Text>
          </View>
        </View>
        {/* 骑行记录 */}
        <Record
          deviceId={devId}
          mileageUnit={dpState[unitSet]}
          dpSchema={dpSchema}
          isKm={dpState[unitSet] !== 'km'}
        />
        {/* 滑动开锁 */}
        <View className={styles.unlock}>
          {isDpExist(blelockSwitch, dpSchema) && (
            <UnlockSlider
              isBleOnline={isBleOnline}
              inService={inService}
              isPidHadVAS={isPidHadVAS}
              dpSchema={dpSchema}
            />
          )}
          <View
            className={`${styles.go} ${devInfo?.isOnline && styles.onlineGo}`}
            onClick={() => {
              // 骑行导航 APP原生二级页
              ty.router({
                url: `tuyaSmart://tsod_cycling_navigation?devId=${devInfo?.devId}`,
              });
            }}
            style={{
              backgroundColor: theme === 'dark' ? '#202124' : '#fff',
              width: isDpExist(blelockSwitch, dpSchema) ? '95px' : '100%',
            }}
          >
            <Text className={`${styles.goText} ${devInfo?.isOnline && styles.goTextOnline}`}>
              GO
            </Text>
          </View>
        </View>
      </View>
      <ActionSheet
        show={showLevelSelect}
        actions={levelEnumData}
        onClose={() => setShowLevelSelect(false)}
        onSelect={d =>
          checkPermissions({
            dpCode: level,
            dpSchema,
            inService,
            isPidHadVAS,
            isBleOnline,
            successCb: () => actions[level].set(d.detail.id),
          })
        }
        cancelText={Strings.getLang('cancel')}
      />
    </View>
  );
};

export default HomePage;
