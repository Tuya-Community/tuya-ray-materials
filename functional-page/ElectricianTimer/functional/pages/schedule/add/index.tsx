import Container from '@/components/container';
import TimerPicker from '@/components/timer-picker';
import TopBar from '@/components/topBar';
import Week from '@/components/week';
import Strings from '@/i18n';
import { ScrollView, View, router, showToast, useQuery } from '@ray-js/ray';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { config } from '@/config';
import Cell from '@/components/cell';
import { useDevice } from '@ray-js/panel-sdk';
import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import GlobalActionSheet, { ActionSheetInstance } from '@/components/action-sheet';
import ConflictModal from '@/components/conflict';
import { useConfig } from '@/hooks/useConfig';
import { debounce } from '@/utils';
import Loading from '@/components/loading';
import { useCloudTimers } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { useCommon } from '@/redux/modules/commonSlice';
import { addCloudTimer, removeCloudTimer, updateCloudTimer, isLANOnline } from '@ray-js/electrician-timing-sdk';
import styles from './index.module.less';

const AddSchedule: FC = () => {
  useConfig();
  const { dpNames } = useCommon();
  const [saving, setSaving] = useState(false);
  const { list, loading } = useCloudTimers();
  const devInfo = useDevice((d) => d.devInfo);
  const { id } = useQuery();
  const [weeks, setWeeks] = useState<Array<1 | 0>>([0, 0, 0, 0, 0, 0, 0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const [switches, setSwitches] = useState(() => {
    if (config.switchDps.length === 1) {
      return [config.switchDps[0].code];
    }
    return [];
  });
  // 开关状态
  const [status, setStatus] = useState(true);

  const handleSave = useCallback(async () => {
    if (saving) {
      return;
    }
    if (!devInfo.isOnline) {
      // 设备不在线，不能添加
      showToast({
        icon: 'error',
        title: Strings.getLang('ret_schedule_offline_tip'),
      });
      return;
    }

    // 如果是局域网情况，则提示不支持
    const lanOnline = await isLANOnline();
    if (lanOnline) {
      showToast({
        icon: 'error',
        title: Strings.getLang('ret_schedule_lan_tip'),
      });
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

    setSaving(true);
    try {
      let res;
      if (id) {
        res = await updateCloudTimer(
          {
            id,
            startTime: time,
            week: weeks,
            status: true,
            actions: switches.reduce((res, code) => {
              res.push({ code, value: status });
              return res;
            }, []),
            aliasName: '',
            isAppPush: true,
          },
          { useDefaultModal: true },
        );
      } else {
        res = await addCloudTimer(
          {
            startTime: time,
            week: weeks,
            status: true,
            actions: switches.reduce((res, code) => {
              res.push({ code, value: status });
              return res;
            }, []),
            aliasName: '',
            isAppPush: true,
          },
          { useDefaultModal: true },
        );
      }
      if (res === 'success') {
        router.back();
      }
    } catch (e) {
      showToast({ title: Strings.getLang('ret_save_failure'), icon: 'error' });
    } finally {
      setSaving(false);
    }
  }, [saving, weeks, time, switches, status, devInfo.isOnline]);
  const handleBack = useCallback(() => {
    DialogInstance.confirm({
      title: Strings.getLang('ret_tips'),
      message: Strings.getLang('ret_close_schedule_tip'),
      confirmButtonText: Strings.getLang('confirm'),
      cancelButtonText: Strings.getLang('cancel'),
      beforeClose: (action) => {
        if (action === 'confirm') {
          router.back();
        }
        return Promise.resolve(true);
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
          const selection = detail.map((item) => item.value) as string[];
          // 只保留当前选中的，和不在当前开关选择范围内的开关
          return list.filter((x) => !config.switchCodes.includes(x)).concat(selection);
        });
      },
    });
  }, [switches, dpNames]);

  const handleDelete = useCallback(
    debounce(async () => {
      DialogInstance.confirm({
        title: Strings.getLang('ret_tips'),
        message: Strings.getLang('ret_delete_timer_tips'),
        confirmButtonText: Strings.getLang('confirm'),
        cancelButtonText: Strings.getLang('cancel'),
        beforeClose: async (action) => {
          if (action === 'confirm') {
            try {
              await removeCloudTimer(id);
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
      }).catch(() => {
        // 不处理
      });
    }),
    [],
  );
  const handleChangeTime = useCallback((value: number) => {
    setTime(value);
  }, []);
  const handleChangeWeeks = useCallback((values) => {
    setWeeks(values);
  }, []);
  const handleSwitch = useCallback((v) => {
    setStatus(v);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (id) {
        const timer = list.find((item) => item.id === id);
        if (timer) {
          setWeeks([...timer.week]);
          setTime(timer.startTime);
          let action: boolean;
          // 处理开关
          setSwitches(
            timer.actions.map((item) => {
              if (typeof action === 'undefined') {
                action = item.value as boolean;
              }
              return item.code;
            }),
          );
          setStatus(action);
        }
      }
    }
  }, [loading]);

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
        singlePicker
        pmText={Strings.getLang('ret_pm')}
        amText={Strings.getLang('ret_am')}
        is12Hours={!config.is24Hour}
        onTimerChange={handleChangeTime}
        pickerFontLineHeight={48}
        startTime={time}
      />
      <ScrollView scrollY className={styles.scroll} refresherTriggered={false}>
        <Week weeks={weeks} onChange={handleChangeWeeks} />
        {/* 是否只有一个开关 */}
        {config.switchDps.length > 1 && (
          <Cell
            title={Strings.getLang('ret_switch_selection')}
            value={
              switches.length
                ? switches.map((item) => dpNames[item] || Strings.getDpLang(item)).join('、')
                : Strings.getLang('ret_please_select')
            }
            onClick={handleShowSwitches}
          />
        )}
        {/* 执行动作 */}
        <Cell title={Strings.getLang('ret_action')} value={status} type="switch" onChange={handleSwitch} />
        {/* 删除 */}
        {!!id && (
          <View onClick={handleDelete} hoverClassName="hover" className={styles.deleteBtn}>
            {Strings.getLang('delete')}
          </View>
        )}
      </ScrollView>
      <Dialog id="smart-dialog" />
      <GlobalActionSheet />
      <ConflictModal />
    </Container>
  );
};

export default AddSchedule;
