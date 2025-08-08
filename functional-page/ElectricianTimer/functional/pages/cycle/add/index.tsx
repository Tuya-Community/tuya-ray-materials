import Container from '@/components/container';
import TimerPicker from '@/components/timer-picker';
import TopBar from '@/components/topBar';
import Week from '@/components/week';
import Strings from '@/i18n';
import { ScrollView, View, router, showToast, useQuery } from '@ray-js/ray';
import React, { FC, useCallback, useEffect, useState } from 'react';
import Loading from '@/components/loading';
import { config } from '@/config';
import Cell from '@/components/cell';
import { get24Time, removeTimer } from '@/utils';
import dayjs from 'dayjs';
import ConflictModal from '@/components/conflict';
import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import GlobalActionSheet, { ActionSheetInstance } from '@/components/action-sheet';
import GlobalActionSheetTimePicker, { ActionSheetTimePickerInstance } from '@/components/action-sheet-time-picker';
import { useConfig } from '@/hooks/useConfig';
import { useEleCycle } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { electri } from '@ray-js/electrician-timing-sdk';
import { useCommon } from '@/redux/modules/commonSlice';
import { EleCycleTimer } from '@ray-js/electrician-timing-sdk/lib/interface';
import styles from './index.module.less';

const AddCycle: FC = () => {
  useConfig();
  const [saving, setSaving] = useState(false);
  const { dpNames } = useCommon();
  const timers = useEleCycle();
  const { id } = useQuery();
  const [weeks, setWeeks] = useState<Array<1 | 0>>([0, 0, 0, 0, 0, 0, 0]);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const [endTime, setEndTime] = useState(() => {
    const now = dayjs().add(1, 'hour');
    return now.hour() * 60 + now.minute();
  });
  const [onHoldTime, setOnHoldTime] = useState(1);
  const [offHoldTime, setOffHoldTime] = useState(1);
  const [switches, setSwitches] = useState([]);

  const handleSave = useCallback(async () => {
    if (saving) {
      return;
    }
    // 是否选择了开关
    if (switches.length === 0) {
      DialogInstance.alert({
        title: Strings.getLang('ret_tips'),
        message: Strings.getLang('ret_please_select_switch'),
        confirmButtonText: Strings.getLang('confirm'),
      });
      return;
    }

    const data: EleCycleTimer = {
      id: +id >= 0 ? +id : timers.length,
      startTime,
      endTime,
      week: weeks,
      actions: switches.map((item) => ({ code: item })),
      status: true,
      type: 'sdk_cycle',
      onHoldTime,
      offHoldTime,
    };
    try {
      setSaving(true);
      let res;
      if (+id >= 0) {
        res = await electri.cycle.update(data, { useDefaultModal: true });
      } else {
        res = await electri.cycle.add(data, { useDefaultModal: true });
      }
      if (res === 'success') {
        router.back();
      }
    } catch (e) {
      switch (e.errCode) {
        case 1001: {
          const dpConfig = electri.cycle.getConfig();
          // 超限
          DialogInstance.alert({
            title: Strings.getLang('ret_tips'),
            message: Strings.formatValue('ret_cycle_max_tips', dpConfig.max),
            confirmButtonText: Strings.getLang('confirm'),
          });
          return;
        }
        case 1009:
          DialogInstance.alert({
            title: Strings.getLang('ret_tips'),
            message: Strings.getLang('ret_start_equal_end'),
            confirmButtonText: Strings.getLang('confirm'),
          });
          return;
        case 1010:
          DialogInstance.alert({
            title: Strings.getLang('ret_tips'),
            message: Strings.getLang('ret_holdTime_error'),
            confirmButtonText: Strings.getLang('confirm'),
          });
          return;
        default:
          // 不识别的错，提示失败
          DialogInstance.alert({
            title: Strings.getLang('ret_tips'),
            message: Strings.getLang('ret_save_failure'),
            confirmButtonText: Strings.getLang('confirm'),
          });
          return;
      }
    } finally {
      setSaving(false);
    }
  }, [weeks, startTime, switches, endTime, onHoldTime, offHoldTime, timers, saving]);
  const handleBack = useCallback(() => {
    DialogInstance.confirm({
      title: Strings.getLang('ret_tips'),
      message: Strings.getLang('ret_close_schedule_tip'),
      confirmButtonText: Strings.getLang('confirm'),
      cancelButtonText: Strings.getLang('cancel'),
      beforeClose: async (action) => {
        if (action === 'confirm') {
          router.back();
        }
        return true;
      },
    });
  }, []);

  const handleShowSwitches = useCallback(() => {
    ActionSheetInstance.show({
      title: Strings.getLang('ret_switch_selection'),
      actions: config.switchDps.map((item) => ({
        name: dpNames[item.code] || Strings.getDpLang(item.code),
        value: item.code,
        checked: switches.includes(item.code),
      })),
      onConfirm: ({ detail }) => {
        setSwitches((list) => {
          const selection = detail.map((item) => item.value);
          // 只保留当关选中的，和不在当前开关选择范围内的开关
          return list.filter((x) => !config.switchCodes.includes(x)).concat(selection);
        });
      },
    });
  }, [switches, dpNames]);

  const handleDelete = useCallback(async () => {
    if (saving) return;
    DialogInstance.confirm({
      title: Strings.getLang('ret_tips'),
      message: Strings.getLang('ret_delete_timer_tips'),
      confirmButtonText: Strings.getLang('confirm'),
      cancelButtonText: Strings.getLang('cancel'),
      beforeClose: async (action) => {
        if (action === 'confirm') {
          try {
            await removeTimer(+id, timers, electri.cycle.update, electri.cycle.remove);
            router.back();
          } catch {
            showToast({
              icon: 'error',
              title: Strings.getLang('ret_delete_failure'),
            });
          }
        }
        return Promise.resolve(true);
      },
    });
  }, [saving]);
  const handleChangeTime = useCallback((start: number, end: number) => {
    setStartTime(start);
    setEndTime(end);
  }, []);
  const handleChangeWeeks = useCallback((values) => {
    setWeeks(values);
  }, []);

  const handleSelectOnholdTime = useCallback(() => {
    const maxTime = Math.min(720, endTime < startTime ? 1440 + endTime - startTime : endTime - startTime);
    ActionSheetTimePickerInstance.show({
      title: Strings.getLang('ret_starttime_label'),
      value: onHoldTime * 60,
      type: 'minute',
      min: 60,
      max: maxTime * 60,
      onConfirm: (data) => {
        setOnHoldTime(Math.floor(data / 60));
      },
    });
  }, [onHoldTime, startTime, endTime]);

  const handleSelectOffholdTime = useCallback(() => {
    const maxTime = Math.min(720, endTime < startTime ? 1440 + endTime - startTime : endTime - startTime);
    ActionSheetTimePickerInstance.show({
      title: Strings.getLang('ret_endtime_label'),
      value: offHoldTime * 60,
      type: 'minute',
      min: 60,
      max: maxTime * 60,
      onConfirm: (data) => {
        setOffHoldTime(Math.floor(data / 60));
      },
    });
  }, [offHoldTime, startTime, endTime]);

  useEffect(() => {
    if (+id >= 0) {
      if (timers.length > 0) {
        const timer = timers.find((item) => item.id === +id);
        if (timer) {
          setWeeks([...timer.week]);
          setStartTime(timer.startTime);
          setEndTime(timer.endTime);
          setOnHoldTime(timer.onHoldTime);
          setOffHoldTime(timer.offHoldTime);
          // 处理开关
          setSwitches(timer.actions.map((item) => item.code));
          return;
        }
      }
    }
    if (config.switchDps.length === 1) {
      setSwitches([config.switchDps[0].code]);
    }
  }, []);

  return (
    <Container>
      <TopBar
        title={Strings.getLang(id ? 'ret_edit_timer' : 'ret_add_timer')}
        backText={Strings.getLang('cancel')}
        menuText={saving ? <Loading loading /> : Strings.getLang('save')}
        menuClassName={saving ? styles.menuCenter : ''}
        onMenuClick={handleSave}
        onBack={handleBack}
      />
      {/* 时间选择 */}
      <TimerPicker
        className={styles.timePicker}
        pmText={Strings.getLang('ret_pm')}
        amText={Strings.getLang('ret_am')}
        is12Hours={!config.is24Hour}
        pickerFontSize={48}
        pickerFontLineHeight={48}
        onTimerChange={handleChangeTime}
        startTime={startTime}
        endTime={endTime}
        startTimeLabel={Strings.getLang('ret_starttime_label')}
        endTimeLabel={Strings.getLang('ret_endtime_label')}
        disabled={saving}
      />
      <ScrollView scrollY className={styles.scroll} refresherTriggered={false}>
        <Week weeks={weeks} disabled={saving} onChange={handleChangeWeeks} />
        {/* 是否只有一个开关 */}
        {config.switchDps.length > 1 && (
          <Cell
            disabled={saving}
            title={Strings.getLang('ret_switch_selection')}
            value={
              switches.length
                ? switches.map((item) => dpNames[item] || Strings.getDpLang(item)).join('、')
                : Strings.getLang('ret_please_select')
            }
            onClick={handleShowSwitches}
          />
        )}
        {/* 循环单元 */}
        <Cell
          type="desc"
          title={Strings.getLang('ret_cycle_holdtime')}
          subTitle={Strings.getLang('ret_cycle_holdtime_desc')}
        />
        {/* 开启时长 */}
        <Cell
          disabled={saving}
          title={Strings.getLang('ret_cycle_onholdtime_label')}
          value={
            onHoldTime > 0
              ? Strings.formatValue('ret_cycle_holdtime_value', ...get24Time(onHoldTime))
              : Strings.getLang('ret_please_select')
          }
          onClick={handleSelectOnholdTime}
        />
        {/* 关闭时长 */}
        <Cell
          disabled={saving}
          title={Strings.getLang('ret_cycle_offholdtime_label')}
          value={
            offHoldTime > 0
              ? Strings.formatValue('ret_cycle_holdtime_value', ...get24Time(offHoldTime))
              : Strings.getLang('ret_please_select')
          }
          onClick={handleSelectOffholdTime}
        />
        {/* 删除 */}
        {+id >= 0 && (
          <View onClick={handleDelete} hoverClassName={saving ? '' : 'hover'} className={styles.deleteBtn}>
            {Strings.getLang('delete')}
          </View>
        )}
      </ScrollView>
      <ConflictModal />
      <Dialog id="smart-dialog" />
      <GlobalActionSheet />
      <GlobalActionSheetTimePicker />
    </Container>
  );
};

export default AddCycle;
