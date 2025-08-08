import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, navigateTo, showToast, usePageEvent, getCurrentPages } from '@ray-js/ray';

import TopBar from '@/components/topBar';
import Strings from '@/i18n';
import { FuncType } from '@/constant';
import Container from '@/components/container';
import ConflictModal from '@/components/conflict';
import { ActionSheet, Dialog, Toast, ToastInstance } from '@ray-js/smart-ui';
import TimerTypeItem from '@/components/timer-type-item';
import Collapse from '@/components/collapse';
import { useDevice, useProps } from '@ray-js/panel-sdk';
import GlobalActionSheet, { ActionSheetInstance } from '@/components/action-sheet';
import { checkAddEnabled, debounce } from '@/utils';
import { useConfig } from '@/hooks/useConfig';
import { useAstronomical, useAstronomicalList } from '@/redux/modules/astronomicalSlice';
import { config } from '@/config';
import { useCommon } from '@/redux/modules/commonSlice';
import { isLANOnline, isLocalOnline } from '@ray-js/electrician-timing-sdk';
import { useCloudTimers, useEleCycle, useEleInching, useEleRandom } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { IconType } from '@/components/icon';
import { getFilteredSwitches } from '@/hooks/useSwitchFilter';
import { getArray } from '@/utils/array';
import styles from './index.module.less';
import CountdownList from '../countdown/list/List';
import ScheduleList from '../schedule/list/List';
import CycleList from '../cycle/list/List';
import RandomList from '../random/list/List';
import AstronomicalList from '../astronomical/list/List';
import InchingList from '../inching/list/List';

interface BlockData {
  isSupport: boolean;
  key: 'normal' | 'cycle' | 'random' | 'inching' | 'countdown' | 'astronomical';
  title: string;
  icon: IconType;
  Component: React.ElementType;
  total: number;
}

/**
 * 获取支持的数据
 * @returns
 */
const getSupportList = () => {
  return (
    [
      {
        isSupport: config.isSupportNormal !== 'n',
        key: 'normal',
        title: Strings.getLang('ret_tag_normal'),
        icon: 'normal',
        Component: ScheduleList,
        total: 0,
      },
      {
        isSupport: config.isSupportCycle !== 'n',
        key: 'cycle',
        title: Strings.getLang('ret_tag_cycle'),
        icon: 'cycle',
        Component: CycleList,
        total: 0,
      },
      {
        isSupport: config.isSupportRandom !== 'n',
        key: 'random',
        title: Strings.getLang('ret_tag_random'),
        icon: 'random',
        Component: RandomList,
        total: 0,
      },
      {
        isSupport: config.isSupportAstronomical !== 'n',
        key: 'astronomical',
        title: Strings.getLang('ret_tag_astronomical'),
        icon: 'sunset',
        Component: AstronomicalList,
        total: 0,
      },
      {
        isSupport: config.isSupportInching !== 'n',
        key: 'inching',
        title: Strings.getLang('ret_tag_inching'),
        icon: 'inching',
        Component: InchingList,
        total: 0,
      },
      {
        isSupport: config.isSupportCountdown !== 'n',
        key: 'countdown',
        title: Strings.getLang('ret_tag_countdown'),
        icon: 'countdown',
        Component: CountdownList,
        total: 0,
      },
    ] as BlockData[]
  ).filter((item) => item.isSupport);
};

const Home = () => {
  useConfig();
  const { dpNames } = useCommon();
  const firstLoaded = useRef(false);
  const devInfo = useDevice((d) => d.devInfo);
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState([]);
  const countdownCount = useProps((dpState) => {
    if (config.isSupportCountdown) {
      return config.countdownCodes.reduce((res, item) => {
        if (Number(dpState[item]) > 0) {
          res++;
        }
        return res;
      }, 0);
    }
    return 0;
  });

  const scheduleList = useCloudTimers();
  const cycleList = useEleCycle();
  const randomList = useEleRandom();
  const inchingList = useEleInching();
  const astronomicalList = useAstronomicalList();
  const { status: astronomicalStatus } = useAstronomical();
  console.log('scheduleList=======', scheduleList);
  const functions = useMemo(() => {
    return config.functions.filter((item) => {
      if (item.key === 'sunrise') {
        return astronomicalList.every((x) => x.astronomicalType !== 0);
      }
      if (item.key === 'sunset') {
        return astronomicalList.every((x) => x.astronomicalType !== 1);
      }
      return true;
    });
  }, [astronomicalList, visible]);

  const handleSelection = useCallback(
    debounce(async (item: FunctionData) => {
      setVisible(false);
      switch (item.key) {
        case FuncType.countdown:
          // 判断是否只有一个倒计时
          if (config.countdownCodes.length > 1) {
            ActionSheetInstance.show({
              title: Strings.getLang('ret_countdown_selection'),
              actions: config.switchCodes.map((item, i) => {
                return {
                  name: dpNames[item] || Strings.getDpLang(item),
                  value: config.countdownCodes[i],
                };
              }),
              onSelect: ({ detail }) => {
                navigateTo({ url: `../countdown/countdown/index?dpCode=${detail.value}&supportCountdown=y` });
              },
            });
            return;
          }
          // 去添加倒计时
          navigateTo({ url: '../countdown/countdown/index?supportCountdown=y' });
          break;
        case FuncType.normal:
          if (checkAddEnabled(scheduleList.list.length, FuncType.normal)) {
            // 如果是局域网情况，则提示不支持
            const lanOnline = await isLANOnline();
            if (lanOnline) {
              showToast({
                icon: 'error',
                title: Strings.getLang('ret_schedule_lan_tip'),
              });
              return;
            }
            // 去添加云定时
            navigateTo({ url: '../schedule/add/index' });
          }
          break;
        case FuncType.cycle:
          if (checkAddEnabled(cycleList.length, FuncType.cycle)) {
            navigateTo({ url: '../cycle/add/index?supportCycle=y' });
          }
          break;
        case FuncType.random:
          if (checkAddEnabled(randomList.length, FuncType.random)) {
            navigateTo({ url: '../random/add/index?supportRandom=y' });
          }
          break;
        case FuncType.inching:
          navigateTo({ url: '../inching/add/index?supportInching=y' });
          break;
        case FuncType.sunrise:
        case FuncType.sunset: {
          // 如果是本地连接情况，则提示不支持
          const lanOnline = await isLocalOnline();
          if (lanOnline) {
            showToast({
              icon: 'error',
              title: Strings.getLang('ret_schedule_local_tip'),
            });
            return;
          }
          navigateTo({ url: `../astronomical/add/index?type=${item.key}&supportAstronomical=y` });
          break;
        }
        default:
      }
    }),
    [
      dpNames,
      getArray(scheduleList.list).length,
      getArray(cycleList).length,
      getArray(randomList).length,
      astronomicalList,
      getArray(inchingList).length,
    ],
  );

  const handleShowSelection = useCallback(() => {
    if (!devInfo.isOnline) {
      // 设备不在线，不能添加
      showToast({
        icon: 'error',
        title: Strings.getLang('ret_schedule_offline_tip'),
      });
      return;
    }
    if (config.functions.length > 0) {
      setVisible(true);
    } else {
      // 提示无可用定时
      showToast({
        icon: 'error',
        title: Strings.getLang('ret_no_timer_enabled'),
      });
    }
  }, [devInfo.isOnline]);
  const handleHideSelection = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    // 第一次加载，要确保数据加完显示
    if (!firstLoaded.current) {
      // 云定时及天文定时都支持
      if (config.isSupportAstronomical === 'y' && config.isSupportNormal === 'y') {
        if (scheduleList.loading || astronomicalStatus === 'idle' || astronomicalStatus === 'loading') {
          return;
        }
      } else if (config.isSupportAstronomical === 'y') {
        if (astronomicalStatus === 'idle' || astronomicalStatus === 'loading') {
          return;
        }
      } else if (scheduleList.loading) {
        return;
      }
    }
    firstLoaded.current = true;

    // 只显示有数据列表的定时
    const result = getSupportList()
      .map((item) => {
        switch (item.key) {
          case 'normal':
            return {
              ...item,
              isSupport: getFilteredSwitches(scheduleList.list).length > 0,
              total: getArray(scheduleList.list).length,
            };
          case 'astronomical':
            return {
              ...item,
              isSupport: getArray(astronomicalList).length > 0,
              total: getArray(astronomicalList).length,
            };
          case 'cycle':
            return {
              ...item,
              isSupport: getFilteredSwitches(cycleList).length > 0,
              total: getArray(cycleList).length,
            };
          case 'random':
            return {
              ...item,
              isSupport: getFilteredSwitches(randomList).length > 0,
              total: getArray(randomList).length,
            };
          case 'inching':
            return {
              ...item,
              isSupport: getFilteredSwitches(inchingList).length > 0,
              total: getArray(inchingList).length,
            };
          case 'countdown':
            return {
              ...item,
              isSupport: countdownCount > 0,
              total: countdownCount,
            };
          default:
        }
        return item;
      })
      .filter((item) => item.isSupport);
    setList(result);
  }, [astronomicalStatus, countdownCount, cycleList, randomList, scheduleList, astronomicalList, inchingList]);

  useEffect(() => {
    let timer;
    if (scheduleList.loading || astronomicalStatus === 'loading') {
      clearTimeout(timer);
      ToastInstance.loading({
        duration: 0,
        forbidClick: true,
      });
    } else {
      timer = setTimeout(() => {
        ToastInstance.clear();
      }, 100);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [astronomicalStatus, scheduleList.loading]);

  return (
    <Container>
      <TopBar title={Strings.getLang('ret_title')} />
      {list.length === 0 && (
        <View className={styles.empty}>
          <View className={styles.emptyText}>{Strings.getLang('ret_no_data')}</View>
          <View className={styles.addBtn} hoverClassName="hover" onClick={handleShowSelection}>
            {Strings.getLang('ret_add')}
          </View>
        </View>
      )}
      {list.length > 0 && (
        <View className={styles.main}>
          <ScrollView scrollY className={styles.scroll} refresherTriggered={false}>
            <View className={styles.timerTips}>{Strings.getLang('ret_timer_tips')}</View>
            {list.map((item, i) => {
              return (
                <Collapse
                  key={item.key}
                  open={i === 0 && list.length === 1}
                  needUpdateHeight={item.total}
                  title={item.title}
                  icon={item.icon}
                >
                  <item.Component relativePath="../" />
                </Collapse>
              );
            })}
          </ScrollView>
          <View className={styles.bottom}>
            <View className={styles.addBtn} hoverClassName="hover" onClick={handleShowSelection}>
              {Strings.getLang('ret_add')}
            </View>
          </View>
        </View>
      )}
      <ActionSheet
        show={visible}
        title={Strings.getLang('ret_select_timer')}
        cancelText={Strings.getLang('cancel')}
        onClose={handleHideSelection}
        onCancel={handleHideSelection}
      >
        <>
          {functions.map((item) => {
            return <TimerTypeItem key={item.key} item={item} onSelect={handleSelection} />;
          })}
        </>
      </ActionSheet>
      <ConflictModal />
      <GlobalActionSheet />
      <Toast id="smart-toast" />
      <Dialog id="smart-dialog" />
    </Container>
  );
};

export default Home;
