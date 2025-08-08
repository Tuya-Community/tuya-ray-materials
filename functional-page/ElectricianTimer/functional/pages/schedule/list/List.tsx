import Strings from '@/i18n';
import { navigateTo, showToast } from '@ray-js/ray';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import TimerItem from '@/components/timer-item';
import { FuncType } from '@/constant';
import { debounce, formatTime } from '@/utils';
import { config } from '@/config';
import { DialogInstance, ToastInstance } from '@ray-js/smart-ui';
import { useCloudTimers } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { removeCloudTimer, updateCloudTimerStatus } from '@ray-js/electrician-timing-sdk';
import { useSwitchFilter } from '@/hooks/useSwitchFilter';
import { useCommon } from '@/redux/modules/commonSlice';

interface Props {
  relativePath: string;
}

const ScheduleList: FC<Props> = ({ relativePath }) => {
  const { list, loading } = useCloudTimers();
  // 根据dp过滤掉不需要显示的开关
  const data = useSwitchFilter(list);
  const { dpNames } = useCommon();

  const handleEdit = useCallback(
    debounce((id: string | number, type: FuncType) => {
      navigateTo({ url: `${relativePath}schedule/add/index?id=${id}` });
    }),
    [],
  );
  const handleStatus = useCallback(
    debounce(async (id: string | number, type: FuncType, status: boolean) => {
      const found = list.find((item) => item.id === id);
      try {
        await updateCloudTimerStatus({ ...found, status }, { useDefaultModal: true });
      } catch (e) {
        showToast({
          icon: 'error',
          title: Strings.getLang(status ? 'ret_open_failure' : 'ret_forbbiden_failure'),
        });
      }
    }),
    [list],
  );
  const handleDelete = useCallback(
    debounce(async (id: string, type: FuncType) => {
      DialogInstance.confirm({
        title: Strings.getLang('ret_tips'),
        message: Strings.getLang('ret_delete_timer_tips'),
        confirmButtonText: Strings.getLang('confirm'),
        cancelButtonText: Strings.getLang('cancel'),
        beforeClose: async (action) => {
          if (action === 'confirm') {
            try {
              await removeCloudTimer(id);
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

  return (
    <>
      {data.map((item) => {
        const { ampm, text } = formatTime(item.startTime);
        // dp处理
        let action = '';
        const switches = item.actions.map((item) => {
          if (!action && typeof item.value === 'boolean') {
            action = `${Strings.getLang('ret_action')}：${Strings.getLang(`ret_${item.value ? 'on' : 'off'}`)}`;
          }
          return dpNames[item.code] || Strings.getDpLang(item.code);
        });
        const labels: Array<string> = [];
        if (ampm) {
          // @ts-expect-error
          labels.push(Strings.getLang(`ret_${ampm}`));
        }
        labels.push(text);
        return (
          <TimerItem
            key={item.id}
            type={FuncType.normal}
            id={item.id}
            label={labels}
            weeks={item.week}
            status={item.status}
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

export default ScheduleList;
