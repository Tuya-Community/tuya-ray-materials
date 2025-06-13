import React, { useEffect, useState } from 'react';
import { View } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { usePanelConfig } from '@ray-js/panel-sdk';
import { Popup, ActionSheet } from '@ray-js/smart-ui';
import { LayoutHeader, LayoutPlayer, LayoutVas, LayoutFeature, LayoutFooter } from '@/components';
import { useMemoizedFn } from 'ahooks';
import { useCtx, useStore, Features } from '@ray-js/ipc-player-integration';
import { PlayerIntegrationContext } from '@/context/playerIntegration';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import { changePanelInfoState, publishDpOutTime, showToast, isPad } from '@/utils';
import { componentMap } from '@/config/componentMap';
import { useContainerDimensions, useCSSVar } from '@/hooks';
import Strings from '@/i18n';
import { REMOTE_CONTROL_TIME, REMOTE_CONTROL_RING_COLOR } from '@/config/constant';
import { panelCloudFunLabs } from '@/config/cameraData';

import controlBg from '@/res/control-opacity.png';
import styles from './index.module.less';

const Home = props => {
  const [vasLength, setVasLength] = useState(0);
  const { status: showSmartPopup, popupData } = useSelector(selectPanelInfoByKey('showSmartPopup'));
  const panelConfig = usePanelConfig();

  // 存储面板配置
  useEffect(() => {
    const panelConfigFun = panelConfig.fun;
    if (!panelConfigFun) return;
    Object.entries(panelConfigFun).forEach(([funKey, value]) => {
      const panelKey = panelCloudFunLabs[funKey];
      if (panelKey) {
        if (panelKey === 'playerFit') {
          // 此值以图片ID为存储进行适配， 如果图片变更，这里要改代码哦，会有线上图片变更出问题的可能性
          changePanelInfoState(
            panelKey,
            value.includes('17458097299b0f34fcd25') ? 'cover' : 'contain'
          );
        } else {
          changePanelInfoState(panelKey, value);
        }
      }
    });
  }, [panelConfig?.fun]);

  const { status: showActionSheet, actionData, title: actionTitle } = useSelector(
    selectPanelInfoByKey('showSmartActionSheet')
  );

  const instance = useCtx({
    devId: props.location.query.deviceId,
  });

  const { screenType, resolution, resolutionList } = useStore({
    screenType: instance.screenType,
    resolution: instance.resolution,
    resolutionList: instance.resolutionList,
  });

  useEffect(() => {
    Features.initPlayerWidgets(instance, {
      verticalResolutionCustomClick: true,
      hideHorizontalMenu: isPad,
      directionControlProps: {
        imgAnnulusBG: controlBg,
        arcEdgeProximityColor: REMOTE_CONTROL_RING_COLOR,
        showArcOnTouchInEdgeProximity: true,
        ringRadius: 86,
        thumbRadius: 21,
        moveThrottleTime: REMOTE_CONTROL_TIME,
      },
    });
  }, []);

  useEffect(() => {
    if (screenType === 'full') {
      onClose();
      onCancelActionSheet();
    }
  }, [screenType]);

  const { height: popupHeight } = useContainerDimensions('noPlayerWrapper', { screenType });

  // 当 popupHeight 改变时，更新 Redux
  useEffect(() => {
    changePanelInfoState('popupHeight', popupHeight);
  }, [popupHeight]);
  // 嵌套涉及布局定位的组件时渲染异常, 进行标记
  const [isReady, setIsReady] = useState(false);
  const onClose = () => {
    changePanelInfoState('showSmartPopup', { status: false, popupData, title: null });
  };
  const cssVars = useCSSVar();

  const onCancelActionSheet = useMemoizedFn(() => {
    instance.event.emit('disablePlayerTap', false);
    changePanelInfoState('showSmartActionSheet', {
      status: false,
      actionData,
      title: actionTitle,
    });
  });

  const onSelectActionSheet = useMemoizedFn(event => {
    console.log(event, 'event');
    const { dpCode, id, type, checked, value } = event.detail;
    type === 'dp' && publishDpOutTime(dpCode, id);

    if (type === 'resolution' && value === resolution) {
      showToast(Strings.getLang('resolution_already_current'));
      return false;
    }

    console.log(actionData, 'actionData===');
    const newActionData = actionData.map(item => ({
      ...item,
      checked: item.id === id,
    }));
    // 点击后直接选中某项数据，组件有问题，暂时不能选中

    changePanelInfoState('showSmartActionSheet', { status: true, actionData: newActionData });
    type === 'dp' &&
      changePanelInfoState('customEventDispatch', {
        eventName: 'enumDpChange',
        data: {
          dpCode,
          dpValue: id,
        },
      });

    if (type === 'resolution') {
      // 调整清晰度
      instance
        .setResolution(value)
        .then(res => {
          onCancelActionSheet();
        })
        .catch(err => {
          console.log(err, 'err');
          showToast(Strings.getLang('resolution_change_error'), 'error');
        });
    }
    return false;
  });

  const onVasDataLengthChange = value => {
    console.log(value, 'value');
    setVasLength(value);
  };

  /**
   * 调整清晰度
   */
  const changeResolution = useMemoizedFn(() => {
    if (screenType === 'full') {
      return false;
    }
    instance.event.emit('disablePlayerTap', true);
    changePanelInfoState('showSmartActionSheet', {
      status: true,
      actionData: resolutionList.map(item => {
        return {
          id: item,
          value: item,
          name: Strings.getLang(`resolution_${item}`),
          checked: item === resolution,
          type: 'resolution',
        };
      }),
      title: Strings.getLang('resolution_action_title'),
    });
    return false;
  });

  return (
    <PlayerIntegrationContext.Provider value={{ playerIntegrationInstance: instance }}>
      <View className={styles.layoutContainer} style={cssVars}>
        <LayoutHeader
          style={{ display: screenType === 'vertical' ? 'block' : 'none' }}
          titlePosition="left"
          titleStyle={styles.titleStyle}
        />
        <View className={styles.layoutContent}>
          <LayoutPlayer listenResolutionBtnClick={changeResolution} />
          <View id="noPlayerWrapper" className={styles.noPlayerWrapper}>
            <LayoutVas onVasDataLengthChange={onVasDataLengthChange} />
            <LayoutFeature vasLength={vasLength} />
          </View>
          {screenType === 'vertical' && <LayoutFooter />}
        </View>
        <Popup
          show={showSmartPopup}
          overlay={false}
          position="bottom"
          safeAreaInsetBottom={false}
          customStyle={{ height: `${popupHeight}px`, zIndex: 400 }} // 400是为了大于coverview的层级， coverview是300
          onClose={onClose}
          onAfterEnter={() => setIsReady(true)}
          onAfterLeave={() => setIsReady(false)}
        >
          <View>
            {popupData?.componentKey &&
              isReady &&
              React.createElement(componentMap[popupData.componentKey], {
                title: popupData.title,
                keyName: popupData.key,
              })}
          </View>
        </Popup>
        <ActionSheet
          title={actionTitle}
          show={showActionSheet}
          actions={actionData}
          zIndex={1000}
          cancelText={Strings.getLang('actionSheetCancel')}
          onCancel={onCancelActionSheet}
          onClickOverlay={onCancelActionSheet}
          onSelect={onSelectActionSheet}
          onAfterEnter={() => {
            ty.nativeDisabled(true);
          }}
          onLeave={() => {
            ty.nativeDisabled(false);
          }}
        />
      </View>
    </PlayerIntegrationContext.Provider>
  );
};

export default Home;
