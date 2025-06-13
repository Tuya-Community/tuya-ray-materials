// PTZ 焦距组件
import React, { useState, useEffect, useRef } from 'react';
import { Text, View } from '@ray-js/ray';
import RectDirectionControl from '@ray-js/direction-control';
import { useThrottleFn } from 'ahooks';
import _get from 'lodash/get';
import _find from 'lodash/find';
import { useDevice, useActions, useProps } from '@ray-js/panel-sdk';
import { Slider } from '@ray-js/smart-ui';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { PopupTitle } from '@/components/popup-title';
import { IconFont } from '@/components/icon-font';
import Strings from '@/i18n';
import { toPx, getDpCodeIsExist } from '@/utils';
import { REMOTE_CONTROL_TIME, REMOTE_CONTROL_RING_COLOR } from '@/config/constant';
import { useTheme } from '@/hooks';
import bgDark from '@/res/control-bg-dark.png';
import bgLight from '@/res/control-bg-light.png';
import Styles from './index.module.less';

interface IProps {
  title: string;
}

const logManager = ty.getLogManager({
  tag: 'ipc-panel',
  fail(params) {
    console.log('创建日志失败');
    console.log('params', params);
  },
});

const ringRadius = 103;
const thumbRadius = 28;

export const RemoteControl: React.FC<IProps> = (props: IProps) => {
  const { title } = props;
  const theme = useTheme();
  const devInfo = useDevice(device => device.devInfo);
  const touchingRef = useRef(false);
  const actions = useActions();
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  const selectDevDp = devInfo?.dpCodes || {};
  const ptzTimeId = useRef(null);
  const zoomTimeId = useRef(null);
  const prevRotate = useRef('-1');
  const { recharge, follow, speed } = useProps(props => ({
    recharge: props.ipc_auto_recharge,
    follow: props.motion_tracking,
    speed: props.ipc_movement_speed,
  }));
  const [sliderValue, setSliderValue] = useState(speed || 0);

  const shouldRenderRechargeBtn = getDpCodeIsExist('ipc_auto_recharge');

  const shouldRenderTrackingBtn = getDpCodeIsExist('motion_tracking');

  const shouldRenderControlMenu = shouldRenderRechargeBtn || shouldRenderTrackingBtn;

  const shouldRenderSpeedControl = getDpCodeIsExist('ipc_movement_speed');

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

  useEffect(() => {
    if (!touchingRef.current) {
      setSliderValue(speed);
    }
  }, [speed]);

  const handMenuClick = (key: 'recharge' | 'follow') => {
    if (key === 'recharge') {
      actions.ipc_auto_recharge.toggle();
    } else if (key === 'follow') {
      actions.motion_tracking.toggle();
    }
  };

  const renderControlMenu = () => {
    return (
      <View
        className={clsx(Styles.menuContainer)}
        style={{
          height: `${toPx(ringRadius * 2)}px`,
          justifyContent:
            !shouldRenderRechargeBtn || !shouldRenderTrackingBtn ? 'center' : 'space-between',
        }}
      >
        {shouldRenderRechargeBtn && (
          <View
            onClick={() => handMenuClick('recharge')}
            className={clsx(Styles.menuItemContainer)}
          >
            <View
              className={clsx(Styles.menuItemIconWrap)}
              style={{ backgroundColor: recharge ? brandColor : undefined }}
            >
              <IconFont
                style={{ color: recharge ? '#fff' : undefined }}
                icon="auto-recharge"
                otherClassName={clsx(Styles.menuItemIcon)}
              />
            </View>
            <View className={clsx(Styles.menuItemTitle)}>
              {Strings.getLang('remoteControlAutoRecharge')}
            </View>
          </View>
        )}
        {shouldRenderTrackingBtn && (
          <View onClick={() => handMenuClick('follow')} className={clsx(Styles.menuItemContainer)}>
            <View
              style={{ backgroundColor: follow ? brandColor : undefined }}
              className={clsx(Styles.menuItemIconWrap)}
            >
              <IconFont
                style={{ color: follow ? '#fff' : undefined }}
                icon="auto-follow"
                otherClassName={clsx(Styles.menuItemIcon)}
              />
            </View>
            <View className={clsx(Styles.menuItemTitle)}>
              {Strings.getLang('remoteControlAutoFollow')}
            </View>
          </View>
        )}
      </View>
    );
  };

  const onSliderChange = (value: number) => {
    setSliderValue(value);
    actions.ipc_movement_speed.set(value);
    touchingRef.current = false;
  };

  const renderControlSlider = () => (
    <View className={clsx(Styles.sliderContainer)}>
      <View className={clsx(Styles.sliderTitleWrap)}>
        <Text className={clsx(Styles.titleLabel)}>
          {Strings.getLang('remoteControlSliderTitle')}
        </Text>
        <View className={clsx(Styles.circleDivider)} />
        <Text className={clsx(Styles.titleValue)} style={{ color: brandColor }}>
          {`${sliderValue}${Strings.getLang('remoteControlSliderUnit')}`}
        </Text>
      </View>
      <View className={clsx(Styles.sliderWrapper)}>
        <Slider
          style={{ marginTop: 0 }}
          min={0}
          max={100}
          step={1}
          value={sliderValue}
          minTrackRadius="26rpx"
          minTrackHeight="32rpx"
          maxTrackRadius="26rpx"
          maxTrackHeight="32rpx"
          onAfterChange={onSliderChange}
          onChange={() => {
            touchingRef.current = true;
          }}
          thumbWidth={26}
          thumbHeight={26}
          minTrackColor={brandColor}
          thumbStyle={{
            background: brandColor,
            border: '6rpx solid #FFFFFF',
          }}
        />
        <View className={clsx(Styles.sliderLabel)}>
          <View className={clsx(Styles.leftLabel)}>
            {Strings.getLang('remoteControlSliderLabelSlow')}
          </View>
          <View className={clsx(Styles.rightLabel)}>
            {Strings.getLang('remoteControlSliderLabelFast')}
          </View>
        </View>
      </View>
    </View>
  );

  const sendDpValueFn = (value: string) => {
    if (value === prevRotate.current) return;
    actions.ipc_direction_control.set(value);
    if (value === '-1') {
      logManager.log({
        message: `=== panel set remote -1, time:${new Date().getTime()}`,
        fail(params) {
          console.log('日志失败', params);
        },
      });
    }
    prevRotate.current = value;
  };

  // const { run: sendDpValue } = useThrottleFn(sendDpValueFn, {
  //   wait: REMOTE_CONTROL_TIME,
  //   leading: true,
  //   trailing: true,
  // });
  const sendDpValue = sendDpValueFn;

  const handTouchMove = value => {
    sendDpValue(String(value));
    ty.nativeDisabled(true);
  };

  const handTouchStart = value => {
    ty.nativeDisabled(true);
    sendDpValue(String(value));
  };

  const handTouchEnd = (_, time?: number) => {
    if (time) {
      logManager.log({
        message: `=== touch end, rjs:${time}, js:${new Date().getTime()}`,
        fail(params) {
          console.log('日志失败', params);
        },
      });
    }
    sendDpValue('-1');
    ty.nativeDisabled(false);
  };
  return (
    <View className={clsx(Styles.comContainer)}>
      <PopupTitle title={title} />
      <View className={Styles.warp}>
        <View
          className={clsx(Styles.contentWrapper)}
          style={{ justifyContent: shouldRenderControlMenu ? 'space-between' : 'center' }}
        >
          {shouldRenderControlMenu && renderControlMenu()}
          {getDpCodeIsExist('ipc_direction_control') && (
            <View>
              <RectDirectionControl
                ringRadius={toPx(ringRadius, 0)}
                thumbRadius={toPx(thumbRadius, 0)}
                onTouchStart={handTouchStart}
                imgAnnulusBG={theme === 'light' ? bgLight : bgDark}
                onTouchMove={handTouchMove}
                onTouchEnd={handTouchEnd}
                className={Styles.control}
                value={0}
                touchDistanceThreshold={30}
                showArcOnTouchInEdgeProximity
                // arcEdgeProximityColor={brandColor}
                arcEdgeProximityColor={REMOTE_CONTROL_RING_COLOR}
                onMoveNonIntersection={handTouchEnd}
                moveThrottleTime={REMOTE_CONTROL_TIME}
              />
            </View>
          )}
        </View>
        {shouldRenderSpeedControl && renderControlSlider()}
      </View>
    </View>
  );
};
