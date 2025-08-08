import Container from '@/components/container';
import TopBar from '@/components/topBar';
import Week from '@/components/week';
import Strings from '@/i18n';
import { ScrollView, View, router, showToast, useQuery, map, onAppShow, offAppShow } from '@ray-js/ray';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { config } from '@/config';
import Cell from '@/components/cell';
import { useDevice, utils } from '@ray-js/panel-sdk';
import {
  createAstronomical,
  deleteAstronomical,
  editAstronomical,
  fetchAstronomicalList,
  useAstronomical,
} from '@/redux/modules/astronomicalSlice';
import AstronomicalTimePicker from '@/components/astronomical-time-picker';
import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import GlobalActionSheet, { ActionSheetInstance } from '@/components/action-sheet';
import { useConfig } from '@/hooks/useConfig';
import Loading from '@/components/loading';
import { useCloudTimers } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { useCommon } from '@/redux/modules/commonSlice';
import { isLocalOnline } from '@ray-js/electrician-timing-sdk';
import { AstronomicalParams } from '@/interface';
import styles from './index.module.less';

const { getLocation } = map;

const AddAstronomical: FC = () => {
  useConfig();
  const [saving, setSaving] = useState(false);
  const devInfo = useDevice((d) => d.devInfo);
  const { dpNames } = useCommon();
  const { list: cloudTimers } = useCloudTimers();
  const dispatch = useDispatch();
  const astronomical = useAstronomical();
  const { id, type = 'sunset' } = useQuery();
  const [offsetType, setOffsetType] = useState<-1 | 0 | 1>(0);
  const [astronomicalType, setAstronomicalType] = useState<0 | 1>(type === 'sunset' ? 1 : 0);
  const [weeks, setWeeks] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [time, setTime] = useState(0);
  const [switches, setSwitches] = useState(() => {
    if (config.switchDps.length === 1) {
      return [config.switchDps[0].code];
    }
    return [];
  });
  const [status, setStatus] = useState(true);
  const [location, setLocatioin] = useState({ latitude: 0, longitude: 0 });

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
    // 如果是本地连接情况，则提示不支持
    const localOnline = await isLocalOnline();
    if (localOnline) {
      showToast({
        icon: 'error',
        title: Strings.getLang('ret_schedule_local_tip'),
      });
      return;
    }
    // 由于天文定时和云定时共用了定时上限，这里也做一个判断提示，以便于排查问题
    if (cloudTimers.length + astronomical.list.length >= 30) {
      DialogInstance.alert({
        title: Strings.formatValue('ret_astronomical_cloud_max', 30),
        confirmButtonText: Strings.getLang('confirm'),
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

    let res;
    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    const data: AstronomicalParams = {
      astronomicalType,
      bizId: devInfo.groupId || devInfo.devId,
      bizType: devInfo.groupId ? 1 : 0,
      time: `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
      loops: weeks.join(''),
      timezone: utils.timezone(),
      offsetType,
      dps: switches.reduce((res, cur) => {
        const dpId = devInfo.codeIds[cur];
        res[dpId] = status;
        return res;
      }, {} as Record<string, any>),
      lon: location.longitude,
      lat: location.latitude,
    };

    setSaving(true);
    if (id) {
      res = await dispatch(editAstronomical({ ...data, id }));
    } else {
      res = await dispatch(createAstronomical(data));
    }

    setSaving(false);

    if (res.type.indexOf('/rejected') < 0) {
      router.back();
    } else {
      DialogInstance.alert({
        title: Strings.getLang('ret_save_failure'),
        confirmButtonText: Strings.getLang('confirm'),
      });
    }
  }, [
    cloudTimers.length,
    astronomical.list.length,
    saving,
    weeks,
    time,
    switches,
    status,
    offsetType,
    astronomicalType,
    location,
    devInfo.isOnline,
  ]);
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
          // 只保留当关选中的，和不在当前开关选择范围内的开关
          return list.filter((x) => !config.switchCodes.includes(x)).concat(selection);
        });
      },
    });
  }, [switches, dpNames]);

  const handleDelete = useCallback(() => {
    DialogInstance.confirm({
      title: Strings.getLang('ret_tips'),
      message: Strings.getLang('ret_delete_timer_tips'),
      confirmButtonText: Strings.getLang('confirm'),
      cancelButtonText: Strings.getLang('cancel'),
      beforeClose: async (action) => {
        if (action === 'confirm') {
          const res = await dispatch(
            deleteAstronomical({ bizId: devInfo.groupId || devInfo.devId, timerId: id as string }),
          );
          // @ts-expect-error
          if (res.type === 'deleteAstronomical/rejected') {
            showToast({
              icon: 'error',
              title: Strings.getLang('ret_delete_failure'),
            });
            return Promise.resolve(true);
          }
          router.back();
        }
        return Promise.resolve(true);
      },
    });
  }, []);
  const handleChangeTime = useCallback((type: 1 | 0 | -1, value: number) => {
    setOffsetType(type);
    setTime(value);
  }, []);
  const handleChangeWeeks = useCallback((values) => {
    setWeeks(values);
  }, []);
  const handleSwitch = useCallback((v) => {
    setStatus(v);
  }, []);

  useEffect(() => {
    if (id) {
      if (astronomical.status === 'loaded') {
        const timer = astronomical.list.find((item) => item.id.toString() === id);
        if (timer) {
          setWeeks(timer.loops.split('').map((x) => +x));
          const infos = timer.time.split(':');
          setTime(Number(infos[0]) * 60 + Number(infos[1]));
          setOffsetType(timer.offsetType);
          setAstronomicalType(timer.astronomicalType);
          let action: boolean;
          // 处理开关
          setSwitches(
            Object.keys(timer.dps).map((id) => {
              if (typeof action === 'undefined') {
                action = timer.dps[id];
              }
              return devInfo.idCodes[id];
            }),
          );
          setStatus(action);
        }
      } else if (astronomical.status === 'idle') {
        dispatch(fetchAstronomicalList(devInfo.groupId || devInfo.devId));
      }
    }
  }, [astronomical.status]);

  useEffect(() => {
    const fetchLocation = () => {
      getLocation({
        type: 'wgs84',
        altitude: false,
        isHighAccuracy: false,
        highAccuracyExpireTime: 0,
        success: (res) => {
          console.log('location', res);
          setLocatioin(res);
        },
        fail: (error) => {
          console.error(error);
        },
      });
    };
    fetchLocation();
    onAppShow(fetchLocation);
    return () => {
      offAppShow(fetchLocation);
    };
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
      <AstronomicalTimePicker
        value={time}
        type={astronomicalType}
        offsetType={offsetType}
        onChange={handleChangeTime}
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
      <GlobalActionSheet />
      <Dialog id="smart-dialog" />
    </Container>
  );
};

export default AddAstronomical;
