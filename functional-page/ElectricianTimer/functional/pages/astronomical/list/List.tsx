import Strings from '@/i18n';
import { hideLoading, navigateTo, showLoading, showToast } from '@ray-js/ray';
import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDevice } from '@ray-js/panel-sdk';
import TimerItem from '@/components/timer-item';
import { FuncType } from '@/constant';
import { debounce, get24Time } from '@/utils';
import { config } from '@/config';
import {
  deleteAstronomical,
  disabledAstronomical,
  enabledAstronomical,
  useAstronomical,
  useAstronomicalList,
} from '@/redux/modules/astronomicalSlice';
import { DialogInstance } from '@ray-js/smart-ui';
import { useCommon } from '@/redux/modules/commonSlice';

const OffType: Record<string, 'before' | 'at' | 'after'> = {
  '-1': 'before',
  '0': 'at',
  '1': 'after',
};

interface Props {
  relativePath: string;
}

const AstronomicalList: FC<Props> = ({ relativePath }) => {
  const dispatch = useDispatch();
  const { dpNames } = useCommon();
  const devInfo = useDevice((d) => d.devInfo);
  const astronomical = useAstronomical();
  const list = useAstronomicalList();
  const handleEdit = useCallback(
    debounce((id: string | number, type: FuncType) => {
      navigateTo({ url: `${relativePath}astronomical/add/index?id=${id}` });
    }),
    [],
  );
  const handleStatus = useCallback(
    debounce(async (id: string, type: FuncType, status: boolean) => {
      const exist = astronomical.list.find((item) => item.id === id);
      if (exist) {
        if (status) {
          const res = await dispatch(
            enabledAstronomical({
              bizId: devInfo.groupId || devInfo.devId,
              timerId: id,
            }),
          );
          // @ts-expect-error
          if (res.type.indexOf('/rejected') > 0) {
            showToast({
              icon: 'error',
              title: Strings.getLang('ret_open_failure'),
            });
          }
        } else {
          const res = await dispatch(
            disabledAstronomical({
              bizId: devInfo.groupId || devInfo.devId,
              timerId: id,
            }),
          );
          // @ts-expect-error
          if (res.type.indexOf('/rejected') > 0) {
            showToast({
              icon: 'error',
              title: Strings.getLang('ret_forbbiden_failure'),
            });
          }
        }
      }
    }),
    [astronomical.list],
  );
  const handleDelete = useCallback(async (id: string, type: FuncType) => {
    DialogInstance.confirm({
      title: Strings.getLang('ret_tips'),
      message: Strings.getLang('ret_delete_timer_tips'),
      confirmButtonText: Strings.getLang('confirm'),
      cancelButtonText: Strings.getLang('cancel'),
      beforeClose: async (action) => {
        if (action === 'confirm') {
          const res = await dispatch(
            deleteAstronomical({
              bizId: devInfo.groupId || devInfo.devId,
              timerId: id,
            }),
          );
          // @ts-expect-error
          if (res.type === 'deleteAstronomical/rejected') {
            showToast({
              icon: 'error',
              title: Strings.getLang('ret_delete_failure'),
            });
          }
        }

        return Promise.resolve(true);
      },
    });
  }, []);

  return (
    <>
      {list.map((item) => {
        // dp处理
        let action = '';
        // 是否只有一个开关
        const switches = Object.keys(item.dps).map((id) => {
          const code = devInfo.idCodes[id];
          if (!action && typeof item.dps[id] === 'boolean') {
            action = `${Strings.getLang('ret_action')}：${Strings.getLang(`ret_${item.dps[id] ? 'on' : 'off'}`)}`;
          }
          return dpNames[code] || Strings.getDpLang(code);
        });

        const labels: Array<string | number> = [];
        if (item.astronomicalType === 0) {
          labels.push(Strings.getLang(`ret_sunrise_${OffType[item.offsetType]}`));
        } else {
          labels.push(Strings.getLang(`ret_sunset_${OffType[item.offsetType]}`));
        }

        if (item.offsetType !== 0) {
          const infos = item.time.split(':');
          const time = get24Time(Number(infos[0]) * 60 + Number(infos[1]));
          labels.push(time[0]);
          labels.push(Strings.getLang('ret_hour'));
          labels.push(time[1]);
          labels.push(Strings.getLang('ret_minute'));
        }

        return (
          <TimerItem
            key={item.id}
            type={FuncType.normal}
            id={item.id}
            label={labels}
            weeks={item.loops.split('').map((item) => Number(item))}
            status={item.status === 1}
            switches={config.switchDps.length === 1 ? '' : switches.join('、')}
            action={action}
            onClick={handleEdit}
            onStatus={handleStatus}
            onDelete={handleDelete}
          />
        );
      })}
    </>
  );
};

export default AstronomicalList;
