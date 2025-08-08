import Container from '@/components/container';
import TopBar from '@/components/topBar';
import Strings from '@/i18n';
import { ScrollView, View, router, showToast, useQuery } from '@ray-js/ray';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import Loading from '@/components/loading';
import { config } from '@/config';
import Cell from '@/components/cell';
import ConflictModal from '@/components/conflict';
import GlobalActionSheet, { ActionSheetInstance } from '@/components/action-sheet';
import CountdownPicker from '@/components/countdown-picker';
import { useConfig } from '@/hooks/useConfig';
import { removeTimer } from '@/utils';
import { useEleInching } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { EleInchingData } from '@ray-js/electrician-timing-sdk/lib/interface';
import { electri } from '@ray-js/electrician-timing-sdk';
import { useCommon } from '@/redux/modules/commonSlice';
import styles from './index.module.less';

const timeType: Array<TimeType> = ['minute', 'second'];

const AddInching: FC = () => {
  useConfig();
  const { dpNames } = useCommon();
  const [saving, setSaving] = useState(false);
  const timers = useEleInching();
  const { id } = useQuery();
  const [time, setTime] = useState(60);
  const [switches, setSwitches] = useState([]);
  // const [status, setStatus] = useState(true);

  const handleDoSave = useCallback(async (data: EleInchingData) => {
    setSaving(true);
    try {
      let res;
      if (+id >= 0) {
        res = await electri.inching.update(data, { useDefaultModal: true });
      } else {
        res = await electri.inching.add(data, { useDefaultModal: true });
      }
      if (res === 'success') {
        router.back();
      }
    } catch {
      showToast({
        icon: 'error',
        title: Strings.getLang('ret_save_failure'),
      });
    } finally {
      setSaving(false);
    }
  }, []);

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

    const data: EleInchingData = {
      id: +id >= 0 ? +id : timers.length,
      time,
      actions: switches.map((item) => {
        return { code: item };
      }),
      status: true,
      type: 'sdk_inching',
    };

    // 是否有重复添加
    // const repeatList = await electri.inching.validateRepeat(data);
    // if (repeatList) {
    //   const switches: string[] = [];
    //   repeatList.forEach((item) => item.actions.forEach((x) => switches.push(Strings.getDpLang(x.code))));
    //   DialogInstance.confirm({
    //     title: Strings.getLang('ret_tips'),
    //     message: Strings.formatValue('ret_inching_repeat', switches.join('、')),
    //     confirmButtonText: Strings.getLang('confirm'),
    //     cancelButtonText: Strings.getLang('cancel'),
    //     beforeClose: (action) => {
    //       if (action === 'confirm') {
    //         handleDoSave(data);
    //       }
    //       return true;
    //     },
    //   }).catch(() => {
    //     //
    //   });
    //   return;
    // }
    handleDoSave(data);
  }, [time, switches, timers, saving]);

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
  // const handleChangeStatus = useCallback((v) => {
  //   setStatus(v);
  // }, []);

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
            await removeTimer(+id, timers, electri.inching.update, electri.inching.remove);
            router.back();
          } catch {
            showToast({
              icon: 'error',
              title: Strings.getLang('ret_delete_failure'),
            });
          }
        }
        return true;
      },
    });
  }, [saving]);
  const handleChangeTime = useCallback((time: number) => {
    setTime(time);
  }, []);
  useEffect(() => {
    if (!config.inchingCode) {
      DialogInstance.alert({
        title: Strings.getLang('ret_not_support_inching'),
        confirmButtonText: Strings.getLang('confirm'),
      });
      return;
    }
    if (+id >= 0) {
      if (timers.length > 0) {
        const timer = timers.find((item) => item.id === +id);
        if (timer) {
          setTime(timer.time);
          // setStatus(timer.status);
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
        title={Strings.getLang('ret_inching_setting')}
        backText={Strings.getLang('cancel')}
        menuText={saving ? <Loading loading /> : Strings.getLang('save')}
        menuClassName={saving ? styles.menuCenter : ''}
        onMenuClick={handleSave}
        onBack={handleBack}
      />
      <Cell className={styles.desc} type="desc" title="" subTitle={Strings.getLang('ret_inching_desc')} />
      {/* 时间选择 */}
      <CountdownPicker min={2} max={3600} value={time} itemHeight={56} type={timeType} onChange={handleChangeTime} />
      <ScrollView scrollY className={styles.scroll} refresherTriggered={false}>
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
        {/* 状态变更 */}
        {/* <Cell
          disabled={saving}
          title={Strings.getLang('ret_inching_switch')}
          type="switch"
          value={status}
          onChange={handleChangeStatus}
        /> */}
        {/* 删除 */}
        {+id >= 0 && (
          <View onClick={handleDelete} hoverClassName={saving ? '' : 'hover'} className={styles.deleteBtn}>
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

export default AddInching;
