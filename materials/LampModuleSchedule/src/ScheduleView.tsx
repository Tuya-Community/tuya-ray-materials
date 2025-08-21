/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from 'react';
import { View, PageContainer, Image, ScrollView } from '@ray-js/ray';
import { useConfig } from '@ray-js/components-ty-config-provider';

import { useScheduleContext } from './context';
import Card from './components/Card';
import TopHeader from './components/TopHeader';
import Strings from './i18n';
import CountDownView from './countdown';
import TimingView from './timing';
import { useSafeArea } from './hooks';
import { EnumShowType } from './types';
import { IProps } from './props';
import { RTC_TIMER_LIST } from './timing/constant';
import { LampApi } from './utils/LampApi';
import { schedule } from './utils';
import Res from './res';

import './schedule.less';

const ScheduleView = (props: IProps) => {
  const {
    style = {},
    showHeader = true,
    supportCountdown,
    supportCloudTimer,
    supportRctTimer,
    showMenuButton = true,
    timingConfig,
    countdownConfig,
    customItemContainerStyle: _customItemContainerStyle,
    renderCustomItem,
    onCountdownToggle,
  } = props;
  const customItemContainerStyle = {
    padding: '0 32rpx',
    ..._customItemContainerStyle,
  };
  const theme = useConfig();
  const isSupportCountdown = supportCountdown;
  const isSupportTiming = supportCloudTimer || supportRctTimer;
  if (!isSupportCountdown && !isSupportTiming && !renderCustomItem) {
    return null;
  }

  const getThemeStyle = (darkStyle, lightStyle, importantStyle?) => {
    const isDark = theme?.theme === 'dark';
    if (importantStyle) {
      return importantStyle;
    }
    return isDark ? darkStyle : lightStyle;
  };

  const { countdown = 0 } = countdownConfig || {};

  const type = useMemo(() => {
    let typeRes = 0;
    if (isSupportTiming && isSupportCountdown) {
      typeRes = EnumShowType.all;
    } else if (renderCustomItem && isSupportTiming) {
      typeRes = EnumShowType.customAll;
    } else if (renderCustomItem && isSupportCountdown && !isSupportTiming) {
      typeRes = EnumShowType.customCountdown;
    } else if (renderCustomItem && !isSupportCountdown && !isSupportTiming) {
      typeRes = EnumShowType.custom;
    } else if (isSupportTiming) {
      typeRes = EnumShowType.timing;
    } else if (isSupportCountdown) {
      typeRes = EnumShowType.countdown;
    }
    return typeRes;
  }, []);
  // 展示倒计时
  const [showModal, setShowModal] = useState(false);
  const [opened, setOpened] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  useEffect(() => {
    setSwitchChecked(!!countdown);
  }, [countdown]);

  const { actions: scheduleActions, dispatch, props: scheduleProps } = useScheduleContext();
  useEffect(() => {
    if (supportRctTimer) {
      LampApi.fetchCloudConfig()
        .then(res => {
          const timerList = [];
          Object.keys(res).forEach(key => {
            const regexp = new RegExp(RTC_TIMER_LIST);
            if (regexp.test(key)) {
              timerList.push(...res[key]);
            }
          });
          dispatch(scheduleActions.initRtcTimerList(timerList));
          const timerStrList = (
            timerList as [
              {
                timerId: string;
                time: string;
                id: string;
                loops: string;
                status: number;
                dps: {
                  [v: string]: any;
                };
              }
            ]
          ).map(i => {
            return {
              dps: i?.dps,
              time: i.time,
              id: i?.id ?? i?.timerId,
              weeks: i.loops.split('').map((ii: string) => +ii),
              opened: Boolean(i.status),
            };
          });
          const { onBeforeTimerChange } = scheduleProps;
          const timerDataList = timerStrList.map(t => {
            return {
              ...t,
              timerId: t?.id,
            };
          });
          onBeforeTimerChange && onBeforeTimerChange(timerDataList, 'init', timerList);
          schedule.init(timerStrList);
        })
        .catch(err => {
          console.error(err, 'errerrerrerr');
        });
    }
  }, []);

  const safeArea = useSafeArea();
  // container加延时 展示动画效果
  const [showContainer, setShowContainer] = useState(false);
  useEffect(() => {
    const delayTime = 100;
    let timer = setTimeout(() => {
      setShowContainer(showModal);
    }, delayTime);
    return () => {
      clearTimeout(timer);
      timer = undefined;
    };
  }, [showModal]);
  const handleOpenToggle = (_opened: boolean) => {
    setOpened(_opened);
  };

  const [enableScroll, setEnableScroll] = useState(true);
  const renderTiming = () => {
    if (timingConfig && isSupportTiming) {
      return (
        <TimingView
          onToggleSwipe={(opened: boolean) => {
            setEnableScroll(!opened);
          }}
          type={type}
          config={timingConfig}
        />
      );
    }
    return null;
  };
  const renderTimingAndCountDown = () => {
    const { renderCustomItem } = props;
    const renderCountdownItem = () => {
      if (!isSupportCountdown) {
        return null;
      }
      const actionText = 'actionText';
      const handleSwitchChange = (checked: boolean) => {
        if (!checked) {
          // 关闭倒计时
          onCountdownToggle(0);
        }
      };
      const handleActionShow = () => {
        if (countdown > 0) {
          setShowModal(true);
          handleOpenToggle(true);
          return;
        }
        handleOpenToggle(false);
        setShowModal(true);
      };
      const hourTxt = Strings.getLang('hour');
      const minuteTxt = Strings.getLang('minute');
      const secondTxt = Strings.getLang('second');
      const hour = Math.floor(countdown / 3600);
      const minute = Math.floor((countdown % 3600) / 60);
      const second = countdown % 60;
      const openedText = Strings.getLang('countdownOpenedText');
      const countLabel = countdown
        ? `${hour}${hourTxt}${minute}${minuteTxt}${second}${secondTxt}${openedText}`
        : Strings.getLang('handler_countdownTip');
      const cardStyle = theme?.card || {};
      return (
        <View
          className="countdown-wrapper"
          style={{
            position: 'relative',
          }}
        >
          {!showHeader && (
            <View
              style={{
                height: `${safeArea}px`,
              }}
            />
          )}
          <Card
            style={cardStyle}
            type="switch"
            label={countLabel}
            renderIcon={() => {
              return (
                <Image
                  src={isDark ? Res.iconCountdown : Res.iconCountdownLight}
                  style={{
                    width: '48rpx',
                    height: '48rpx',
                    marginRight: '26rpx',
                  }}
                />
              );
            }}
            text={actionText}
            switchChecked={switchChecked}
            onClick={handleActionShow}
            onSwitchChange={handleSwitchChange}
          />
          {!switchChecked && (
            <View
              className="countdown-card-mask"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '100%',
                height: '70px',
              }}
              onClick={handleActionShow}
            />
          )}
        </View>
      );
    };
    if (
      type === EnumShowType.all ||
      type === EnumShowType.customAll ||
      type === EnumShowType.customCountdown
    ) {
      return (
        <ScrollView scrollY={enableScroll}>
          <View className="schedule-list-wrapper" style={customItemContainerStyle}>
            {renderCountdownItem()}
            {renderCustomItem && renderCustomItem()}
          </View>
          {showModal && (
            <PageContainer
              className="page-container-view countdown-view"
              round
              show={showContainer}
              position="bottom"
              onClickOverlay={() => setShowModal(false)}
            >
              {showContainer && (
                <CountDownView
                  countdown={countdown}
                  type={type}
                  showMenuButton={showMenuButton}
                  showHeader={showHeader}
                  opened={opened}
                  onCancel={() => setShowModal(false)}
                  onOpenToggle={handleOpenToggle}
                />
              )}
            </PageContainer>
          )}
          {renderTiming()}
        </ScrollView>
      );
    }

    if (type === EnumShowType.countdown || type === EnumShowType.custom) {
      return (
        <ScrollView scrollY={enableScroll}>
          <View className="schedule-list-wrapper" style={customItemContainerStyle}>
            {renderCustomItem && renderCustomItem()}
            {isSupportCountdown && (
              <CountDownView
                countdown={countdown}
                type={type}
                showMenuButton={showMenuButton}
                showHeader={showHeader}
                opened={opened}
                onCancel={() => setShowModal(false)}
                onOpenToggle={handleOpenToggle}
              />
            )}
          </View>
        </ScrollView>
      );
    }

    if (type === EnumShowType.timing) {
      return (
        <ScrollView scrollY={enableScroll}>
          <View className="schedule-list-wrapper" style={customItemContainerStyle}>
            {renderCustomItem && renderCustomItem()}
          </View>
          {isSupportTiming && (
            <TimingView
              onToggleSwipe={(opened: boolean) => {
                setEnableScroll(!opened);
              }}
              type={type}
              config={timingConfig}
            />
          )}
        </ScrollView>
      );
    }
    return null;
  };
  const isDark = theme.theme === 'dark';
  const defaultBg = isDark ? '#000' : '#fff';
  const realBg = theme.backgroundColor || theme.background || defaultBg;
  const scheduleStyle = {
    ...style,
    backgroundColor: realBg,
  };
  const { titlePrimary } = theme?.fontColor;
  const titleFontColor = getThemeStyle('#000', '#fff', titlePrimary);
  return (
    <View className="schedule-view-wrapper" style={scheduleStyle}>
      {showHeader && (
        <TopHeader
          theme={theme?.theme}
          title={Strings.getLang(supportRctTimer ? 'rtcTiming' : 'timing')}
          background={realBg}
          color={titleFontColor}
        />
      )}
      {renderTimingAndCountDown()}
    </View>
  );
};

export default React.memo(ScheduleView);
