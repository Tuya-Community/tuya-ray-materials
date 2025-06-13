// PTZ 焦距组件
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Text, View, router, getStorage } from '@ray-js/ray';
import _get from 'lodash/get';
import _find from 'lodash/find';
import { useDevice, useActions } from '@ray-js/panel-sdk';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import clsx from 'clsx';
import { devices } from '@/devices';
import { Widgets } from '@ray-js/ipc-player-integration';
import { useSelector } from 'react-redux';
import { Intercom } from '@/components/feature-tab-bar/components/intercom';
import { IconFont } from '@/components/icon-font';
import { PlayerIntegrationContext } from '@/context/playerIntegration';
import { addCollectionPointsInfo } from '@ray-js/ray-ipc-utils';
import IpcPtzZoom from '@ray-js/ipc-ptz-zoom';
import { PublicTabs } from '@/components/public-tabs';
import Strings from '@/i18n';
import {
  getDpCodeByDpId,
  getDpCodeIsExist,
  clickOutTime,
  clearPublishDpOutTime,
  rgbaToHex,
  changePanelInfoState,
} from '@/utils';
import { getPtzSize, getZoomSize } from '@/config/cameraData';
import { CollectPoint } from '../collect-point';
import Styles from './index.module.less';
import { getPtzData, getZoomData } from './configData';

interface IProps {}

export const Ptz: React.FC<IProps> = (props: IProps) => {
  const actions = useActions();
  const devInfo = useDevice(device => device.devInfo);
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  const isPreviewOn = useSelector(selectPanelInfoByKey('isPreviewOn'));
  const isIntercomSupported = useSelector(selectPanelInfoByKey('isIntercomSupported'));
  const { playerIntegrationInstance } = useContext(PlayerIntegrationContext);
  const popupHeight = useSelector(selectPanelInfoByKey('popupHeight'));
  const { popupData } = useSelector(selectPanelInfoByKey('showSmartPopup'));
  const ptzTimeId = useRef(null);
  const zoomTimeId = useRef(null);
  const addCollectFlag = useRef(false);
  const [activeKey, setActiveKey] = useState('ptz');
  const [showCollect] = useState(getDpCodeIsExist('memory_point_set'));

  // ptz数据
  const ptzData = useRef(getPtzData());
  // zoom数据
  const zoomData = useRef(getZoomData());

  // ptz组件
  const PtzCom = () => {
    return (
      <View className={clsx(Styles.contentWrapper)}>
        <IpcPtzZoom
          disabled={!isPreviewOn}
          ptzData={ptzData.current}
          zoomData={zoomData.current.filter(item => item.show)}
          zoomSize={getZoomSize(popupHeight)}
          ptzSize={getPtzSize(popupHeight)}
          onTouchPtzStart={onTouchPtzStart}
          onTouchPtzEnd={onTouchPtzEnd}
          onTouchZoomStart={onTouchZoomStart}
          onTouchZoomEnd={onTouchZoomEnd}
          brandColor={brandColor}
          iconClassName={clsx(Styles['arrow-icon-wrapper'])}
        />
      </View>
    );
  };

  // 收藏点组件
  const CollectCom = () => {
    return (
      <View className={clsx(Styles.contentWrapper)}>
        <CollectPoint />
      </View>
    );
  };

  const getTabsData = () => {
    return [
      {
        key: 'ptz',
        title: Strings.getLang('tab_menu_ptz_item'),
        show: getDpCodeIsExist('ptz_control'),
        component: PtzCom,
      },
      {
        key: 'collect',
        title: Strings.getLang('tab_menu_collect_item'),
        show: getDpCodeIsExist('memory_point_set'),
        component: CollectCom,
      },
    ];
  };

  // 定义tabs数据
  const [tabsData] = useState(getTabsData());

  useEffect(() => {
    const id = devices.common.onDpDataChange(listenDpChange);
    return () => {
      devices.common.offDpDataChange(id);
    };
  }, []);

  const listenDpChange = data => {
    const { dps } = data;
    const dpsArray = Object.keys(dps);
    // 这里只需判定单DP上报的情况
    if (dpsArray.length === 1) {
      dpsArray.forEach(value => {
        const dpCode = getDpCodeByDpId(Number(value));
        if (dpCode === 'memory_point_set') {
          clearPublishDpOutTime();
          const json = JSON.parse(dps[value] || '{}');
          const { type, data } = json || {};
          const error = data?.error || 0;
          if ((type === 1 && error <= 10000) || type === 2 || type === 4) {
            if (addCollectFlag.current) {
              ty.showToast({
                icon: 'success',
                title: Strings.getLang('ptz_add_collect_success_tip'),
              });
              addCollectFlag.current = false;
            }
          } else if (type === 1 && error === 10002) {
            ty.showToast({ icon: 'error', title: Strings.getLang('ipc_err_memory_point_cruise') });
          }
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      if (ptzTimeId.current) {
        clearInterval(ptzTimeId.current);
        ptzTimeId.current = null;
      }
      if (zoomTimeId.current) {
        clearInterval(zoomTimeId.current);
        zoomTimeId.current = null;
      }
    };
  }, []);

  const onTouchPtzStart = data => {
    const { type } = data;
    const sndDpValue = _get(_find(ptzData.current, { type }), 'dpValue', null);
    actions.ptz_control.set(sndDpValue);
    ptzTimeId.current = setInterval(() => {
      actions.ptz_control.set(sndDpValue);
    }, 1000);

    getStorage({
      key: `${devInfo.devId}_ptzControlTip}`,
      success: res => {
        if (!res.data) {
          playerIntegrationInstance.addContent('absolute', {
            id: 'ptzControlTipId',
            content: props => {
              return <Widgets.PtzControlTip {...props} />;
            },
            absoluteContentClassName: 'ipc-player-plugin-ptz-control-tip-wrap',
            initProps: {
              ...props,
            },
          });
        }
      },
    });
  };
  const onTouchPtzEnd = () => {
    actions.ptz_stop.set(true);
    if (ptzTimeId.current) {
      clearInterval(ptzTimeId.current);
      ptzTimeId.current = null;
    }
  };

  const onTouchZoomStart = data => {
    const { type } = data;
    const sndDpValue = _get(_find(zoomData.current, { type }), 'dpValue', null);
    actions.zoom_control.set(sndDpValue);
    zoomTimeId.current = setInterval(() => {
      actions.zoom_control.set(sndDpValue);
    }, 1000);
  };

  const onTouchZoomEnd = () => {
    actions.zoom_stop.set(true);
    if (zoomTimeId.current) {
      clearInterval(zoomTimeId.current);
      zoomTimeId.current = null;
    }
  };

  const onChangeActiveKey = (key: string) => {
    setActiveKey(key);
  };

  const onAddCollect = async () => {
    if (!isPreviewOn) {
      return false;
    }
    addCollectFlag.current = false;
    const themeInfo = ty.getThemeInfo();
    ty.showModal({
      title: Strings.getLang('ipc_collect_name'),
      cancelColor: rgbaToHex(themeInfo['--app-B3-N3']),
      // cancelColor: '#dd6657',
      isShowGlobal: true,
      inputAttr: {
        placeholder: Strings.getLang('ipc_collect_name_placeholder'),
        placeHolderColor: rgbaToHex(themeInfo['--app-B3-N7']),
        // placeHolderColor: '#dd6657',
        backgroundColor: rgbaToHex(themeInfo['--app-B3']),
        // backgroundColor: '#000000',
        textColor: rgbaToHex(themeInfo['--app-B3-N2']),
        // textColor: '#dd6657',
      },
      confirmText: Strings.getLang('ipc_alert_save'),
      cancelText: Strings.getLang('ipc_alert_cancel'),
      modalStyle: 1,
      success: async res => {
        if (res.confirm) {
          addCollectFlag.current = true;
          try {
            clickOutTime();
            const result = await addCollectionPointsInfo(devInfo.devId, res?.inputContent);
            //  成功后会上报两次，一次是type 1，一次是type4，监听到上报type 1 或 4就拉接口
            if (result.code === -1) {
              clearPublishDpOutTime();
              ty.showToast({ icon: 'error', title: result.msg });
              return;
            }
          } catch (err) {
            clearPublishDpOutTime();
          }
        }
      },
      fail: err => {
        console.log(err, 'err');
      },
    });
    return true;
  };

  const onRightBtn = () => {
    router.push('/collect-edit');
  };

  const onClose = () => {
    changePanelInfoState('showSmartPopup', { status: false, popupData, title: null });
  };

  return (
    <View className={clsx(Styles.comContainer)}>
      <PublicTabs tabs={tabsData} activeKey={activeKey} changeActiveKey={onChangeActiveKey} />

      <View className={clsx(Styles.closeIconContainer)} onClick={onClose}>
        <IconFont icon="close" otherClassName={Styles.popIcon} />
      </View>

      {activeKey === 'collect' && (
        <View className={clsx(Styles.editIconContainer)} onClick={onRightBtn}>
          <IconFont icon="edit" otherClassName={Styles.popIcon} />
        </View>
      )}
      <View
        className={clsx(Styles.footerMenuContainer)}
        style={
          activeKey !== 'ptz' || (!isIntercomSupported && !showCollect)
            ? { display: 'none' }
            : undefined
        }
      >
        {isIntercomSupported && (
          <View className={clsx(Styles.footerItem)}>
            <View className={clsx(Styles.footerItemIcon, !isPreviewOn && Styles.disableItem)}>
              <Intercom
                talkingColor="#ffffff"
                className={clsx(Styles.interComContainer, Styles.footerIcon)}
              />
            </View>
            <Text className={clsx(Styles.footerItemText)}>
              {Strings.getLang('ptz_footer_menu_intercom')}
            </Text>
          </View>
        )}

        {showCollect && (
          <View className={clsx(Styles.footerItem)} onClick={onAddCollect}>
            <View
              className={clsx(Styles.footerItemIcon, !isPreviewOn && Styles.disableItem)}
              style={{ backgroundColor: brandColor }}
            >
              <IconFont icon="add-collect" otherClassName={clsx(Styles.footerIcon)} />
            </View>
            <Text className={clsx(Styles.footerItemText)}>
              {Strings.getLang('ptz_footer_menu_add_collect')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
