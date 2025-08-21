/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  View,
  ScrollView,
  Image,
  Text,
  Button,
  PageContainer,
  Switch,
  showToast,
  showModal as showModalApi,
  hideMenuButton,
  showMenuButton,
} from '@ray-js/ray';
import _findIndex from 'lodash/findIndex';
import TyTimePicker from '@ray-js/components-ty-time-picker';
import ActionSheet from '@ray-js/components-ty-actionsheet';
import TyCell from '@ray-js/components-ty-cell';
import ConfigProvider, { useConfig } from '@ray-js/components-ty-config-provider';
import Swipeout from '@ray-js/components-ty-swipeout';

import { EnumShowType, TimeConfig } from '../types';

import Radio from '../components/Radio';
import Card from '../components/Card';
import {
  useHourSystem,
  useSafeArea,
  useTriggerChildrenFunction,
  useSystemInfo,
  useIphoneX,
} from '../hooks';
import { getTimerList, addTimer, updateTimer, changeTimerStatus, removeTimer } from './common';
import Res from '../res';
import Strings from '../i18n';
import {
  onlyOneLoop,
  everydayLoop,
  actionSheetConfig,
  cellConfig,
  weekList,
  defaultActionList,
  defaultCycleList,
  RTC_TIMER_LIST,
} from './constant';
import { schedule } from '../utils';
import { useScheduleContext } from '../context';
import { LampApi } from '../utils/LampApi';
import './index.less';

const timerOffset = 1000;

type TTimeData = {
  id: string;
  time: string;
  timerId: string;
  weeks: number[];
  opened: boolean;
  dps: Record<string, any>;
};
type Props = {
  type: number;
  config: TimeConfig;
  onToggleSwipe: (opened: boolean) => void;
};

type TTimer = {
  status: any;
  time: string;
  loops: string;
  dps: Record<string, any>;
  id?: string;
  timerId?: string;
};

const onSaveTransformer = data => {
  // 此处进行执行行为的dp 加工处理， 返回处理后的dp键值对
  const { time, action } = data;
  const { dpList } = action;
  const codeDps = {};
  dpList.forEach(i => {
    const { code, value: _v } = i;
    codeDps[code] = _v;
  });
  const res = {
    time,
    codeDps,
    actionValue: action.value,
  };
  return [res];
};
const getAllDpIdAndDpCode = (_actionList: any[]) => {
  const codeDps = {};
  if (Array.isArray(_actionList)) {
    _actionList.forEach(action => {
      const { dpList = [] } = action;
      if (Array.isArray(dpList)) {
        dpList.forEach(dp => {
          codeDps[dp.code] = dp.id;
        });
      }
    });
  }
  return codeDps;
};

const TimingView = (props: Props) => {
  const { state, props: scheduleProps, dispatch, actions: scheduleActions } = useScheduleContext();
  const { type, config, onToggleSwipe } = props;
  const isOnlyOneTimer = +type === EnumShowType.timing; // 只有定时 无其他
  const { is12Hour, is24Hour } = useHourSystem();
  const { actionList = defaultActionList } = config;
  const [timerDataListState, _setTimerDataList] = useState<TTimer[]>([]);
  const systemInfo = useSystemInfo();
  const safeArea = useSafeArea();
  const refList = useRef([]);
  const setTimerDataList = rest => {
    _setTimerDataList(rest);
    refList.current = rest;
  };
  const timerDataList = timerDataListState.sort((a, b) => {
    return b?.time?.localeCompare(a?.time);
  });
  const isIphoneX = useIphoneX();
  // 选择的星期
  const [checkedWeeks, setCheckedWeek] = useState<{ label: string; value: number }[]>([]);
  // 是否展示弹层
  const [showModal, setShowModal] = useState(false);
  const [customCycleModal, setCustomCycleModal] = useState(false);
  // 选中的日期picker数据
  const now = dayjs();
  const [currentTimePicker, setCurrentTimerPicker] = useState({
    hour: now.hour(),
    minute: now.minute(),
  });
  useEffect(() => {
    const { supportRctTimer } = scheduleProps || {};
    if (supportRctTimer) {
      setTimerDataList(state.rtcTimerList);
    }
  }, [state.rtcTimerList]);
  // 当前点击操作的定时数据
  const [currentTime, setCurrentTime] = useState<TTimer>(null);
  // 标题数据
  const [title, setTitle] = useState(Strings.getLang('addTiming'));
  // 执行周期
  enum ECurrentCycle {
    everyday = 0,
    once = 1,
    custom = 2,
    none = -1,
  }
  const [currentCycle, setCurrentCycle] = useState(ECurrentCycle.once);
  const [cycleVisible, setCycleVisible] = useState(false);

  const hourTrans = (hour: string | number) => {
    if (is24Hour) {
      return hour;
    }
    return +hour === 0 ? 12 : hour;
  };
  const fetchTimerList = () => {
    const { supportCloudTimer, onBeforeTimerChange } = scheduleProps || {};
    return getTimerList(state)
      .then((timerList = []) => {
        timerList && setTimerDataList(timerList as []);
        if (Array.isArray(timerList)) {
          const scheduleList = timerList.map(i => {
            const id = supportCloudTimer ? i?.id : i?.timerId;
            return {
              id,
              timerId: i?.timerId,
              time: i?.time,
              weeks: i?.loops.split('').map((ii: string) => +ii),
              opened: !!i.status,
              dps: i?.dps || {},
            };
          });
          onBeforeTimerChange && onBeforeTimerChange(scheduleList, 'init', timerList);
          schedule.init(scheduleList);
        }
        return timerList;
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setShowModal(false);
  };
  const isPassedTimerFn = async (
    timer: TTimeData | TTimeData[],
    _type: 'add' | 'remove' | 'update' | 'init'
  ) => {
    const { onBeforeTimerChange } = scheduleProps || {};
    if (!onBeforeTimerChange) {
      return true;
    }
    const isPassed =
      onBeforeTimerChange && (await onBeforeTimerChange(timer, _type, timerDataList));
    return isPassed !== false;
  };
  const getTime = (currentTimePickerRes: { hour: number; minute: number }): string => {
    const { hour, minute } = currentTimePickerRes;
    const _hour = hour >= 10 ? hour : `0${hour}`;
    const _minute = minute >= 10 ? minute : `0${minute}`;
    return `${_hour}:${_minute}`;
  };
  const saveRctTimerList = (scheduleList, cb) => {
    const savedList = [];
    const scheduleListCopy = [...scheduleList];
    while (scheduleListCopy.length > 0) {
      savedList.push(scheduleListCopy.splice(0, 4));
    }
    if (scheduleList.length % 4 === 0) {
      savedList.push(null);
    }
    savedList.forEach((item, _idx) => {
      setTimeout(() => {
        LampApi.saveCloudConfig &&
          LampApi.saveCloudConfig(`${RTC_TIMER_LIST}_${_idx}`, item)
            .then(() => {
              cb && cb();
            })
            .catch(err => {
              console.error(err, 'saveCloudConfig RTC_TIMER_LIST');
              setShowModal(false);
            });
      }, 100 * _idx);
    });
  };
  // 保存计划
  const handleSave = async () => {
    if (currentAction < 0) {
      showToast({
        title: Strings.getLang('please_select_action'),
        icon: 'error',
        mask: true,
      });
      return;
    }
    if (currentCycle < 0) {
      showToast({
        title: Strings.getLang('please_select_cycle'),
        icon: 'error',
        mask: true,
      });
      return;
    }
    // 编辑模式
    const isEditMode = !!currentTime;

    // 默认一次
    let loopsStr = onlyOneLoop;
    // 每天
    if (currentCycle === defaultCycleList[0].value) {
      loopsStr = everydayLoop;
    } else if (currentCycle === defaultCycleList[2].value) {
      // 自定义
      if (checkedWeeks.length) {
        const loopsList = weekList.map(i => {
          return checkedWeeks.find(w => w.value === i.value) ? 1 : 0;
        });
        loopsStr = loopsList.join('');
      }
    }
    const time = getTime(currentTimePicker);
    const currentActionItem = actionList.find(a => a.value === currentAction);
    const transformedData = onSaveTransformer({ time, action: currentActionItem });
    const allDpIdAndDpCode = getAllDpIdAndDpCode(actionList);
    const [transedData] = transformedData;
    const { codeDps, actionValue } = transedData;
    const dps = {};
    Object.entries(codeDps).forEach(([dpCode, dpValue]) => {
      const dpId = allDpIdAndDpCode[dpCode];
      dpId && (dps[dpId] = dpValue);
      if (!dpId) {
        console.warn('dpCode:', dpCode, 'cant get');
      }
    });

    const actions = {
      time,
      dps,
      codeDps,
      actionValue,
    };
    // 编辑模式
    if (isEditMode) {
      if (currentTime.id || currentTime.timerId) {
        const updateParams = {
          currentTime,
          loops: loopsStr,
          actions,
        };
        const { time: timeStr } = actions;
        const changedTimer = {
          time: timeStr,
          id: currentTime.id || currentTime.timerId,
          dps,
          weeks: loopsStr.split('').map((ii: string) => +ii),
          opened: true,
        };
        const isPassed = await isPassedTimerFn(
          {
            ...changedTimer,
            timerId: changedTimer.id,
          },
          'update'
        );
        if (!isPassed) {
          return;
        }
        const isConflict = schedule.update(changedTimer, {
          time: currentTime.time,
          id: currentTime.id || currentTime.timerId,
          weeks: currentTime.loops.split('').map((ii: string) => +ii),
          opened: !!currentTime?.status,
        });
        if (isConflict) {
          return;
        }
        const _params = {
          aliasName: currentActionItem.value, // 存储当前选择的action
        };
        updateTimer(updateParams, timerDataList, _params).then(
          ({ scheduleList, scheduleShowData }) => {
            // 处理本地定时
            const { supportRctTimer, onRtcTimeUpdate } = scheduleProps || {};
            if (supportRctTimer) {
              saveRctTimerList(scheduleList, () => {
                dispatch(scheduleActions?.updateRtcTimer(scheduleShowData));
                setShowModal(false);
                showToast({
                  title: Strings.getLang('edit_save'),
                  icon: 'success',
                  mask: true,
                });
              });
              const { actionValue } = actions;
              const currentActionItem = actionList.find(a => +a.value === +actionValue);
              const rctTimerPassed = {
                id: scheduleShowData?.id || scheduleShowData?.timerId,
                time: scheduleShowData?.time,
                timerId: scheduleShowData?.timerId || scheduleShowData?.id,
                weeks: scheduleShowData?.loops?.split('').map((ii: string) => +ii),
                opened: !!scheduleShowData?.status,
                dps: scheduleShowData?.dps,
                action: currentActionItem,
              };
              onRtcTimeUpdate && onRtcTimeUpdate(rctTimerPassed);
              // 清空上一次选中的值
              setCheckedWeek([]);
              setCurrentCycle(ECurrentCycle.none);
              return;
            }
            setShowModal(false);
            showToast({
              title: Strings.getLang('edit_save'),
              icon: 'success',
              mask: true,
            });
            fetchTimerList();
          }
        );
      }
      return;
    }
    // 新增模式
    const { supportCloudTimer, supportRctTimer, timingConfig } = scheduleProps || {};
    // 如果新增本地定时超过10个定时，则提示
    const { timerLimitNum = 0 } = timingConfig || {};
    const MAX_RTC_TIMER_COUNT = timerLimitNum || 10;
    if (supportRctTimer && timerDataList.length >= MAX_RTC_TIMER_COUNT) {
      showToast({
        title: Strings.formatValue('timer_count_maxium_local', `${MAX_RTC_TIMER_COUNT}`),
        icon: 'error',
        mask: true,
      });
      return;
    }
    // 如果新增云端定时超过30个定时，则提示
    const MAX_CLOUD_TIMER_COUNT = timerLimitNum || 30;
    if (supportCloudTimer && timerDataList.length >= MAX_CLOUD_TIMER_COUNT) {
      showToast({
        title: Strings.formatValue('timer_count_maxium', `${MAX_CLOUD_TIMER_COUNT}`),
        icon: 'error',
        mask: true,
      });
      return;
    }
    transformedData[0] && (transformedData[0].dps = dps);
    const { time: timeStr, id, timerId } = transformedData[0];
    // 云定时校验
    if (supportCloudTimer && !supportRctTimer) {
      const isPassed = await isPassedTimerFn(
        {
          id: id || timerId,
          time: timeStr,
          dps,
          timerId: timerId || id,
          opened: true,
          weeks: loopsStr?.split('').map((ii: string) => +ii),
        },
        'add'
      );
      if (!isPassed) {
        return;
      }
      const isConflict = schedule.add({
        time: timeStr,
        id,
        weeks: loopsStr.split('').map((ii: string) => +ii),
        opened: true,
      });
      if (isConflict) {
        return;
      }
    }
    const _params = {
      aliasName: currentActionItem.value, // 存储当前选择的action
    };
    addTimer(loopsStr, transformedData, timerDataList, _params)
      .then(async ({ scheduleDpData, scheduleList, scheduleShowData }) => {
        // 处理本地定时
        const { onRtcTimeAdd } = scheduleProps || {};
        // 本地定时校验
        if (supportRctTimer) {
          const { timerId, id } = scheduleDpData;
          const isPassed = await isPassedTimerFn(
            {
              id: id ?? timerId,
              time: timeStr,
              timerId: timerId ?? id,
              dps,
              opened: true,
              weeks: loopsStr?.split('').map((ii: string) => +ii),
            },
            'add'
          );
          if (!isPassed) {
            return;
          }
          const _isConflict = schedule.add({
            time: timeStr,
            id: timerId,
            weeks: loopsStr.split('').map((ii: string) => +ii),
            opened: true,
          });
          if (_isConflict) {
            return;
          }
          const { actionValue } = actions;
          const currentActionItem = actionList.find(a => +a.value === +actionValue);
          const rctTimerPassed = {
            id: scheduleShowData?.id || scheduleShowData?.timerId,
            time: scheduleShowData?.time,
            timerId: scheduleShowData?.timerId || scheduleShowData?.id,
            weeks: scheduleShowData?.loops?.split('').map((ii: string) => +ii),
            opened: !!scheduleShowData?.status,
            action: currentActionItem,
            dps: scheduleShowData?.dps,
          };
          onRtcTimeAdd && onRtcTimeAdd(rctTimerPassed);
          saveRctTimerList(scheduleList, () => {
            dispatch(scheduleActions.addRtcTimer(scheduleShowData));
            setShowModal(false);
            showToast({
              title: Strings.getLang('success_save'),
              icon: 'success',
            });
          });
          // 清空上一次选中的值
          setCheckedWeek([]);
          setCurrentCycle(ECurrentCycle.none);
          return;
        }
        setShowModal(false);
        fetchTimerList();
        showToast({
          title: Strings.getLang('success_save'),
          icon: 'success',
        });
      })
      .catch(err => {
        console.error(err, 'addTimer');
        showToast({
          title: Strings.getLang('success_fail'),
          icon: 'error',
          mask: true,
        });
      });
  };
  const resetModalData = () => {
    setTitle(Strings.getLang('addTiming'));
    setCheckedWeek([]);
    setCurrentTime(null);
    handleSetCurrentPickerTime();
    setCurrentCycle(ECurrentCycle.once);
    setCurrentAction(defaultAction);
  };
  const handleAdd = () => {
    resetModalData();
    setShowModal(!showModal);
  };

  const handlePickerChange = (value: { hour: number; minute: number }) => {
    setCurrentTimerPicker(value);
  };

  // switch组件不支持受控 需要强行刷新状态
  const forceUpdateDateList = _timerDataList => {
    setTimerDataList(JSON.parse(JSON.stringify(_timerDataList)));
  };

  const preTime = useRef(+new Date());
  const triggerTimerStatusToggle = (id, closeStatus, _timerDataList = refList.current, cb?) => {
    changeTimerStatus(id, closeStatus, _timerDataList)
      .then(({ scheduleList, scheduleShowData } = {}) => {
        cb && cb();
        if (+new Date() - preTime.current > timerOffset) {
          fetchTimerList();
          preTime.current = +new Date();
        }
        if (!scheduleList || !scheduleList.length) {
          return;
        }
        // 处理本地定时
        const { supportRctTimer, onRtcTimeUpdate } = scheduleProps || {};
        if (supportRctTimer) {
          const actionValue = scheduleShowData.aliasName;
          const currentActionItem = actionList.find(a => +a.value === +actionValue);
          const rctTimerPassed = {
            time: scheduleShowData?.time,
            timerId: scheduleShowData?.timerId,
            weeks: scheduleShowData?.loops?.split('').map((ii: string) => +ii),
            opened: !!scheduleShowData?.status,
            action: currentActionItem,
          };
          onRtcTimeUpdate && onRtcTimeUpdate(rctTimerPassed);
          saveRctTimerList(scheduleList, () => {
            dispatch(
              scheduleActions.updateRtcTimer({
                ...scheduleShowData,
                id: scheduleShowData.timerId,
              })
            );
            setShowModal(false);
          });
          return;
        }
        fetchTimerList();
        setShowModal(false);
      })
      .catch(err => {
        console.log(err, 'handleSwitchChange err');
        showToast({
          title: Strings.getLang('operationFail'),
          icon: 'error',
          mask: true,
        });
      });
  };
  const { add } = useTriggerChildrenFunction();
  useEffect(() => add('timerToggle', triggerTimerStatusToggle), [timerDataList]);
  const triggerCloseAllTimer = () => {
    // 关闭全部定时
    const { supportRctTimer, supportCloudTimer } = scheduleProps || {};
    if (supportRctTimer) {
      dispatch(scheduleActions.closeAllRtcTimer());
    }
    const timeOpenedList = (timerDataList || []).filter(i => i.status !== 0);
    timeOpenedList.forEach((item, idx) => {
      setTimeout(() => {
        const id = supportCloudTimer ? item.id : item.timerId;
        triggerTimerStatusToggle(id, false, timerDataList, () => {
          if (timeOpenedList.length - 1 === idx) {
            fetchTimerList();
          }
        });
      }, 100 * idx);
    });
  };

  const { add: addTimerFn } = useTriggerChildrenFunction();
  useEffect(() => addTimerFn('closeAllTimer', triggerCloseAllTimer), [timerDataList]);

  const handleSwitchChange = async (
    { value }: { type: 'change'; value: boolean; origin: any },
    item: {
      id?: string;
      timerId: string;
      status: number;
      loops: string;
      time: string;
      dps: Record<string, any>;
    }
  ) => {
    const closeStatus = value ? 1 : 0; // 0 => 关闭；1 => 开启
    const isPassed = await isPassedTimerFn(
      {
        dps: item?.dps,
        id: item?.id || item?.timerId,
        time: item?.time,
        timerId: item?.timerId || item?.id,
        opened: !!closeStatus,
        weeks: item?.loops?.split('').map((ii: string) => +ii),
      },
      'update'
    );
    if (!isPassed) {
      forceUpdateDateList(timerDataList);
      return;
    }
    const isConflict = schedule.update(
      {
        time: item?.time,
        id: item?.id || item?.timerId,
        weeks: item?.loops?.split('').map((ii: string) => +ii),
        opened: !!closeStatus,
      },
      {
        time: item?.time,
        id: item?.id || item?.timerId,
        weeks: item?.loops?.split('').map((ii: string) => +ii),
        opened: !!item?.status,
      }
    );
    if (closeStatus && isConflict) {
      forceUpdateDateList(timerDataList);
      return;
    }
    // 切换定时任务的开关状态
    triggerTimerStatusToggle(item.id || item.timerId, closeStatus, timerDataList);
  };
  const handleEditTime = (index: number, e) => {
    const { target } = e.origin;
    if (target.id === 'Switch') {
      // 阻止switch触发的事件
      return;
    }
    const currentItem = timerDataList[index];
    if (!currentItem) {
      return;
    }

    const { loops } = currentItem;
    const loopsStr = loops;

    if (loopsStr === everydayLoop) {
      setCurrentCycle(ECurrentCycle.everyday);
    } else if (loopsStr === onlyOneLoop) {
      setCurrentCycle(ECurrentCycle.once);
    } else {
      setCurrentCycle(ECurrentCycle.custom);
    }
    setTitle(Strings.getLang('editTiming'));
    setCurrentTime({
      ...currentItem,
      index,
    });
    const actionValue = +currentItem.aliasName;
    setCurrentAction(actionValue);

    setShowModal(true);
  };

  const actionListDpStr = actionList
    .map(i => {
      return JSON.stringify(i.dpList);
    })
    .join('');
  useEffect(() => {
    if (currentTime) {
      const newActionIndex = actionList.findIndex(i => {
        const dpIdListStr = i.dpList
          .map(j => {
            return j.id;
          })
          .join('');
        const currentDpIdListStr = Object.keys(currentTime.dps)
          .filter(ii => {
            // eslint-disable-next-line no-self-compare
            if (+ii === +ii) {
              return true;
            }
            return false;
          })
          .sort()
          .join('');
        return currentDpIdListStr === dpIdListStr;
      });
      if (newActionIndex === -1) {
        return;
      }
      const currentAction = actionList[newActionIndex];
      let newTimeCodeDps = {};
      let newTimeDps = {};
      currentAction?.dpList?.forEach(i => {
        newTimeCodeDps = {
          ...newTimeCodeDps,
          [i.code]: i.value,
        };
        newTimeDps = {
          ...newTimeDps,
          [i.id]: i.value,
        };
      });
      const _currentTime = {
        ...currentTime,
        codeDps: {
          ...currentTime?.codeDps,
          ...newTimeCodeDps,
        },
        dps: {
          ...currentTime?.dps,
          ...newTimeDps,
        },
      };

      setCurrentTime({
        ..._currentTime,
      });
    }
  }, [actionListDpStr]);

  const isEdit = title === Strings.getLang('editTiming');

  const getWeekTextByLoop = (_loopsStr = onlyOneLoop) => {
    let weekText = '';
    if (_loopsStr === onlyOneLoop) {
      weekText = Strings.getLang('once');
    } else if (_loopsStr === everydayLoop) {
      weekText = Strings.getLang('everyday');
    } else {
      const loopList = _loopsStr.split('').map((i, idx) => {
        if (+i === 1) {
          return weekList[idx].label;
        }
        return '';
      });
      weekText = loopList.filter(i => i).join(' ');
    }
    return weekText;
  };

  type TWeek = { label: string };
  const getWeekTextByWeeks = (weeks: TWeek[]) => {
    return weeks.reduce((pre, cur) => {
      return `${pre} ${cur.label}`;
    }, '');
  };

  const getWeekText = (v: TWeek[] | string) => {
    if (Array.isArray(v)) {
      return getWeekTextByWeeks(v);
    }
    return getWeekTextByLoop(v);
  };

  const theme = useConfig();

  const getThemeStyle = (darkStyle, lightStyle, importantStyle?) => {
    const isDark = theme?.theme === 'dark';
    if (importantStyle) {
      return importantStyle;
    }
    return isDark ? darkStyle : lightStyle;
  };

  const getViewElement = () => {
    const renderTop = (titleRes = '') => {
      const { textPrimary } = theme?.fontColor;
      const textColor = getThemeStyle('', '', textPrimary);
      return (
        <View className="timing-view-handler">
          <Text
            className="timing-view-cancel"
            style={{
              fontSize: '32rpx',
              color: textColor,
            }}
            onClick={handleCancel}
          >
            {Strings.getLang('cancel')}
          </Text>
          <Text
            style={{
              fontWeight: 600,
              fontSize: '34rpx',
              color: textColor,
            }}
          >
            {titleRes || title}
          </Text>
          <Text
            className="timing-view-save"
            style={{
              color: brandColor,
            }}
            onClick={handleSave}
          >
            {Strings.getLang('save')}
          </Text>
        </View>
      );
    };
    const currentActionItem = actionList.find(i => +i.value === currentAction);
    const actionText =
      (currentActionItem?.renderCustomActionText && currentActionItem?.renderCustomActionText()) ||
      currentActionItem?.label ||
      '';
    // 执行周期文本
    const currentCycleItem = defaultCycleList.find(i => i.value === currentCycle);
    let cycleText = currentCycleItem?.label || '';
    if (currentCycleItem?.label === Strings.getLang('customTitle')) {
      cycleText = getWeekText(checkedWeeks) || Strings.getLang('once');
    }
    const renderActionSheet = () => {
      if (!actionVisible) {
        return null;
      }
      return (
        <ConfigProvider
          config={{
            actionsheet: actionSheetConfig,
          }}
        >
          <ActionSheet
            overlayStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
            show={actionVisible}
            header={Strings.getLang('handler_action')}
            okText={null}
            cancelText={Strings.getLang('cancel')}
            onCancel={handleActionHide}
          >
            {renderActionList(actionList)}
          </ActionSheet>
        </ConfigProvider>
      );
    };
    const renderCycleSheet = () => {
      return (
        <ConfigProvider
          config={{
            actionsheet: actionSheetConfig,
          }}
        >
          <ActionSheet
            overlayStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
            show={cycleVisible}
            header={Strings.getLang('handler_cycle')}
            okText={null}
            cancelText={Strings.getLang('cancel')}
            onCancel={handleCycleHide}
          >
            {renderCycleList(defaultCycleList)}
          </ActionSheet>
        </ConfigProvider>
      );
    };
    const { background } = theme?.timer || {};
    const styles = getThemeStyle(
      {
        background: `${background} !important`,
        boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.3) !important',
      },
      {
        background: `${background || '#288ddf'} !important`,
        boxShadow: '0px 2px 7px transparent !important',
      }
    );
    const renderTimerPicker = () => {
      const height = 61;
      const { titlePrimary } = theme?.fontColor;
      const titleFontColor = getThemeStyle('#000', '#fff', titlePrimary);
      const { timerPickerBorderColor } = theme?.timer || {};
      const pickerBorderBg = getThemeStyle('#1f3040', 'rgba(0, 0, 0, 0.1)', timerPickerBorderColor);
      // 中英文
      let isEn = true;
      const { language = 'zh' } = systemInfo;
      const isZhRegex = /^zh$|^zh-hans$|^zh_hans$|^zh_cn$|^zh-cn$|^zh_hans_\w+|^zh-hans-\w+/;
      if (typeof language === 'string' && isZhRegex.test(language.toLowerCase())) {
        isEn = false;
      }
      return (
        <View
          className="c-content-center"
          style={{
            marginTop: '20rpx',
          }}
        >
          {showContainer ? (
            <TyTimePicker
              className="c-ty-time-picker"
              style={{
                opacity: showTimer ? 1 : 0,
              }}
              fontColor={titleFontColor}
              overlayStyle={{
                opacity: 0,
              }}
              unitAlign={`${isEn ? 'right' : 'left'}`}
              wrapStyle={{
                height: '600rpx',
              }}
              indicatorStyle={{
                height: `${height}px`,
                borderTop: `2rpx solid ${pickerBorderBg}`,
                borderBottom: `2rpx solid ${pickerBorderBg}`,
              }}
              columnWrapStyle={{
                height: `${height}px`,
                lineHeight: `${height}px`,
              }}
              fontSize={60}
              fontStyle={{
                fontWeight: 700,
              }}
              is24Hour={!!is24Hour}
              value={currentTimePicker}
              onChange={handlePickerChange}
              amText={Strings.getLang('AM')}
              pmText={Strings.getLang('PM')}
              renderOverlay={() => {
                const { background } = theme?.timer || {};
                const isRgba = background.indexOf('rgba') > -1;
                const graBg = background;
                let bg = `linear-gradient(to bottom, ${graBg}, transparent, ${graBg})`;
                if (isRgba) {
                  const backgroundHalf = background.replace(
                    /(\d+(\.\d+)?)(?=\))/,
                    match => parseFloat(match) / 2
                  );
                  const backgroundMiddle = background.replace(/(\d+(\.\d+)?)(?=\))/, () => 0);
                  bg = `linear-gradient(to bottom, ${graBg}, ${backgroundHalf}, ${backgroundMiddle}, ${backgroundMiddle}, ${backgroundMiddle}, ${backgroundHalf}, ${graBg})`;
                } else {
                  throw new Error(
                    'timer的背景色请使用rgba格式的颜色值, eg: { timer: {background: "rgba(255, 255, 255, 1)"} }'
                  );
                }
                const style = {
                  pointerEvents: 'none',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundImage: bg,
                  backgroundPosition: 'top, bottom',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 100,
                };
                return <View style={style} />;
              }}
            />
          ) : null}
        </View>
      );
    };
    const renderTimerActions = () => {
      const { background, borderColor, iconColor, ...restStyle } = theme?.card;
      const { textPrimary, textRegular } = theme?.fontColor;
      const bg = getThemeStyle('rgba(35, 58, 82, 0.78)', '#FFFFFF', background);
      const bdc = getThemeStyle('rgba(25, 97, 206, 0.15)', '(255, 255, 255, 0.1)', borderColor);
      const boxShadow = getThemeStyle('', '0px 4px 16px rgba(0, 33, 13, 0.04)');
      const _iconColor = getThemeStyle('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)', iconColor);
      const titleColor = getThemeStyle('#FFFFFF', 'rgba(0, 0, 0, 0.9)', textPrimary);
      const textColor = getThemeStyle(
        'rgba(255, 255, 255, 0.5)',
        'rgba(0, 0, 0, 0.5)',
        textRegular
      );
      return (
        <View className="handler-actions">
          <Card
            style={{
              ...(restStyle || {}),
            }}
            backgroundColor={bg}
            borderColor={bdc}
            boxShadow={boxShadow}
            fontStyle={{
              titleColor,
              textColor,
              iconColor: _iconColor,
            }}
            label={Strings.getLang('handler_action')}
            text={actionText}
            onClick={handleActionShow}
          />
          <Card
            style={{
              ...(restStyle || {}),
            }}
            backgroundColor={bg}
            borderColor={bdc}
            boxShadow={boxShadow}
            fontStyle={{
              titleColor,
              textColor,
              iconColor: _iconColor,
            }}
            label={Strings.getLang('handler_cycle')}
            text={cycleText}
            onClick={handleCycleShow}
          />
          {isEdit && (
            <Card
              style={{
                ...(restStyle || {}),
              }}
              backgroundColor={bg}
              borderColor={bdc}
              boxShadow={boxShadow}
              fontStyle={{
                titleColor,
                textColor,
                iconColor: _iconColor,
              }}
              title={Strings.getLang('delete')}
              titleStyle={{
                color: '#F03E3E',
              }}
              onClick={() => handleDelete(currentTime)}
            />
          )}
        </View>
      );
    };
    return (
      <View className="timing-view-container" style={styles}>
        <View
          style={{
            height: `${safeArea}px`,
          }}
        />
        {/* 顶部操作区 */}
        {renderTop()}
        <ScrollView
          className="timing-view-content"
          scrollY
          style={{ width: '100vw', height: 'auto', paddingBottom: '104rpx' }}
        >
          {/* 内容区 */}
          <>
            {renderTimerPicker()}
            {renderTimerActions()}
          </>
        </ScrollView>
        {renderActionSheet()}
        {renderCycleSheet()}
      </View>
    );
  };

  const [showContainer, setShowContainer] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const delayTime = 100;
    let timer = setTimeout(() => {
      setShowContainer(showModal || customCycleModal);
    }, delayTime);

    let timer1 = setTimeout(() => {
      setShowTimer(showModal || customCycleModal);
    }, delayTime + 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer1);
      timer = null;
      timer1 = null;
    };
  }, [showModal, customCycleModal]);
  useEffect(() => {
    const { showMenuButton: customShowMenuButton = true } = scheduleProps || {};
    if (!customShowMenuButton) {
      hideMenuButton();
      return;
    }
    // 当打开新增、编辑或自定义周期时定时页面时,不显示菜单
    if (showModal || customCycleModal) {
      hideMenuButton();
    } else {
      showMenuButton();
    }
  }, [showModal || customCycleModal]);

  const renderContainer = () => {
    if (!showModal && !customCycleModal) {
      return null;
    }
    let children = null;
    if (showModal) {
      children = getViewElement();
    } else if (customCycleModal) {
      children = getCustomElement();
    }
    const handleModalClickOverlay = () => {
      actionVisible && setActionVisible(false);
      cycleVisible && setCycleVisible(false);
      showModal && setShowModal(false);
    };
    const handleCycleClickOverlay = () => {
      actionVisible && setActionVisible(false);
      cycleVisible && setCycleVisible(false);
      handleCustomCancel();
    };
    const onClickOverlay = showModal ? handleModalClickOverlay : handleCycleClickOverlay;
    return (
      <PageContainer
        className="page-container-view timing-view"
        round
        show={showContainer}
        position="bottom"
        onClickOverlay={onClickOverlay}
      >
        {children}
      </PageContainer>
    );
  };

  const handleCustomCancel = () => {
    setCustomCycleModal(false);
    setShowModal(true);
    setCheckedWeek([]);
    setCurrentCycle(ECurrentCycle.none);
  };
  const handleCustomSave = () => {
    setCustomCycleModal(false);
    setShowModal(true);
  };
  const getCustomElement = () => {
    const renderTop = (titleRes = '') => {
      const { titlePrimary } = theme?.fontColor;
      const titleColor = getThemeStyle(
        'rgba(255, 255, 255, 1)',
        'rgba(0, 0, 0, 0.9)',
        titlePrimary
      );
      const isDark = theme?.theme === 'dark';
      return (
        <View className="timing-view-handler">
          <View className="timing-view-cancel" onClick={handleCustomCancel}>
            <Image
              src={isDark ? Res.iconArrowLeft : Res.iconArrowLeftWhite}
              style={{
                width: '24px',
                height: '24px',
                position: 'relative',
                top: '-5px',
                left: '2px',
              }}
            />
          </View>

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: '34rpx',
              color: titleColor,
            }}
          >
            {titleRes || title}
          </Text>
          <Text
            className="timing-view-save"
            style={{
              color: brandColor,
            }}
            onClick={handleCustomSave}
          >
            {Strings.getLang('save')}
          </Text>
        </View>
      );
    };
    const renderWeekList = () => {
      const { color, borderColor, boxShadowColor, background } = theme?.timer?.customStyle || {};
      const bg = getThemeStyle('rgba(35, 58, 82, 0.78)', '#fff', background);
      const textColor = getThemeStyle('#FFFFFF', 'rgba(0, 0, 0, 0.9)', color);
      const _borderColor = getThemeStyle(
        '1px solid #FFFFFF',
        '1px solid rgba(25, 97, 206, 0.15)',
        `1px solid ${borderColor}`
      );
      const _boxShadowColor = getThemeStyle(
        '0px 4px 16px #FFFFFF',
        '0px 4px 16px rgba(0, 33, 13, 0.04)',
        `0px 4px 16px ${boxShadowColor}`
      );
      const dashStyle = getThemeStyle('rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.05)');
      return (
        <View
          className="weeks-view"
          style={{
            background: bg,
            border: _borderColor,
            boxShadow: _boxShadowColor,
          }}
        >
          {weekList.map((week, index) => {
            const isActive = (checkedWeeks || []).find(i => i.value === week.value);
            return (
              <View
                key={week.value}
                className="week-item"
                onClick={() => {
                  handleCheckWeek(week.value);
                }}
              >
                <Text
                  style={{
                    color: textColor,
                  }}
                >
                  {week.label}
                </Text>
                <Radio theme={theme} size={18} value={!!isActive} />
                {index !== weekList.length - 1 && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '600px',
                      height: '1px',
                      background: dashStyle,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      );
    };
    const isDark = theme.theme === 'dark';
    const bg = isDark ? '#0d2236' : '#fff';
    const { background } = theme?.timer || {};

    const customStyle = {
      background: ` ${background || bg} !important`,
    };
    const { textRegular } = theme?.fontColor;
    const tipStyle = getThemeStyle('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 0.5)', textRegular);
    return (
      <View className="timing-custom-container" style={customStyle}>
        <View
          style={{
            height: `${safeArea}px`,
          }}
        />
        {/* 顶部操作区 */}
        {renderTop(Strings.getLang('customTitle'))}
        <ScrollView scrollY>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              className="custom-tip"
              style={{
                color: tipStyle,
              }}
            >
              {Strings.getLang('customTip')}
            </Text>
          </View>
          {renderWeekList()}
        </ScrollView>
      </View>
    );
  };

  const [timeStatusList, setTimerStatusList] = useState([]);
  useEffect(() => {
    const _timeStatusList = timerDataList.map(i => {
      return !!i.status;
    });
    setTimerStatusList(_timeStatusList);
  }, [timerDataList]);

  // 渲染定时列表
  const renderTimerList = (list: any[]) => {
    if (!list || !list.length) {
      const isDark = theme?.theme === 'dark';
      const { textRegular } = theme?.fontColor || {};
      // 空数据
      return (
        <View className="no-data-wrapper">
          <Image src={isDark ? Res.noData : Res.noDataWhite} className="no-data-image" />
          <Text
            style={{
              color: textRegular || (isDark ? '#fff' : 'rgba(0, 0, 0, 0.5)'),
            }}
          >
            {Strings.getLang('noData')}
          </Text>
          <Button
            onClick={handleAdd}
            className="add-text-button"
            style={{
              bottom: isIphoneX ? '36px' : '24px',
              backgroundColor: `${brandColor || '#1082FE'}`,
            }}
          >
            <Image
              src={Res.iconAdd}
              style={{ width: '44rpx', height: '44rpx', position: 'absolute' }}
            />
          </Button>
        </View>
      );
    }
    const { background, borderColor, ...restCardStyle } = theme?.card;
    const { textPrimary, textRegular } = theme?.fontColor;
    const bg = getThemeStyle('rgba(35, 58, 82, 0.78)', '#FFFFFF', background);
    const bdc = getThemeStyle('rgba(25, 97, 206, 0.15)', '(255, 255, 255, 0.1)', borderColor);
    const boxShadow = getThemeStyle('', '0px 4px 16px rgba(0, 33, 13, 0.04)');
    const titleColor = getThemeStyle('#FFFFFF', 'rgba(0, 0, 0, 0.9)', textPrimary);
    const textColor = getThemeStyle('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.5)', textRegular);
    return list.map(
      (
        item: {
          time?: any;
          loops?: any;
          status?: any;
          dps?: any;
          timerId?: string;
          id?: string;
          aliasName?: string;
        },
        index: React.Key
      ) => {
        const { time = '', loops = onlyOneLoop, status, aliasName } = item;
        const loopsStr = loops;
        const [hour, minute] = time.split(':');
        const i18n_ampmTxt = is12Hour
          ? hour >= 12
            ? Strings.getLang('PM')
            : Strings.getLang('AM')
          : '';
        const timeText = is12Hour
          ? `${hour > 12 ? hour - 12 : hourTrans(hour)}:${minute}`
          : `${hour}:${minute}`;
        const weekText = getWeekText(loopsStr);
        const actionValue = aliasName;
        const currentAction =
          actionValue !== undefined && actionValue !== ''
            ? actionList.find(action => +action.value === +actionValue)
            : actionList[0];
        const i18n_lightStatus =
          (currentAction.renderCustomActionText && currentAction.renderCustomActionText()) ||
          currentAction?.label;
        const i18n_actionText = Strings.getLang('handler_action');
        const switchChecked = timeStatusList[index];
        const brandColor = theme?.brandColor;
        return (
          <Swipeout
            key={`${index}_${status}`}
            autoClose
            rightButtonGroupWidth={80}
            right={[
              {
                text: (
                  <Image
                    src={Res.iconDelete}
                    style={{
                      width: '32rpx',
                      height: '36rpx',
                    }}
                  />
                ),
                onPress: () => {
                  handleDelete(item);
                },
                style: { backgroundColor: 'red', color: 'white', height: '101px' },
              },
            ]}
          >
            <View
              className="time-item-wrapper"
              style={{ ...restCardStyle, background: bg, borderColor: bdc, boxShadow }}
              onClick={e => handleEditTime(index, e)}
            >
              <View className="time-item-left">
                <View className="flex">
                  <Text
                    className="time-item-text gray"
                    style={{
                      position: 'relative',
                      bottom: '-10rpx',
                      marginRight: '8rpx',
                      color: textColor,
                    }}
                  >
                    {i18n_ampmTxt}
                  </Text>
                  <Text
                    className="time-item-text white"
                    style={{
                      position: 'relative',
                      bottom: '-18rpx',
                      color: titleColor,
                      fontWeight: 700,
                    }}
                  >
                    {timeText}
                  </Text>
                </View>
                <View>
                  <Text
                    className="time-item-text gray"
                    style={{
                      color: textColor,
                    }}
                  >
                    {weekText}
                  </Text>
                </View>
                <View>
                  <Text
                    className="time-item-text gray"
                    style={{
                      color: textColor,
                    }}
                  >{`${i18n_actionText}: ${i18n_lightStatus}`}</Text>
                </View>
              </View>

              <View
                className="time-item-right"
                style={{
                  height: '62rpx',
                }}
              >
                <Switch
                  color={`${brandColor || '#1082FE'}`}
                  id="Switch"
                  checked={switchChecked}
                  onChange={e => {
                    timeStatusList[index] = e.value;
                    setTimerStatusList([...timeStatusList]);
                    handleSwitchChange(e, item);
                  }}
                />
              </View>
            </View>
          </Swipeout>
        );
      }
    );
  };

  const handleSetCurrentPickerTime = (date?: { hour: number; minute: number }) => {
    let hour = 0;
    let minute = 0;
    if (date) {
      // eslint-disable-next-line prefer-destructuring
      hour = date.hour;
      // eslint-disable-next-line prefer-destructuring
      minute = date.minute;
    } else {
      const nowTime = dayjs();
      hour = nowTime.hour();
      minute = nowTime.minute();
    }
    setCurrentTimerPicker({ hour, minute });
  };

  useEffect(() => {
    handleSetCurrentPickerTime();
  }, [is24Hour]);

  useEffect(() => {
    fetchTimerList();
  }, []);

  useEffect(() => {
    // 定时编辑数据恢复
    if (!currentTime) {
      return;
    }
    const { time = '00:00', loops = onlyOneLoop } = currentTime;
    const loopsStr = loops;
    const date = {
      hour: +time.split(':')[0],
      minute: +time.split(':')[1],
    };

    handleSetCurrentPickerTime(date);

    if (loopsStr === onlyOneLoop) {
      setCheckedWeek([]);
    } else if (loopsStr) {
      const _weekCheckedList = [];
      loopsStr.split('').forEach((i, idx) => {
        if (i === '1') {
          _weekCheckedList.push(weekList[idx]);
        }
      });
      setCheckedWeek(_weekCheckedList);
    }
  }, [currentTime]);

  const handleCheckWeek = (i: number) => {
    const currentWeek = weekList.find(w => w.value === i);
    const checkedWeeksRes = checkedWeeks;
    const idx = _findIndex(checkedWeeksRes, c => c.value === i);
    idx > -1 ? checkedWeeksRes.splice(idx, 1) : checkedWeeksRes.push(currentWeek);
    setCheckedWeek([...checkedWeeksRes]);
  };

  const handleDelete = (item?: { timerId?: string; id?: string; dps: { [key: string]: any } }) => {
    const timeHandler = async (cid?: string) => {
      // 处理本地定时
      const { supportRctTimer, supportCloudTimer, onRtcTimeRemove } = scheduleProps || {};
      const idRes = cid || currentTime.id || currentTime.timerId;
      if (supportCloudTimer) {
        const currentCloudTimer = timerDataList.find(c => c.timerId === idRes || c.id === idRes);
        const res = {
          dps: item?.dps,
          time: currentCloudTimer?.time,
          id: item?.id || item?.timerId,
          timerId: item?.timerId || item?.id,
          weeks: currentCloudTimer?.loops?.split('').map((ii: string) => +ii),
          opened: !!currentCloudTimer?.status,
        };
        const isPassed = await isPassedTimerFn(res, 'remove');
        if (!isPassed) {
          return;
        }
      }
      removeTimer(idRes, timerDataList)
        .then(async ({ scheduleList, scheduleShowData }) => {
          setShowModal(false);

          if (supportRctTimer) {
            const actionValue = item?.aliasName;
            const currentActionItem =
              actionList.find(a => +a.value === +actionValue) || actionList[0];
            const rctTimerPassed = {
              dps: item.dps,
              id: item?.id || item?.timerId,
              time: scheduleShowData?.time,
              timerId: scheduleShowData?.timerId,
              weeks: scheduleShowData?.loops.split('').map((ii: string) => +ii),
              opened: !!scheduleShowData?.status,
              action: currentActionItem,
            };
            const isPassed = await isPassedTimerFn(rctTimerPassed, 'remove');
            if (!isPassed) {
              return;
            }
            onRtcTimeRemove && onRtcTimeRemove(rctTimerPassed);
            saveRctTimerList(scheduleList, () => {
              dispatch(
                scheduleActions.removeRtcTimer({
                  ...scheduleShowData,
                  id: scheduleShowData.timerId,
                })
              );
              schedule.remove({
                ...scheduleShowData,
                id: scheduleShowData.timerId,
              });
            });
            return;
          }
          if (supportCloudTimer) {
            fetchTimerList();
          }
          // @ts-ignore
          showToast({
            title: Strings.getLang('delete_success'),
            icon: 'success',
            mask: true,
          });
        })
        .catch(() => {
          showToast({
            title: Strings.getLang('delete_failed'),
            icon: 'error',
            mask: true,
          });
        });
    };

    showModalApi({
      title: Strings.getLang('delete'),
      content: Strings.getLang('deleteTip'),
      showCancel: true,
      cancelText: Strings.getLang('cancel'),
      cancelColor: 'rgba(0, 0, 0 .5)',
      confirmText: Strings.getLang('confirm'),
      confirmColor: '#FF9E50',
      success: ({ confirm }) => {
        if (confirm) {
          timeHandler(item.id || item.timerId);
        }
      },
    });
  };

  const [actionVisible, setActionVisible] = useState(false);
  const handleAction = (visible: boolean) => {
    setActionVisible(visible);
  };
  const handleActionShow = () => {
    handleAction(true);
  };
  const handleActionHide = () => {
    handleAction(false);
  };
  const handleCycle = (visible: boolean) => {
    setCycleVisible(visible);
  };
  const handleCycleShow = () => {
    handleCycle(true);
  };
  const handleCycleHide = () => {
    handleCycle(false);
  };
  const defaultAction = actionList[0].value;
  // 执行动作
  const [currentAction, setCurrentAction] = useState(defaultAction);
  const renderActionList = (
    list: { label: string; value: number; callback?: (param: TTimer) => void; type?: 'custom' }[]
  ) => {
    const itemContent = (value: number) => {
      const isDark = theme?.theme === 'dark';
      return currentAction === +value ? (
        <Image
          className="schedule-icon"
          style={{
            width: `${24 * 2}rpx`,
            height: `${24 * 2}rpx`,
          }}
          src={isDark ? Res.iconCheckmarkDark : Res.iconCheckmarkLight}
        />
      ) : null;
    };
    return (
      <ConfigProvider
        config={{
          cell: cellConfig,
        }}
      >
        <ScrollView
          scrollY
          style={{
            height: list.length > 8 ? `${8 * 96}rpx` : `${list.length * 96}rpx`,
          }}
        >
          <TyCell.Row
            className="cell-list"
            dataSource={list}
            rowKey="label"
            renderItem={item => (
              <TyCell.Item
                gap="0"
                className="list-item"
                title={item.label}
                onClick={() => {
                  if (item.type === 'custom') {
                    let _res = currentTime;
                    if (!currentTime) {
                      const currentAction = actionList.find(
                        a => a?.type === 'custom' && item.label === a?.label
                      );
                      if (!currentAction) {
                        console.warn(
                          '未匹配到自定义跳转数据，请检查入参：actionList',
                          actionList,
                          item
                        );
                        return;
                      }
                      let codeDps = {};
                      currentAction?.dpList.forEach((i: any) => {
                        codeDps = { ...codeDps, [i.code]: i.value };
                      });
                      _res = {
                        codeDps,
                      };
                    }
                    item.callback && item.callback(_res);
                  }
                  setCurrentAction(item.value);
                  handleActionHide();
                }}
                content={itemContent(item.value)}
              />
            )}
            splitStyle={{ width: '100%', left: 0 }}
          />
        </ScrollView>
      </ConfigProvider>
    );
  };

  const renderCycleList = (cycleListRes: { label: string; value: number }[]) => {
    const itemContent = (value: number) => {
      const isDark = theme?.theme === 'dark';
      return currentCycle === value ? (
        <Image
          className="schedule-icon"
          style={{
            width: `${24 * 2}rpx`,
            height: `${24 * 2}rpx`,
          }}
          src={isDark ? Res.iconCheckmarkDark : Res.iconCheckmarkLight}
        />
      ) : null;
    };
    return (
      <ConfigProvider
        config={{
          cell: cellConfig,
        }}
      >
        <TyCell.Row
          className="cell-list"
          dataSource={cycleListRes}
          rowKey="label"
          renderItem={item => (
            <TyCell.Item
              gap="0"
              className="list-item"
              title={item.label}
              onClick={() => {
                setCurrentCycle(item.value);
                handleCycleHide();
                if (item.value === 2) {
                  // 自定义模式
                  setCustomCycleModal(true);
                  setShowModal(false);
                }
              }}
              content={itemContent(item.value)}
            />
          )}
          splitStyle={{ width: '100%', left: 0 }}
        />
      </ConfigProvider>
    );
  };
  let timingViewTipsTitleStyle = {};
  if (isOnlyOneTimer) {
    timingViewTipsTitleStyle = {
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '41px',
    };
  }
  const handleSwipeShow = () => {
    onToggleSwipe && onToggleSwipe(true);
  };
  const handleSwipeHide = () => {
    onToggleSwipe && onToggleSwipe(false);
  };
  const brandColor = theme?.brandColor;
  const { textRegular } = theme?.fontColor;
  return (
    <View className="timing-view-wrapper">
      <View className="timing-view-tips">
        {!isOnlyOneTimer && (
          <Text className="timing-view-tips-title" style={timingViewTipsTitleStyle}>
            {Strings.getLang('timing')}
          </Text>
        )}
        <Text
          className="timing-view-tips-text"
          style={
            isOnlyOneTimer
              ? {
                  textAlign: 'center',
                  color: textRegular,
                }
              : {
                  color: textRegular,
                }
          }
        >
          {Strings.getLang('timingTip')}
        </Text>
      </View>
      <View className="timing-view-scroll">
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '16px',
          }}
        >
          <Swipeout.Group
            onTouchStart={handleSwipeShow}
            onTouchEnd={handleSwipeHide}
            onOpen={handleSwipeShow}
            onClose={handleSwipeHide}
          >
            {renderTimerList(timerDataList)}
          </Swipeout.Group>
        </View>
        {timerDataList && timerDataList.length > 0 && (
          <Button
            onClick={handleAdd}
            className="add-text-button"
            style={{
              bottom: isIphoneX ? '36px' : '24px',
              backgroundColor: `${brandColor || '#1082FE'}`,
            }}
          >
            <Image
              src={Res.iconAdd}
              style={{ width: '44rpx', height: '44rpx', position: 'absolute' }}
            />
          </Button>
        )}
      </View>
      {renderContainer()}
    </View>
  );
};

export default React.memo(TimingView);
