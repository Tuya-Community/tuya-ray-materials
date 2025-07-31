import React, { useState } from 'react';
import { useProps, useActions } from '@ray-js/panel-sdk';
import { getDeviceInfo } from '@ray-js/ray';
import Strings from '@/i18n';
import { updateCommonInfo } from '@/redux/modules/commonInfoSlice';
import { getCServicesAbility, setCServicesPop } from '@/api/atop';
import dpCodes from '@/constant/dpCodes';

const useCheckPermissions = ({
  dpSchema,
  commonInfo,
  isOnline = false,
  devId,
  dispatch = null,
}) => {
  const [isBleOnline, setIsBleOnline] = useState(false);

  const actions = useActions();
  const { inService, isPidHadVAS, isActive, interactionType, assocaitedDps, isBleXDevice } =
    commonInfo;

  const blelockSwitchDpVal = useProps(props => props[dpCodes.blelockSwitch]);
  const bucketSwitchDpVal = useProps(props => props[dpCodes.bucketLock]);
  const tailBoxSwitchDpVal = useProps(props => props[dpCodes.tailBoxLock]);
  const dpValueS = {
    blelock_switch: blelockSwitchDpVal,
    bucket_lock: bucketSwitchDpVal,
    tail_box_lock: tailBoxSwitchDpVal,
  };

  // 跳转C端续费小程序 需要获取 uuid
  const toRenewal = () => {
    ty.showLoading({ title: '' });
    getDeviceInfo({
      deviceId: devId,
      success: res => {
        const { uuid } = res;
        if (uuid) {
          ty.hideLoading();
          const url = `godzilla://tyg7bnteoaewk07k4p/pages/home/index?devId=${devId}&uuid=${uuid}`;
          ty.router({
            url: `miniApp?url=${encodeURIComponent(url)}`,
            fail: err => {
              console.log('err', err);
            },
          });
        } else {
          ty.showToast({
            title: 'uuid is not exit',
            icon: 'none',
          });
          ty.hideLoading();
        }
      },
    });
  };

  // 检查DP下发权限
  const checkPermissions = ({
    dpCode,
    successCb,
    cancelCb,
  }: {
    dpCode: string;
    successCb: () => void;
    cancelCb?: () => void;
  }) => {
    const { extContent, dpId } = dpSchema[dpCode];
    const isExtNull = extContent === '' || extContent === undefined;
    const route = isExtNull ? 0 : JSON.parse(extContent).route;
    // 若智能服务已到期/未配置赠送用户未购买时，当用户通过蜂窝通道控制车辆时
    if (!inService && isPidHadVAS && (route === 0 || (route === 1 && !isBleOnline) || isExtNull)) {
      // 当用户通过蜂窝通道控制车辆时:route === 0 || isExtNull || route === 1 && !isBleOnline
      ty.showModal({
        title: '',
        content: Strings.getLang('expireControl'),
        showCancel: false,
        confirmText: Strings.getLang('confirm'),
        success: ({ confirm }) => {
          if (confirm && dpCode === dpCodes.blelockSwitch) {
            cancelCb();
          }
        },
      });
      return;
    }
    // 不同时满足 ble+x设备且蜂窝激活， 拓展模块是禁用：扩展模块未激活，该功能无法使用
    const notCheckHide = isBleXDevice && isActive;
    if (!notCheckHide && interactionType === 'disable' && assocaitedDps.indexOf(dpId) !== -1) {
      ty.showModal({
        title: '',
        content: Strings.getLang('extensionDisable'),
        confirmText: Strings.getLang('confirm'),
        cancelText: Strings.getLang('cancel'),
        success: ({ confirm, cancel }) => {
          if (confirm && dpCode === dpCodes.blelockSwitch) {
            cancelCb();
          }
          if (cancel && dpCode === dpCodes.blelockSwitch) {
            cancelCb();
          }
        },
      });
      return;
    }

    // 设备为蜂窝+蓝牙设备，当DP的route=0或1时，并且仅蜂窝在线时，部分DP进行弹窗提示：
    const checkDpArray = [
      dpCodes.start,
      dpCodes.blelockSwitch,
      dpCodes.bucketLock,
      dpCodes.tailBoxLock,
    ];
    if (isBleXDevice && checkDpArray.indexOf(dpCode) !== -1 && isOnline && !isBleOnline) {
      if ([0, 1].indexOf(route) === -1) return;
      const val = dpValueS[dpCode];
      if (val) return;
      ty.showModal({
        title: '',
        content: Strings.getLang(`blex_wifi_${dpCode}` as any),
        confirmText: Strings.getLang('confirm'),
        cancelText: Strings.getLang('cancel'),
        success: ({ confirm, cancel }) => {
          if (confirm) {
            if (dpCode === dpCodes.blelockSwitch) {
              successCb();
            } else {
              actions[dpCode].set(true);
            }
          }
          if (cancel) {
            if (dpCode === dpCodes.blelockSwitch) {
              cancelCb && cancelCb();
            }
            console.log('取消 :>> ');
          }
        },
      });
      return;
    }
    // 在蜂窝模组激活后，判断DP的高级能力
    if (isBleXDevice && isActive && route === 2 && !isBleOnline) {
      ty.showModal({
        title: '',
        content: Strings.getLang('retryConnectBle'),
        showCancel: false,
        confirmText: Strings.getLang('confirm'),
      });
      return;
    }
    successCb();
  };

  // 设置蓝牙在线状态
  const setBleOnline = (b: boolean) => setIsBleOnline(b);

  // C端续费能力判断
  const checkServiceAbility = async () => {
    try {
      const res = await getCServicesAbility(devId);
      if (!res) return; // 蓝牙设备没有智能服务
      const { inService, isPidHadVAS, commodityUrl, hadPopup } = res;
      dispatch(updateCommonInfo({ inService, isPidHadVAS, commodityUrl: commodityUrl || '' }));
      if (!hadPopup && isPidHadVAS && inService) {
        // 品牌方有配置C端用户续费套餐有赠送
        if (commodityUrl && commodityUrl !== '') {
          ty.showModal({
            title: '',
            content: Strings.getLang('serviceActive'),
            confirmText: Strings.getLang('goCheck'),
            cancelText: Strings.getLang('confirm'),
            showCancel: true,
            success: ({ confirm }) => {
              if (confirm) {
                toRenewal();
              }
            },
          });
        } else {
          // 涂鸦默认赠送
          ty.showModal({
            title: '',
            content: Strings.getLang('serviceActive'),
            showCancel: false,
            confirmText: Strings.getLang('confirm'),
          });
        }
        await setCServicesPop(devId);
      }
    } catch (error) {
      console.log('checkServiceAbility error :>> ', error);
    }
  };

  // 检查是否隐藏dp 前提是不满足  ble+x设备且isActive 两个条件
  const checkHideDp = (dpCode: string) => {
    let isHide = false;
    const notCheckHide = isBleXDevice && isActive;
    if (!notCheckHide && interactionType === 'hide') {
      const dpId = dpSchema[dpCode].id;
      if (assocaitedDps.indexOf(dpId) !== -1) {
        isHide = true;
      }
    }
    return isHide;
  };

  return { checkPermissions, setBleOnline, checkServiceAbility, toRenewal, checkHideDp };
};

export default useCheckPermissions;
