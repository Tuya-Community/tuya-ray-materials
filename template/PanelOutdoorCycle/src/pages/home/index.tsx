import React, { useCallback, useEffect, useState } from 'react';
import { isEmpty, debounce } from 'lodash';
import { useSelector } from 'react-redux';
import {
  Text,
  View,
  CoverView,
  Image,
  Map,
  Button,
  usePageEvent,
  onDpDataChange,
  offDpDataChange,
  getBLEOnlineState,
  onBLEConnectStatusChange,
  offBLEConnectStatusChange,
  onBluetoothAdapterStateChange,
  offBluetoothAdapterStateChange,
  subscribeBLEConnectStatus,
  unsubscribeBLEConnectStatus,
  getDeviceInfo,
} from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import warningIcon from '@tuya-miniapp/icons/dist/svg/Warning';
import {
  SwiperView,
  OutdoorTop,
  Signal,
  ControlMenu,
  Battery,
  DynamicNumber,
  OutdoorSlider,
  ActionSheetEnum,
} from '@/components';
import { useDevice, useProps, GetTTTEventListenerParams } from '@ray-js/panel-sdk';
import store from '@/redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { updateCommonInfo, commonCheckInfo } from '@/redux/modules/commonInfoSlice';
import Strings from '@/i18n';
import {
  getCarLatestLocation,
  getDeviceIcon,
  getBanner,
  getRowData,
  isBLEXDeviceTTT,
  isBLEXDeviceActive,
  getExtendedModuleExtConfig,
} from '@/api/atop';
import { marker, markerOffline, modeChange, modeChangeLight } from '@/res';
import { supportDp, scaleDpValue } from '@/utils';
import dpCodes from '@/constant/dpCodes';
import { defaultLocation } from '@/constant';
import useCheckPermissions from '@/hooks/useCheckPermissions';
import useJumpPage from '@/hooks/useJumpPage';
import styles from './index.module.less';

type BluetoothAdapterStateData = GetTTTEventListenerParams<typeof onBluetoothAdapterStateChange>;
type BleConnectStatusData = GetTTTEventListenerParams<typeof onBLEConnectStatusChange>;

export function Home() {
  const { dispatch } = store;
  const systemInfo = useSelector(selectSystemInfo);
  const { screenHeight, theme, statusBarHeight } = systemInfo;
  const commonInfo = useSelector(commonCheckInfo);
  const { inService, isPidHadVAS, commodityUrl, isActive, activeType, isBleXDevice } = commonInfo;
  const devInfo = useDevice(device => device.devInfo);
  const { isOnline, devId, productId } = devInfo;
  const dpSchema = useDevice(device => device.dpSchema);

  const { checkPermissions, setBleOnline, checkServiceAbility, toRenewal, checkHideDp } =
    useCheckPermissions({
      dpSchema,
      commonInfo,
      isOnline,
      devId,
      dispatch,
    });
  const { goToRNPage } = useJumpPage(devInfo);

  // 相关DP值
  const enduranceMileageDpVal = useProps(props => props[dpCodes.enduranceMileage]);
  const mileageTotalDpVal = useProps(props => props[dpCodes.mileageTotal]);
  const level = useProps(props => props[dpCodes.level]);
  const unitSetDpVal = useProps(props => props[dpCodes.unitSet]);
  // 总里程
  const totalMileageValue = supportDp(dpCodes.mileageTotal, dpSchema)
    ? scaleDpValue(dpCodes.mileageTotal, mileageTotalDpVal, dpSchema, unitSetDpVal !== 'km')
    : 0;
  // 续航里程
  const remainMileageValue = supportDp(dpCodes.enduranceMileage, dpSchema)
    ? scaleDpValue(dpCodes.enduranceMileage, enduranceMileageDpVal, dpSchema, unitSetDpVal !== 'km')
    : 0;

  const [isBleOnline, setIsBleOnline] = useState(false); // 蓝牙在线状态
  const [bannerData, setBannerData] = useState([]); // banner数据
  const [carLocation, setCarLocation] = useState(defaultLocation); // 车辆位置
  const [cloudImg, setCloudImg] = useState('');
  const [isSupportNavigation, setIsSupportNavigation] = useState(false); // 是否支持导航

  // ActionSheet
  const [actionSheet, setActionSheet] = useState({
    show: false,
    code: '',
  });

  useEffect(() => {
    getInit();

    // dp监听更新状态  判断是否是BLE+X设备
    const onDpChange = res => {
      if (Object.keys(res.dps).length > 10) {
        bleUpdate();
      }
    };
    onDpDataChange(onDpChange);

    // 监听蓝牙适配器状态变化
    subscribeBLEConnectStatus({ deviceId: devId });
    getBLEOnlineState({
      deviceId: devId,
      success: data => {
        if (typeof data.isOnline !== 'undefined') {
          setIsBleOnline(data.isOnline);
        }
      },
    });
    onBluetoothAdapterStateChange(handleBluetoothAdapterStateChange); // 监听蓝牙适配器状态变化事件，需要申请蓝牙权限
    onBLEConnectStatusChange(handleBleConnectStatusChange); // BLE(thing)连接状态变更通知事件
    return () => {
      unsubscribeBLEConnectStatus({ deviceId: devId });
      offBluetoothAdapterStateChange(handleBluetoothAdapterStateChange);
      offBLEConnectStatusChange(handleBleConnectStatusChange);
      offDpDataChange(onDpChange);
    };
  }, []);

  usePageEvent('onShow', () => {
    getDeviceInfo({
      deviceId: devId,
      success: res => {
        const { uuid } = res;
        checkServiceAbility(uuid);
      },
    });
  });

  const getInit = async () => {
    ty.createMapContext('myMap'); // 创建地图上下文
    getBannerData(); // 获取banner数据
    getCarLocation(); // 获取车辆位置
    getDeviceCloudImg(); // 获取车辆配置图
    checkBleXDevice(); // 检查是否为BLE+X设备
    // 是否支持 导航
    const isSupportNav = await getRowData('is_support_app_navigation');
    setIsSupportNavigation(isSupportNav);
  };

  // 监听蓝牙适配器状态变化事件，需要申请蓝牙权限
  const handleBluetoothAdapterStateChange = useCallback(
    (data: BluetoothAdapterStateData) => {
      bleUpdate();
      if (!data.available) {
        setIsBleOnline(false);
      }
      if (!isBleOnline && data.available) {
        setIsBleOnline(true);
      }
    },
    [isBleOnline, setIsBleOnline]
  );

  // BLE(thing)连接状态变更通知事件
  const handleBleConnectStatusChange = useCallback(
    (data: BleConnectStatusData) => {
      if (data.deviceId === devId) {
        setIsBleOnline(data.status === 'CONNECTED');
        bleUpdate();
      }
    },
    [devId]
  );

  useEffect(() => {
    const checkActive = ({ devID, status }) => {
      console.log('插拔模块监听 :>> ');
      if (isBleOnline && devID === devId) {
        // 在BLE连接状态并且在首页时蜂窝模组插入时，提示：“云模组已插入”
        ty.showToast({ title: Strings.getLang(`bleXActive${status}` as any), icon: 'none' });
        checkBleXDevice();
      }
    };
    ty.device.onRegisterExtModuleStatus(checkActive);
    return () => {
      ty.device.offRegisterExtModuleStatus(checkActive);
    };
  }, [isBleOnline, devId]);

  useEffect(() => {
    // 更新 hooks 的蓝牙在线状态
    setBleOnline(isBleOnline);
  }, [isBleOnline]);

  // 检查是否为BLE+X设备
  const checkBleXDevice = () => {
    bleUpdate();
    getExtConfigInfo();
  };

  // 判断是否为BLE+X设备 并更新状态
  const bleUpdate = async () => {
    try {
      const isBlexDev = await isBLEXDeviceTTT(devId);
      dispatch(updateCommonInfo({ isBleXDevice: isBlexDev }));
      if (isBlexDev) {
        // 判断是否蜂窝激活
        const active = await isBLEXDeviceActive(devId);
        dispatch(updateCommonInfo({ isActive: active }));
      }
    } catch (error) {
      console.log('isBLEXDeviceTTT error :>> ', error);
    }
  };

  const getExtConfigInfo = async () => {
    try {
      // 获取 扩展模组关联事件配置
      const extConfigRes = await getExtendedModuleExtConfig(devId);
      if (!isEmpty(extConfigRes) && typeof extConfigRes === 'object' && extConfigRes !== null) {
        dispatch(updateCommonInfo({ ...extConfigRes }));
      }
    } catch (error) {
      console.log('getExtendedModuleExtConfig error :>> ', error);
    }
  };

  // 获取车辆位置
  const getCarLocation = () => {
    getCarLatestLocation(devId)
      .then(res => {
        if (isEmpty(res)) return;
        const { lat, lon } = res;
        setCarLocation({ latitude: lat, longitude: lon });
      })
      .catch(err => console.log('getLatestLocation error >> ', err));
  };

  // 根据设备id 获取配置图
  const getDeviceCloudImg = () => {
    getDeviceIcon(devId)
      .then(res => {
        if (isEmpty(res)) return;
        const { icon } = res[productId];
        setCloudImg(icon);
      })
      .catch(err => console.log('getDeviceIcon error >> ', err));
  };

  // 获取banner数据
  const getBannerData = () => {
    getBanner()
      .then(res => {
        if (isEmpty(res)) return;
        const filteredData = res.filter(item => item.activityType === 1);
        const newData = filteredData.length > 3 ? filteredData.slice(0, 3) : filteredData;
        setBannerData(newData);
      })
      .catch(err => console.log('getBanner error >> ', err));
  };

  // 骑行导航二级页
  const goToTrackGuidePage = () => {
    ty.router({
      url: `tuyaSmart://tsod_cycling_navigation?devId=${devId}`,
    });
  };

  // 定位二级页
  const goToPositionPage = debounce(() => {
    goToRNPage('000001isb3');
  }, 500);

  const bannerMenuContent = useCallback(() => {
    return (
      <>
        {!isEmpty(bannerData) && <SwiperView bannerData={bannerData} />}
        <View className={styles.menuBg}>
          <ControlMenu
            theme={theme}
            isHideMap={screenHeight <= 800 && !isEmpty(bannerData)}
            goToRNPage={goToPositionPage}
            showChangeMode={() => {
              checkPermissions({
                dpCode: dpCodes.mode,
                successCb: () => setActionSheet({ show: true, code: dpCodes.mode }),
              });
            }}
            checkPermissions={(dp, successCB) =>
              checkPermissions({ dpCode: dp, successCb: successCB })
            }
            checkHideDp={dp => checkHideDp(dp)}
            isBleOnline={isBleOnline}
          />
        </View>
      </>
    );
  }, [bannerData, isBleOnline]);

  const mapContent = useCallback(() => {
    const isHideMap = screenHeight <= 800 && !isEmpty(bannerData);
    if (isHideMap) return null;
    return (
      <View className={styles.mapView}>
        <CoverView className={styles.clickView} onClick={goToPositionPage} />
        <Map
          className={styles.map}
          longitude={carLocation.longitude}
          latitude={carLocation.latitude}
          id="myMap"
          markers={
            [
              {
                id: 1,
                name: 'carLocation',
                longitude: carLocation.longitude,
                latitude: carLocation.latitude,
                iconPath: isOnline ? marker : markerOffline,
              },
            ] as any
          }
        />
        <View className={styles.mapTop} />
        <View className={styles.mapBottom} />
      </View>
    );
  }, [bannerData, carLocation]);

  return (
    <View className={styles.container}>
      {/* 地图父元素不能设置背景，为了适配APP主题色包一层 */}
      <View className={styles.topContent}>
        {/* 顶部 */}
        <OutdoorTop />
        {/* 信号信息 & 里程数据 */}
        <View className={`${styles.signalInfo} ${styles.row}`}>
          <Signal checkHideDp={dp => checkHideDp(dp)} isBleOnline={isBleOnline} />
          {supportDp(dpCodes.mileageTotal, dpSchema) && !checkHideDp(dpCodes.mileageTotal) && (
            <View>
              <Text className={styles.totalMillage}>{totalMileageValue}</Text>
              <Text
                className={styles.totalMillageUtil}
                style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
              >
                {unitSetDpVal === 'km' ? Strings.getLang('km') : Strings.getLang('mile')}
              </Text>
            </View>
          )}
        </View>
        {/* 车辆信息 */}
        <View className={styles.carInfoContent}>
          {cloudImg !== '' && <Image src={cloudImg} className={styles.carImg} />}
          <View className={styles.carInfoLeft}>
            <Battery />
            {supportDp(dpCodes.enduranceMileage, dpSchema) &&
              !checkHideDp(dpCodes.enduranceMileage) && (
                <View className={styles.numberView}>
                  {remainMileageValue === 0 ? (
                    <Text className={styles.zeroNum}>0</Text>
                  ) : (
                    <DynamicNumber counts={remainMileageValue} point={1} />
                  )}
                  <Text className={styles.util}>
                    {unitSetDpVal === 'km' ? Strings.getLang('km') : Strings.getLang('mile')}
                  </Text>
                </View>
              )}
            {supportDp(dpCodes.enduranceMileage, dpSchema) &&
              !checkHideDp(dpCodes.enduranceMileage) && (
                <Text className={styles.subTitle}>{Strings.getLang('remainMileage')}</Text>
              )}
            {supportDp(dpCodes.level, dpSchema) && !checkHideDp(dpCodes.level) && (
              <Button
                type="primary"
                className={styles.changeModeBtn}
                onClick={() => {
                  checkPermissions({
                    dpCode: dpCodes.level,
                    successCb: () => {
                      setActionSheet({ show: true, code: dpCodes.level });
                    },
                  });
                }}
              >
                <Text className={styles.text}>{Strings.getDpLang(dpCodes.level, level)}</Text>
                <Image
                  className={styles.icon}
                  src={theme === 'dark' ? modeChange : modeChangeLight}
                />
              </Button>
            )}
          </View>
        </View>
      </View>
      {/* banner图 & 更多操作按钮 */}
      {bannerMenuContent()}
      {/* 地图 */}
      {mapContent()}
      <View className={styles.tabBar} />
      {/* 底部 */}
      <View className={styles.bottom}>
        {supportDp(dpCodes.blelockSwitch, dpSchema) && !checkHideDp(dpCodes.blelockSwitch) && (
          <OutdoorSlider
            checkPermissions={(dp, successCB, cancelCB) =>
              checkPermissions({ dpCode: dp, successCb: successCB, cancelCb: cancelCB })
            }
            isSupportNavigation={isSupportNavigation}
          />
        )}
        {isSupportNavigation && (
          <View
            className={`${styles.go} ${isOnline && styles.onlineGo}`}
            onClick={goToTrackGuidePage}
            style={{
              backgroundColor: theme === 'dark' ? '#202124' : '#fff',
              width: supportDp(dpCodes.blelockSwitch, dpSchema) ? '95px' : '100%',
            }}
          >
            <Text
              className={`${styles.goText} ${isOnline && styles.goTextOnline}`}
              style={{
                color: isOnline
                  ? theme === 'dark'
                    ? '#fff'
                    : 'var(--app-M1)'
                  : theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)',
              }}
            >
              {I18n.t('go')}
            </Text>
          </View>
        )}
      </View>
      {/* ble+x设备 未激活 且是手动 弹窗提示 */}
      {isBleXDevice && !isActive && activeType === 'manual_active' && (
        <View className={styles.toastView} style={{ top: `${(statusBarHeight + 44) * 2}rpx` }}>
          <View className={styles.toastLeft}>
            <Icon size={22} name={warningIcon} color="#ffa000" />
            <Text className={styles.toastText}>{Strings.getLang('expansionInsert')}</Text>
          </View>
          <View
            className={styles.toastBtnText}
            onClick={() => ty.device.openDeviceDetailPage({ deviceId: devId })}
          >
            {Strings.getLang('activation')}
          </View>
        </View>
      )}
      {/* 续费过期提示 */}
      {!inService && isPidHadVAS && (
        <View className={styles.toastView} style={{ top: `${statusBarHeight + 39}px` }}>
          <View className={styles.toastLeft}>
            <Icon size={22} name={warningIcon} color="#FF4444" />
            <Text className={styles.toastText}>
              {commodityUrl && commodityUrl !== ''
                ? Strings.getLang('serviceExpire')
                : Strings.getLang('serviceExpireBrand')}
            </Text>
          </View>
          <View>
            {commodityUrl && commodityUrl !== '' && (
              <View className={styles.toastBtnText} onClick={toRenewal}>
                {Strings.getLang('clickRenew')}
              </View>
            )}
          </View>
        </View>
      )}
      {/* 枚举值 */}
      <ActionSheetEnum
        show={actionSheet.show}
        code={actionSheet.code}
        onClose={() => setActionSheet({ ...actionSheet, show: false })}
        title={Strings.getLang(`changeTitle${actionSheet.code}` as any)}
      />
    </View>
  );
}

export default Home;
