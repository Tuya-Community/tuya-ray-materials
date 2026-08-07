/*
 * @Description: 小组件引导页 - 桌面快捷方式、桌面小组件、控制中心快捷
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from '@ray-js/ray';
import { useSelector } from '@/redux';

import { tttGetQuickEntryList, tttSetQuickEntryEnabled } from '@/api/ttt';
import type { QuickEntryInfo, QuickEntryState } from '@/api/ttt.interface';
import {
  QuickEntryTypeEnum,
  QuickEntryComponentIdEnum,
  QuickEntryStateEnum,
} from '@/constant/enums';
import { TopBar } from '@/components';
import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';

// @ts-ignore
import styles from './index.module.less';

/** 控制中心第二步文案，将 app 名称加粗展示 */
const Step2WithAppNameBold: React.FC = () => {
  const { appName } = useSelector(state => state.appInfo);
  const step2 = Strings.getLang('widget_control_center_step2');
  const fallbackAppName = Strings.getLang('widget_app_fallback');
  const safeAppName = appName || fallbackAppName;
  const replaced = step2.replace('{appName}', safeAppName);
  const parts = replaced.split(
    new RegExp(`(${safeAppName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`)
  );
  if (parts.length < 2) return <>{replaced}</>;
  return (
    <>
      {parts[0]}
      <Text className={styles.stepTuyaBold}>{parts[1]}</Text>
      {parts[2] || ''}
    </>
  );
};

const WidgetGuide: React.FC = () => {
  return (
    <View className={styles.controlCenterBottom}>
      <Text className={styles.howToAdd}>{Strings.getLang('widget_how_to_add')}</Text>
      <View className={styles.steps}>
        <Text className={styles.step}>1. {Strings.getLang('widget_ios_desktop_step1')}</Text>
        <Text className={styles.step}>2. {Strings.getLang('widget_ios_desktop_step2')}</Text>
        <Text className={styles.step}>
          3. <Step2WithAppNameBold />
        </Text>
      </View>
    </View>
  );
};

const Index = () => {
  interface QuickEntryAddRes {
    type: number;
    componentId: number;
    enabled: number;
  }

  useAppFloatCtrl(true);
  const { platform } = useSelector(state => state.systemInfo);
  const isIOS = platform?.toLowerCase() === 'ios';
  const [quickEntryList, setQuickEntryList] = useState<QuickEntryInfo[] | null>(null);
  const [widgetAddedSmall, setWidgetAddedSmall] = useState<QuickEntryState>(
    QuickEntryStateEnum.NOT_ADDED
  );
  const [widgetAddedLarge, setWidgetAddedLarge] = useState<QuickEntryState>(
    QuickEntryStateEnum.NOT_ADDED
  );
  const shortcutClickLockedRef = useRef(false);
  const widgetSmallClickLockedRef = useRef(false);
  const widgetLargeClickLockedRef = useRef(false);

  useEffect(() => {
    tttGetQuickEntryList()
      .then((res: QuickEntryInfo[]) => {
        setQuickEntryList(res);
        if (!isIOS) {
          // 安卓下需要设置componentId
          setWidgetAddedSmall(
            res.filter(e => e.componentId === QuickEntryComponentIdEnum.WIDGET_1X1)[0].state
          );
          setWidgetAddedLarge(
            res.filter(e => e.componentId === QuickEntryComponentIdEnum.WIDGET_2X2)[0].state
          );
        }
      })
      .catch(() => setQuickEntryList([]));
  }, []);

  const onQuickEntryAddEvent = (response: QuickEntryAddRes) => {
    if (response?.type !== QuickEntryTypeEnum.ANDROID_WIDGET) {
      return;
    }

    widgetSmallClickLockedRef.current = false;
    if (response.enabled === 1 && response.componentId === QuickEntryComponentIdEnum.WIDGET_1X1) {
      setWidgetAddedSmall(QuickEntryStateEnum.ADDED);
      ty.showToast({ title: Strings.getLang('widget_added'), icon: 'success' });
      return;
    }
    if (response.enabled === 1 && response.componentId === QuickEntryComponentIdEnum.WIDGET_2X2) {
      setWidgetAddedLarge(QuickEntryStateEnum.ADDED);
      ty.showToast({ title: Strings.getLang('widget_added'), icon: 'success' });
      return;
    }

    ty.showToast({
      title: Strings.getLang('widget_add_failed'),
      icon: 'error',
    });
  };

  useEffect(() => {
    // @ts-ignore
    ty.wear?.onQuickEntryAddEvent?.(onQuickEntryAddEvent);
    return () => {
      // @ts-ignore
      ty.wear?.offQuickEntryAddEvent?.(onQuickEntryAddEvent);
    };
  }, []);

  const showShortcutSection =
    Array.isArray(quickEntryList) &&
    quickEntryList.some(
      e =>
        e.type === QuickEntryTypeEnum.ANDROID_SHORTCUT || e.type === QuickEntryTypeEnum.IOS_SHORTCUT
    );
  const showWidgetSection =
    Array.isArray(quickEntryList) &&
    quickEntryList.some(
      e => e.type === QuickEntryTypeEnum.ANDROID_WIDGET || e.type === QuickEntryTypeEnum.IOS_WIDGET
    );
  const showControlCenter =
    Array.isArray(quickEntryList) &&
    quickEntryList.some(
      e => e.type === QuickEntryTypeEnum.ANDROID_TILE || e.type === QuickEntryTypeEnum.IOS_TILE
    );
  const showWIDGET1X1 =
    Array.isArray(quickEntryList) &&
    quickEntryList.some(e => e.componentId === QuickEntryComponentIdEnum.WIDGET_1X1);
  const showWIDGET2X2 =
    Array.isArray(quickEntryList) &&
    quickEntryList.some(e => e.componentId === QuickEntryComponentIdEnum.WIDGET_2X2);

  const handleAddShortcut = async () => {
    if (shortcutClickLockedRef.current) {
      return;
    }
    shortcutClickLockedRef.current = true;
    const request = isIOS
      ? {
          type: QuickEntryTypeEnum.IOS_SHORTCUT,
          enabled: 1,
        }
      : {
          type: QuickEntryTypeEnum.ANDROID_SHORTCUT,
          componentId: QuickEntryComponentIdEnum.SHORTCUT,
          enabled: 1,
        };
    try {
      await tttSetQuickEntryEnabled(request);
      setTimeout(() => {
        ty.showToast({
          title: Strings.getLang('widget_add_shortcut_try_toast'),
          icon: 'success',
        });
      }, 500);
    } catch (error) {
      console.error(error);
      ty.showToast({
        title: Strings.getLang('widget_add_failed'),
        icon: 'error',
      });
    } finally {
      // 避免用户连续点击导致重复触发
      setTimeout(() => {
        shortcutClickLockedRef.current = false;
      }, 800);
    }
  };

  const handleAddWidgetSmall = () => {
    if (widgetSmallClickLockedRef.current) {
      return;
    }
    widgetSmallClickLockedRef.current = true;
    tttSetQuickEntryEnabled({
      type: QuickEntryTypeEnum.ANDROID_WIDGET,
      componentId: QuickEntryComponentIdEnum.WIDGET_1X1,
      enabled: 1,
    })
      .catch(err => {
        console.error(err);
        widgetSmallClickLockedRef.current = false;
        ty.showToast({
          title: Strings.getLang('widget_add_failed'),
          icon: 'error',
        });
      })
      .finally(() => {
        setTimeout(() => {
          widgetSmallClickLockedRef.current = false;
        }, 800);
      });
  };

  const handleAddWidgetLarge = () => {
    if (widgetLargeClickLockedRef.current) {
      return;
    }
    widgetLargeClickLockedRef.current = true;
    tttSetQuickEntryEnabled({
      type: QuickEntryTypeEnum.ANDROID_WIDGET,
      componentId: QuickEntryComponentIdEnum.WIDGET_2X2,
      enabled: 1,
    })
      .catch(err => {
        console.error(err);
        widgetSmallClickLockedRef.current = false;
        ty.showToast({
          title: Strings.getLang('widget_add_failed'),
          icon: 'error',
        });
      })
      .finally(() => {
        setTimeout(() => {
          widgetLargeClickLockedRef.current = false;
        }, 800);
      });
  };

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('widget')} />
      <ScrollView scrollY className={styles.scroll}>
        {showShortcutSection && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              {Strings.getLang('widget_desktop_shortcut')}
            </Text>
            <View className={styles.card}>
              <View className={styles.cardTop}>
                <ThemedImage
                  imageName="shortcutIcon"
                  src={Res.shortcutIcon}
                  className={styles.img}
                />
              </View>
              <View className={styles.shortcutDivider} />
              <View className={styles.shortcutCardBottom}>
                <Text className={styles.shortcutAddLink} onClick={handleAddShortcut}>
                  {Strings.getLang('widget_add_to_desktop')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 桌面小组件：iOS 与安卓展示不同内容，仅当接口返回 type 为 101 或 201 时展示 */}
        {showWidgetSection && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>{Strings.getLang('widget_desktop_widget')}</Text>
            <View className={styles.card}>
              <View className={styles.cardTop}>
                <ThemedImage imageName="widgetIcon" src={Res.widgetIcon} className={styles.img} />
              </View>
              <View className={styles.shortcutDivider} />
              {isIOS ? (
                <WidgetGuide />
              ) : showWIDGET2X2 ? (
                widgetAddedLarge === QuickEntryStateEnum.HIDE_ADD ? (
                  <WidgetGuide />
                ) : (
                  <View className={styles.shortcutCardBottom}>
                    <Text
                      className={
                        widgetAddedLarge === QuickEntryStateEnum.ADDED
                          ? styles.shortcutAddLinkDisabled
                          : styles.shortcutAddLink
                      }
                      onClick={
                        widgetAddedLarge === QuickEntryStateEnum.ADDED
                          ? undefined
                          : handleAddWidgetLarge
                      }
                    >
                      {widgetAddedLarge === QuickEntryStateEnum.ADDED
                        ? Strings.getLang('widget_added')
                        : Strings.getLang('widget_add_to_desktop')}
                    </Text>
                  </View>
                )
              ) : null}
            </View>
            {!isIOS && showWIDGET1X1 && (
              <View className={styles.card}>
                <View className={styles.cardTop}>
                  <ThemedImage
                    imageName="shortcutIcon"
                    src={Res.shortcutIcon}
                    className={styles.img}
                  />
                </View>
                <View className={styles.shortcutDivider} />
                {widgetAddedSmall === QuickEntryStateEnum.HIDE_ADD ? (
                  <WidgetGuide />
                ) : (
                  <View className={styles.shortcutCardBottom}>
                    <Text
                      className={
                        widgetAddedSmall === QuickEntryStateEnum.ADDED
                          ? styles.shortcutAddLinkDisabled
                          : styles.shortcutAddLink
                      }
                      onClick={
                        widgetAddedSmall === QuickEntryStateEnum.ADDED
                          ? undefined
                          : handleAddWidgetSmall
                      }
                    >
                      {widgetAddedSmall === QuickEntryStateEnum.ADDED
                        ? Strings.getLang('widget_added')
                        : Strings.getLang('widget_add_to_desktop')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        {/* 控制中心快捷 */}
        {showControlCenter && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>{Strings.getLang('widget_control_center')}</Text>
            <View className={styles.card}>
              <View className={styles.cardTop}>
                <ThemedImage
                  imageName="controlCenterIcon"
                  src={Res.controlCenterIcon}
                  className={styles.img}
                />
              </View>
              <View className={styles.shortcutDivider} />
              <View className={styles.controlCenterBottom}>
                <Text className={styles.howToAdd}>{Strings.getLang('widget_how_to_add')}</Text>
                <View className={styles.steps}>
                  <Text className={styles.step}>
                    1. {Strings.getLang('widget_control_center_step1')}
                  </Text>
                  <Text className={styles.step}>
                    2. <Step2WithAppNameBold />
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        <View className={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  );
};

export default Index;
